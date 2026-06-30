// ─────────────────────────────────────────────────────────────────────────────
// Server-side JSON database. Real persistence on the server (not the browser),
// so data survives sign-out / sign-in and is shared across devices that hit the
// same server. No external keys required. For higher scale this single file can
// be swapped for Postgres/SQLite behind the same helper API.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import fs from "node:fs";
import path from "node:path";
import type {
  Plan,
  SubscriptionStatus,
  Resume,
  CoverLetter,
  PaymentRequest,
} from "@/lib/types";

export interface ServerUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  planActivatedAt: number | null;
  planExpiresAt: number | null;
  createdAt: number;
  lastSeenAt: number;
  resetOtpHash?: string;
  resetOtpExpires?: number;
}

interface DB {
  users: Record<string, ServerUser>;
  resumes: Record<string, Resume & { ownerUid: string }>;
  coverLetters: Record<string, CoverLetter & { ownerUid: string }>;
  paymentRequests: Record<string, PaymentRequest>;
  analytics: { visits: number; daily: Record<string, number> };
}

const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function emptyDB(): DB {
  return { users: {}, resumes: {}, coverLetters: {}, paymentRequests: {}, analytics: { visits: 0, daily: {} } };
}

function load(): DB {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<DB>;
    return { ...emptyDB(), ...parsed } as DB;
  } catch {
    return emptyDB();
  }
}

function save(db: DB) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = DB_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
  fs.renameSync(tmp, DB_FILE); // atomic-ish replace
}

/** Read-modify-write helper to keep mutations consistent. */
export function tx<T>(fn: (db: DB) => T): T {
  const db = load();
  const result = fn(db);
  save(db);
  return result;
}

export function read<T>(fn: (db: DB) => T): T {
  return fn(load());
}

export const newId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

// ── User helpers ─────────────────────────────────────────────────────────────
export function findUserByEmail(email: string): ServerUser | undefined {
  const e = email.toLowerCase();
  return read((db) => Object.values(db.users).find((u) => u.email.toLowerCase() === e));
}
export function getUser(id: string): ServerUser | undefined {
  return read((db) => db.users[id]);
}
export function touchUser(id: string) {
  tx((db) => {
    if (db.users[id]) db.users[id].lastSeenAt = Date.now();
  });
}

export function setResetOtp(id: string, hash: string, expires: number) {
  tx((db) => {
    if (db.users[id]) {
      db.users[id].resetOtpHash = hash;
      db.users[id].resetOtpExpires = expires;
    }
  });
}

export function updatePassword(id: string, passwordHash: string) {
  tx((db) => {
    if (db.users[id]) {
      db.users[id].passwordHash = passwordHash;
      delete db.users[id].resetOtpHash;
      delete db.users[id].resetOtpExpires;
    }
  });
}

// ── Resume / cover-letter helpers ────────────────────────────────────────────
export const listResumes = (uid: string) =>
  read((db) => Object.values(db.resumes).filter((r) => r.ownerUid === uid).sort((a, b) => b.updatedAt - a.updatedAt));
export const getResume = (uid: string, id: string) =>
  read((db) => (db.resumes[id]?.ownerUid === uid ? db.resumes[id] : undefined));
export const listCoverLetters = (uid: string) =>
  read((db) => Object.values(db.coverLetters).filter((c) => c.ownerUid === uid).sort((a, b) => b.updatedAt - a.updatedAt));
export const getCoverLetter = (uid: string, id: string) =>
  read((db) => (db.coverLetters[id]?.ownerUid === uid ? db.coverLetters[id] : undefined));

// ── Subscriptions ────────────────────────────────────────────────────────────
import { PLAN_PRICES } from "@/lib/types";

/**
 * Grant (or revoke) a plan. Activates for exactly the purchased number of months
 * from this moment. This is the single source of truth for premium access.
 */
export function grantPlan(uid: string, plan: Plan): ServerUser | undefined {
  return tx((db) => {
    const u = db.users[uid];
    if (!u) return undefined;
    if (plan === "free") {
      u.plan = "free";
      u.subscriptionStatus = "inactive";
      u.planActivatedAt = null;
      u.planExpiresAt = null;
    } else {
      const months = PLAN_PRICES[plan].months;
      const now = Date.now();
      u.plan = plan;
      u.subscriptionStatus = "active";
      u.planActivatedAt = now;
      u.planExpiresAt = now + months * 30 * 24 * 60 * 60 * 1000;
    }
    return u;
  });
}

// ── Payment requests ─────────────────────────────────────────────────────────
export const savePaymentRequest = (pr: PaymentRequest) =>
  tx((db) => {
    db.paymentRequests[pr.id] = pr;
  });
export const getPaymentRequest = (id: string) => read((db) => db.paymentRequests[id]);
export const listAllPaymentRequests = () =>
  read((db) =>
    Object.values(db.paymentRequests).sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return b.createdAt - a.createdAt;
    })
  );
export const listUserPaymentRequests = (uid: string) =>
  read((db) => Object.values(db.paymentRequests).filter((r) => r.uid === uid).sort((a, b) => b.createdAt - a.createdAt));
export const setPaymentRequestStatus = (id: string, status: PaymentRequest["status"]) =>
  tx((db) => {
    if (db.paymentRequests[id]) {
      db.paymentRequests[id].status = status;
      db.paymentRequests[id].reviewedAt = Date.now();
    }
  });

// ── Analytics + admin snapshot ───────────────────────────────────────────────
export const bumpVisits = () =>
  tx((db) => {
    db.analytics.visits += 1;
    const d = new Date().toISOString().slice(0, 10);
    db.analytics.daily[d] = (db.analytics.daily[d] ?? 0) + 1;
  });

export const adminSnapshot = () =>
  read((db) => ({
    users: Object.values(db.users),
    resumeCount: Object.keys(db.resumes).length,
    coverLetterCount: Object.keys(db.coverLetters).length,
    paymentRequests: Object.values(db.paymentRequests),
    visits: db.analytics.visits,
  }));

export type { Plan, Resume, CoverLetter, PaymentRequest, SubscriptionStatus };
