import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { tx, getCoverLetter } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const cl = getCoverLetter(user.id, id);
  if (!cl) return NextResponse.json({ coverLetter: null }, { status: 404 });
  return NextResponse.json({ coverLetter: cl });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  tx((db) => {
    if (db.coverLetters[id]?.ownerUid === user.id) delete db.coverLetters[id];
  });
  return NextResponse.json({ ok: true });
}
