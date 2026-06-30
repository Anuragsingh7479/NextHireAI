import { NextResponse } from "next/server";
import { getSessionUser, publicUser } from "@/lib/server/auth";
import { updateUserName, getUser } from "@/lib/server/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = (await req.json()) as { name?: string };
  if (!name) return NextResponse.json({ error: "Name required." }, { status: 400 });

  await updateUserName(user.id, name);
  const updated = await getUser(user.id);
  return NextResponse.json({ user: publicUser(updated!) });
}
