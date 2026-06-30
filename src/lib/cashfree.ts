// ─────────────────────────────────────────────────────────────────────────────
// Cashfree server helpers (server only). Order creation, order lookup, webhook
// signature verification, and the privileged "grant subscription" write.
// ─────────────────────────────────────────────────────────────────────────────

import "server-only";
import crypto from "crypto";
import { adminDb } from "./firebase/admin";
import { PLAN_PRICES, type Plan } from "./types";

const ENV = (process.env.CASHFREE_ENV ?? "sandbox") as "sandbox" | "production";
const APP_ID = process.env.CASHFREE_APP_ID ?? "";
const SECRET = process.env.CASHFREE_SECRET_KEY ?? "";
const WEBHOOK_SECRET = process.env.CASHFREE_WEBHOOK_SECRET ?? SECRET;
const API_VERSION = "2023-08-01";

export const cashfreeMode = ENV;
export const cashfreeEnabled = Boolean(APP_ID && SECRET);

const BASE = ENV === "production" ? "https://api.cashfree.com/pg" : "https://sandbox.cashfree.com/pg";

function headers() {
  return {
    "Content-Type": "application/json",
    "x-api-version": API_VERSION,
    "x-client-id": APP_ID,
    "x-client-secret": SECRET,
  };
}

export interface CreateOrderInput {
  uid: string;
  email: string;
  name: string;
  plan: Exclude<Plan, "free">;
  returnUrl: string;
}

/** Create a Cashfree order and record a pending payment in Firestore. */
export async function createOrder(input: CreateOrderInput) {
  const orderId = `nh_${input.uid.slice(0, 6)}_${Date.now()}`;
  const amount = PLAN_PRICES[input.plan].inr;

  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: input.uid,
        customer_email: input.email || "user@example.com",
        customer_phone: "9999999999",
        customer_name: input.name || "NextHireAI User",
      },
      order_meta: {
        return_url: `${input.returnUrl}?order_id={order_id}`,
        notify_url: `${input.returnUrl.replace(/\/billing.*/, "")}/api/payments/webhook`,
      },
      order_note: input.plan,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Cashfree order creation failed");

  if (adminDb) {
    await adminDb.collection("payments").doc(orderId).set({
      orderId,
      uid: input.uid,
      email: input.email,
      plan: input.plan,
      amount,
      status: "PENDING",
      createdAt: Date.now(),
    });
  }

  return { orderId, paymentSessionId: data.payment_session_id as string, mode: ENV };
}

/** Fetch order status from Cashfree. */
export async function getOrder(orderId: string) {
  const res = await fetch(`${BASE}/orders/${orderId}`, { headers: headers() });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || "Cashfree order lookup failed");
  return data as { order_status: string; order_note?: string };
}

/**
 * Grant a paid subscription. This is the ONLY place premium is granted, always
 * server-side after a verified payment. Idempotent on orderId.
 */
export async function grantSubscription(orderId: string, uid: string, plan: Exclude<Plan, "free">, cfPaymentId?: string) {
  if (!adminDb) throw new Error("admin-not-configured");
  const months = PLAN_PRICES[plan].months;
  const now = Date.now();
  const expiresAt = now + months * 30 * 24 * 60 * 60 * 1000;

  await adminDb.collection("users").doc(uid).set(
    {
      plan,
      subscriptionStatus: "active",
      planActivatedAt: now,
      planExpiresAt: expiresAt,
      lastPaymentId: cfPaymentId ?? orderId,
    },
    { merge: true }
  );
  await adminDb.collection("payments").doc(orderId).set(
    { status: "PAID", cfPaymentId: cfPaymentId ?? null, paidAt: now, expiresAt },
    { merge: true }
  );
  return { expiresAt };
}

/** Verify a Cashfree webhook signature (HMAC-SHA256 of timestamp + raw body). */
export function verifyWebhookSignature(rawBody: string, signature: string, timestamp: string) {
  const payload = timestamp + rawBody;
  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(payload).digest("base64");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
