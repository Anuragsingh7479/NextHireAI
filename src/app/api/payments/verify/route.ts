import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { adminDb } from "@/lib/firebase/admin";
import { getOrder, grantSubscription, cashfreeEnabled } from "@/lib/cashfree";
import type { Plan } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Called when the user returns from Cashfree checkout. Re-checks the order with
 * Cashfree (server-to-server) and grants the subscription only if PAID. The
 * frontend can never grant premium on its own.
 */
export async function POST(req: Request) {
  try {
    if (!cashfreeEnabled) {
      return NextResponse.json({ error: "Payments not configured." }, { status: 503 });
    }
    const decoded = await verifyRequest(req);
    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: "Missing orderId." }, { status: 400 });

    // The order must belong to this user.
    const payDoc = await adminDb?.collection("payments").doc(orderId).get();
    const pay = payDoc?.data();
    if (!pay || pay.uid !== decoded.uid) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = await getOrder(orderId);
    if (order.order_status !== "PAID") {
      return NextResponse.json({ status: order.order_status });
    }

    const plan = (pay.plan as Exclude<Plan, "free">) ?? "pro_1m";
    const { expiresAt } = await grantSubscription(orderId, decoded.uid, plan);
    return NextResponse.json({ status: "PAID", plan, expiresAt });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = /token|admin/.test(msg) ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
