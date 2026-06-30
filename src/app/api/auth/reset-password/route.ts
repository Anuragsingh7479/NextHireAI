import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { findUserByEmail, updatePassword } from "@/lib/server/db";
import { hashPassword, setSessionCookie, publicUser } from "@/lib/server/auth";

export const runtime = "nodejs";

const sha256 = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

/** Step 2: verify the OTP and set a new password, then sign the user in. */
export async function POST(req: Request) {
  const { email, otp, password } = (await req.json()) as {
    email?: string;
    otp?: string;
    password?: string;
  };
  if (!email || !otp || !password) return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });

  const user = await findUserByEmail(email);
  if (!user || !user.resetOtpHash || !user.resetOtpExpires) {
    return NextResponse.json({ error: "Request a new code." }, { status: 400 });
  }
  if (Date.now() > user.resetOtpExpires) {
    return NextResponse.json({ error: "Code expired. Request a new one." }, { status: 400 });
  }

  const ok =
    sha256(otp).length === user.resetOtpHash.length &&
    crypto.timingSafeEqual(Buffer.from(sha256(otp)), Buffer.from(user.resetOtpHash));
  if (!ok) return NextResponse.json({ error: "Invalid code." }, { status: 400 });

  await updatePassword(user.id, hashPassword(password));

  const res = NextResponse.json({ ok: true, user: publicUser({ ...user, passwordHash: "" }) });
  setSessionCookie(res, user.id); // auto sign-in after reset
  return res;
}
