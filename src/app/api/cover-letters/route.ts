import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { tx, listCoverLetters } from "@/lib/server/db";
import type { CoverLetter } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ coverLetters: listCoverLetters(user.id) });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cl = (await req.json()) as CoverLetter;
  if (!cl?.id) return NextResponse.json({ error: "Invalid cover letter." }, { status: 400 });
  tx((db) => {
    db.coverLetters[cl.id] = { ...cl, ownerUid: user.id };
  });
  return NextResponse.json({ ok: true });
}
