// ─────────────────────────────────────────────────────────────────────────────
// Manual UPI payment config. Buyers scan the QR (generated from this UPI ID),
// pay, then submit a screenshot + UTR. The admin verifies and grants the plan.
// ─────────────────────────────────────────────────────────────────────────────

import type { Plan } from "./types";

export const UPI_ID = "anuragsingh02100-6@oksbi";
export const PAYEE_NAME = "Anurag Singh";

export const PLAN_PAYMENT: Record<
  Exclude<Plan, "free">,
  { amount: number; label: string; title: string; months: number }
> = {
  pro_1m: { amount: 699, label: "₹699", title: "Pro · 1 Month", months: 1 },
  pro_3m: { amount: 1299, label: "₹1,299", title: "Pro · 3 Months", months: 3 },
};

/** Build a standard UPI deep link — scannable by any UPI app, tappable on mobile. */
export function buildUpiUrl(amount: number, note: string): string {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: PAYEE_NAME,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}
