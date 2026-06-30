import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { listAllPaymentRequests } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    return NextResponse.json({ requests: await listAllPaymentRequests() });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unauthorized";
    return NextResponse.json({ error: msg }, { status: msg === "not-admin" ? 403 : 401 });
  }
}
