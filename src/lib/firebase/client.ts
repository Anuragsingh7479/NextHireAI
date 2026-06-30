// ─────────────────────────────────────────────────────────────────────────────
// Firebase client SDK (browser). Initializes only when the public env vars are
// present. `firebaseEnabled` lets the rest of the app fall back to demo mode
// when no project is configured, so the app always builds and runs.
// ─────────────────────────────────────────────────────────────────────────────

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | undefined;
let authInstance: Auth | undefined;
let dbInstance: Firestore | undefined;
let googleProviderInstance: GoogleAuthProvider | undefined;

if (firebaseEnabled) {
  app = getApps().length ? getApp() : initializeApp(config);
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  googleProviderInstance = new GoogleAuthProvider();
  // Keep the session across browser restarts (data persists on re-login).
  if (typeof window !== "undefined") {
    setPersistence(authInstance, browserLocalPersistence).catch(() => {});
  }
}

// Non-null assertions are safe at call sites because every caller guards on
// `firebaseEnabled` first.
export const auth = authInstance as Auth;
export const db = dbInstance as Firestore;
export const googleProvider = googleProviderInstance as GoogleAuthProvider;
