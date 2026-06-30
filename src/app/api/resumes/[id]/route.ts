import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { tx, getResume } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const resume = getResume(user.id, id);
  if (!resume) return NextResponse.json({ resume: null }, { status: 404 });
  return NextResponse.json({ resume });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  tx((db) => {
    if (db.resumes[id]?.ownerUid === user.id) delete db.resumes[id];
  });
  return NextResponse.json({ ok: true });
}
