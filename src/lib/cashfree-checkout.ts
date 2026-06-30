// Client helper: ask our server to create a Cashfree order, then open the
// hosted Cashfree checkout. Secret keys never touch the browser — the server
// route returns only a payment_session_id.

import type { Plan } from "./types";

declare global {
  interface Window {
    Cashfree?: (opts: { mode: "sandbox" | "production" }) => {
      checkout: (opts: { paymentSessionId: string; redirectTarget?: string }) => Promise<unknown>;
    };
  }
}

let sdkPromise: Promise<void> | null = null;
function loadSdk(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Cashfree) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Cashfree SDK"));
    document.head.appendChild(s);
  });
  return sdkPromise;
}

export async function startCashfreeCheckout(plan: Exclude<Plan, "free">, idToken: string) {
  const res = await fetch("/api/payments/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ plan }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Could not start checkout.");
  }
  const { paymentSessionId, mode } = (await res.json()) as {
    paymentSessionId: string;
    mode: "sandbox" | "production";
  };
  await loadSdk();
  if (!window.Cashfree) throw new Error("Cashfree SDK unavailable.");
  const cf = window.Cashfree({ mode });
  // Redirects to Cashfree, then back to our return_url (/billing?order_id=...).
  await cf.checkout({ paymentSessionId, redirectTarget: "_self" });
}
