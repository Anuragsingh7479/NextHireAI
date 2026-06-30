// ─────────────────────────────────────────────────────────────────────────────
// Demo persistence layer (localStorage).
//
// This makes the whole app functional TODAY without external services. Each
// function is a thin async API so that swapping in Firebase/Firestore later is a
// drop-in change at this boundary only — call sites won't change.
// ─────────────────────────────────────────────────────────────────────────────

import type { AppUser, Resume, CoverLetter, ResumeData, PaymentRequest } from "@/lib/types";

const KEYS = {
  user: "nh.user",
  resumes: "nh.resumes",
  coverLetters: "nh.coverLetters",
  paymentRequests: "nh.paymentRequests",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const uid = () =>
  (isBrowser() && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36));

// ── User ──────────────────────────────────────────────────────────────────
export const getUser = () => read<AppUser | null>(KEYS.user, null);
export const setUser = (u: AppUser | null) => write(KEYS.user, u);

// ── Resumes (scoped to the signed-in user) ──────────────────────────────────
function allResumes() {
  return read<Record<string, Resume[]>>(KEYS.resumes, {});
}
export function listResumes(ownerUid: string): Resume[] {
  return (allResumes()[ownerUid] ?? []).sort((a, b) => b.updatedAt - a.updatedAt);
}
export function saveResume(ownerUid: string, resume: Resume) {
  const all = allResumes();
  const list = all[ownerUid] ?? [];
  const i = list.findIndex((r) => r.id === resume.id);
  if (i >= 0) list[i] = resume;
  else list.push(resume);
  all[ownerUid] = list;
  write(KEYS.resumes, all);
}
export function getResume(ownerUid: string, id: string): Resume | undefined {
  return (allResumes()[ownerUid] ?? []).find((r) => r.id === id);
}
export function deleteResume(ownerUid: string, id: string) {
  const all = allResumes();
  all[ownerUid] = (all[ownerUid] ?? []).filter((r) => r.id !== id);
  write(KEYS.resumes, all);
}

// ── Cover letters ───────────────────────────────────────────────────────────
function allCovers() {
  return read<Record<string, CoverLetter[]>>(KEYS.coverLetters, {});
}
export function listCoverLetters(ownerUid: string): CoverLetter[] {
  return (allCovers()[ownerUid] ?? []).sort((a, b) => b.updatedAt - a.updatedAt);
}
export function saveCoverLetter(ownerUid: string, cl: CoverLetter) {
  const all = allCovers();
  const list = all[ownerUid] ?? [];
  const i = list.findIndex((c) => c.id === cl.id);
  if (i >= 0) list[i] = cl;
  else list.push(cl);
  all[ownerUid] = list;
  write(KEYS.coverLetters, all);
}
export function getCoverLetter(ownerUid: string, id: string): CoverLetter | undefined {
  return (allCovers()[ownerUid] ?? []).find((c) => c.id === id);
}
export function deleteCoverLetter(ownerUid: string, id: string) {
  const all = allCovers();
  all[ownerUid] = (all[ownerUid] ?? []).filter((c) => c.id !== id);
  write(KEYS.coverLetters, all);
}

// ── Payment requests (manual UPI flow) ──────────────────────────────────────
export function listAllPaymentRequests(): PaymentRequest[] {
  return read<PaymentRequest[]>(KEYS.paymentRequests, []).sort((a, b) => b.createdAt - a.createdAt);
}
export function listUserPaymentRequests(ownerUid: string): PaymentRequest[] {
  return listAllPaymentRequests().filter((r) => r.uid === ownerUid);
}
export function savePaymentRequest(req: PaymentRequest) {
  const all = read<PaymentRequest[]>(KEYS.paymentRequests, []);
  const i = all.findIndex((r) => r.id === req.id);
  if (i >= 0) all[i] = req;
  else all.push(req);
  write(KEYS.paymentRequests, all);
}

// ── Factory: a sensible starter resume ──────────────────────────────────────
export function blankResumeData(name = "", email = ""): ResumeData {
  return {
    fullName: name || "Your Name",
    jobTitle: "Your Job Title",
    email: email || "you@email.com",
    phone: "+91 90000 00000",
    location: "City, Country",
    website: "",
    summary:
      "A short professional summary highlighting your strengths, years of experience, and what you bring to a role.",
    experience: [
      {
        id: uid(),
        role: "Your Role",
        company: "Company",
        period: "2022 — Present",
        bullets: [
          "Describe an achievement with a measurable result.",
          "Add another accomplishment that shows impact.",
        ],
      },
    ],
    education: [{ id: uid(), degree: "Your Degree", school: "University", period: "2018 — 2022" }],
    skills: ["Communication", "Teamwork", "Problem Solving"],
    projects: [],
  };
}
