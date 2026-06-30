import { NextResponse } from "next/server";
import { verifyRequest } from "@/lib/firebase/admin";
import { createOrder, cashfreeEnabled } from "@/lib/cashfree";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    if (!cashfreeEnabled) {
      return NextResponse.json(
        { error: "Payments are not configured yet. Add Cashfree keys to enable checkout." },
        { status: 503 }
      );
    }
    const decoded = await verifyRequest(req);
    const { plan } = await req.json();
    if (plan !== "pro_1m" && plan !== "pro_3m") {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const origin =
      req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const out = await createOrder({
      uid: decoded.uid,
      email: decoded.email ?? "",
      name: (decoded.name as string) ?? "",
      plan,
      returnUrl: `${origin}/billing`,
    });

    return NextResponse.json(out);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    const status = /token|admin/.test(msg) ? 401 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
