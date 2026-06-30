import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { adminSnapshot } from "@/lib/server/db";
import { isProUser } from "@/lib/types";

export const runtime = "nodejs";

/** Admin-only backend overview: users, activity, payments, visits. */
export async function GET() {
  try {
    await requireAdmin();
    const snap = adminSnapshot();
    const paid = snap.paymentRequests.filter((p) => p.status === "approved");
    const revenue = paid.reduce((sum, p) => sum + (p.amount ?? 0), 0);
    const proUsers = snap.users.filter((u) =>
      isProUser({ plan: u.plan, subscriptionStatus: u.subscriptionStatus, planExpiresAt: u.planExpiresAt })
    ).length;

    return NextResponse.json({
      totals: {
        visits: snap.visits,
        users: snap.users.length,
        proUsers,
        resumes: snap.resumeCount,
        coverLetters: snap.coverLetterCount,
        payments: paid.length,
        revenue,
      },
      users: snap.users
        .map((u) => ({
          uid: u.id,
          name: u.name,
          email: u.email,
          plan: u.plan,
          subscriptionStatus: u.subscriptionStatus,
          planExpiresAt: u.planExpiresAt,
          createdAt: u.createdAt,
          lastSeenAt: u.lastSeenAt,
        }))
        .sort((a, b) => (b.lastSeenAt ?? 0) - (a.lastSeenAt ?? 0)),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "not-admin" ? 403 : 401 });
  }
}
