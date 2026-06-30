import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { getCoverLetter, deleteCoverLetter } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const cl = await getCoverLetter(user.id, id);
  if (!cl) return NextResponse.json({ coverLetter: null }, { status: 404 });
  return NextResponse.json({ coverLetter: cl });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await deleteCoverLetter(user.id, id);
  return NextResponse.json({ ok: true });
}
