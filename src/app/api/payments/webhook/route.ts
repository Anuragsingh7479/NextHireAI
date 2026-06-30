import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { grantSubscription, verifyWebhookSignature } from "@/lib/cashfree";
import type { Plan } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Cashfree webhook. The authoritative activation path: even if the user closes
 * the tab before returning, the webhook still grants the subscription. The
 * signature is verified before anything is trusted.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-webhook-signature") ?? "";
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";

  if (!verifyWebhookSignature(rawBody, signature, timestamp)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  const type = event?.type as string | undefined;
  const orderId = event?.data?.order?.order_id as string | undefined;
  const cfPaymentId = event?.data?.payment?.cf_payment_id?.toString();

  if (type === "PAYMENT_SUCCESS_WEBHOOK" && orderId && adminDb) {
    const payDoc = await adminDb.collection("payments").doc(orderId).get();
    const pay = payDoc.data();
    if (pay && pay.uid) {
      await grantSubscription(orderId, pay.uid, (pay.plan as Exclude<Plan, "free">) ?? "pro_1m", cfPaymentId);
    }
  }

  // Always 200 so Cashfree doesn't retry a handled event.
  return NextResponse.json({ received: true });
}
