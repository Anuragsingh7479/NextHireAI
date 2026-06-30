import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { grantPlan } from "@/lib/server/db";
import type { Plan } from "@/lib/types";

export const runtime = "nodejs";

/** Admin: manually grant/revoke a user's plan. Body: { uid, plan }. */
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { uid, plan } = (await req.json()) as { uid: string; plan: Plan };
    if (!uid || !plan) return NextResponse.json({ error: "uid and plan required." }, { status: 400 });
    const updated = grantPlan(uid, plan);
    if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "not-admin" ? 403 : 401 });
  }
}
