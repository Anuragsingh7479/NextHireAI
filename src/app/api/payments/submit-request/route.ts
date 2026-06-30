import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { savePaymentRequest, newId } from "@/lib/server/db";
import { PLAN_PAYMENT } from "@/lib/payments";
import type { Plan, PaymentRequest } from "@/lib/types";

export const runtime = "nodejs";

/** Buyer submits proof of a manual UPI payment (screenshot + UTR). */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Please sign in." }, { status: 401 });

  const { plan, utr, screenshot } = (await req.json()) as {
    plan: Exclude<Plan, "free">;
    utr: string;
    screenshot: string;
  };

  if (plan !== "pro_1m" && plan !== "pro_3m") return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
  if (!utr || utr.trim().length < 8) return NextResponse.json({ error: "Valid UTR required." }, { status: 400 });
  if (!screenshot || !screenshot.startsWith("data:image/")) return NextResponse.json({ error: "Screenshot required." }, { status: 400 });
  if (screenshot.length > 1_500_000) return NextResponse.json({ error: "Screenshot too large." }, { status: 413 });

  const pr: PaymentRequest = {
    id: newId("pr"),
    uid: user.id,
    email: user.email,
    name: user.name,
    plan,
    amount: PLAN_PAYMENT[plan].amount,
    utr: utr.trim(),
    screenshot,
    status: "pending",
    createdAt: Date.now(),
  };
  await savePaymentRequest(pr);
  return NextResponse.json({ ok: true, id: pr.id });
}
