import { NextResponse } from "next/server";
import { getSessionUser, publicUser } from "@/lib/server/auth";
import { touchUser } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ user: null });
  touchUser(user.id);
  return NextResponse.json({ user: publicUser(user) });
}
