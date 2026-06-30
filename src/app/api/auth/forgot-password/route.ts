import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { findUserByEmail, setResetOtp } from "@/lib/server/db";
import { sendEmail, otpEmail, emailConfigured } from "@/lib/server/email";

export const runtime = "nodejs";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

/** Step 1: generate a 6-digit OTP, store its hash (10-min expiry), and email it. */
export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };
  if (!email) return NextResponse.json({ error: "Enter your email." }, { status: 400 });

  const user = findUserByEmail(email);
  // Respond the same whether or not the account exists (avoid account enumeration).
  if (!user) return NextResponse.json({ ok: true });

  const code = String(crypto.randomInt(100000, 1000000)); // 6 digits
  setResetOtp(user.id, sha256(code), Date.now() + 10 * 60 * 1000);

  try {
    await sendEmail({ to: user.email, ...otpEmail(code) });
  } catch {
    /* delivery failure shouldn't leak; user can retry */
  }

  // Dev fallback: if no SMTP configured, return the code so the flow is testable.
  return NextResponse.json({ ok: true, ...(emailConfigured ? {} : { devOtp: code }) });
}
