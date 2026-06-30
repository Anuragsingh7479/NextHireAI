import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { listResumes, upsertResume } from "@/lib/server/db";
import type { Resume } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ resumes: await listResumes(user.id) });
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const resume = (await req.json()) as Resume;
  if (!resume?.id) return NextResponse.json({ error: "Invalid resume." }, { status: 400 });
  await upsertResume({ ...resume, ownerUid: user.id });
  return NextResponse.json({ ok: true });
}
