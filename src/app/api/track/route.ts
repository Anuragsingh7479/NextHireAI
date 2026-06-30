import { NextResponse } from "next/server";
import { bumpVisits } from "@/lib/server/db";

export const runtime = "nodejs";

// Visitor counter — incremented once per browser session.
export async function POST() {
  try {
    await bumpVisits();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
