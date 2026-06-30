// ─────────────────────────────────────────────────────────────────────────────
// Client data access — talks to the server API (session-authenticated by
// cookie). Data lives in the server database, so it persists across sign-out /
// sign-in and devices. The `uid` arguments are kept for call-site compatibility;
// the server derives the real owner from the session.
// ─────────────────────────────────────────────────────────────────────────────

import type { Resume, CoverLetter } from "./types";

async function json<T>(res: Response, key: string, fallback: T): Promise<T> {
  if (!res.ok) return fallback;
  const data = await res.json().catch(() => ({}));
  return (data[key] ?? fallback) as T;
}

// ── Resumes ─────────────────────────────────────────────────────────────────
export async function listResumes(_uid: string): Promise<Resume[]> {
  return json(await fetch("/api/resumes"), "resumes", [] as Resume[]);
}
export async function getResume(_uid: string, id: string): Promise<Resume | undefined> {
  const res = await fetch(`/api/resumes/${id}`);
  return json<Resume | undefined>(res, "resume", undefined);
}
export async function saveResume(_uid: string, resume: Resume): Promise<void> {
  await fetch("/api/resumes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resume),
  });
}
export async function deleteResume(_uid: string, id: string): Promise<void> {
  await fetch(`/api/resumes/${id}`, { method: "DELETE" });
}

// ── Cover letters ─────────────────────────────────────────────────────────────
export async function listCoverLetters(_uid: string): Promise<CoverLetter[]> {
  return json(await fetch("/api/cover-letters"), "coverLetters", [] as CoverLetter[]);
}
export async function getCoverLetter(_uid: string, id: string): Promise<CoverLetter | undefined> {
  const res = await fetch(`/api/cover-letters/${id}`);
  return json<CoverLetter | undefined>(res, "coverLetter", undefined);
}
export async function saveCoverLetter(_uid: string, cl: CoverLetter): Promise<void> {
  await fetch("/api/cover-letters", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cl),
  });
}
export async function deleteCoverLetter(_uid: string, id: string): Promise<void> {
  await fetch(`/api/cover-letters/${id}`, { method: "DELETE" });
}

export { uid, blankResumeData } from "./demo/store";
