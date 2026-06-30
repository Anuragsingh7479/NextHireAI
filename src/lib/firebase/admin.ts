// ─────────────────────────────────────────────────────────────────────────────
// Firebase Admin SDK (server only). Used by API routes to verify ID tokens and
// to write privileged fields (subscription status, payments) that clients are
// not allowed to write directly. Initializes lazily from the service account
// env vars. NEVER import this into a client component.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import {
  getApps,
  initializeApp,
  cert,
  type App,
} from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
// The private key is stored with literal "\n" — convert back to real newlines.
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const adminEnabled = Boolean(projectId && clientEmail && privateKey);

let adminApp: App | undefined;
if (adminEnabled) {
  adminApp = getApps().length
    ? getApps()[0]
    : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export const adminAuth: Auth | null = adminApp ? getAuth(adminApp) : null;
export const adminDb: Firestore | null = adminApp ? getFirestore(adminApp) : null;

/** The single admin account allowed into the admin panel. */
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "as3331733@gmail.com").toLowerCase();

/**
 * Verify a Firebase ID token from the Authorization header and return the
 * decoded user. Throws if missing/invalid. Use in every protected API route.
 */
export async function verifyRequest(req: Request) {
  if (!adminAuth) throw new Error("admin-not-configured");
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new Error("missing-token");
  return adminAuth.verifyIdToken(token);
}

/** Verify the caller is the registered admin. Throws otherwise. */
export async function verifyAdmin(req: Request) {
  const decoded = await verifyRequest(req);
  if ((decoded.email ?? "").toLowerCase() !== ADMIN_EMAIL) throw new Error("not-admin");
  return decoded;
}
