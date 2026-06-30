import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { getPaymentRequest, setPaymentRequestStatus, grantPlan } from "@/lib/server/db";

export const runtime = "nodejs";

/**
 * Admin approves/rejects a manual UPI payment. On approve, the buyer's plan is
 * granted immediately for the purchased number of months.
 */
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { id, action } = (await req.json()) as { id: string; action: "approve" | "reject" };
    if (!id || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "id and valid action required." }, { status: 400 });
    }

    const pr = getPaymentRequest(id);
    if (!pr) return NextResponse.json({ error: "Request not found." }, { status: 404 });

    if (action === "reject") {
      setPaymentRequestStatus(id, "rejected");
      return NextResponse.json({ ok: true, status: "rejected" });
    }

    // Grant the purchased plan right now, then mark the request approved.
    const updated = grantPlan(pr.uid, pr.plan);
    setPaymentRequestStatus(id, "approved");
    return NextResponse.json({ ok: true, status: "approved", expiresAt: updated?.planExpiresAt ?? null });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "not-admin" ? 403 : 401 });
  }
}
