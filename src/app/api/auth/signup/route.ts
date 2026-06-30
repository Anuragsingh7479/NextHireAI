import { NextResponse } from "next/server";
import { tx, findUserByEmail, newId } from "@/lib/server/db";
import { hashPassword, setSessionCookie, publicUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { name, email, password } = (await req.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };
  if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  if (findUserByEmail(email)) return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });

  const id = newId("usr");
  const user = tx((db) => {
    const u = {
      id,
      email,
      name: name || email.split("@")[0],
      passwordHash: hashPassword(password),
      plan: "free" as const,
      subscriptionStatus: "inactive" as const,
      planActivatedAt: null,
      planExpiresAt: null,
      createdAt: Date.now(),
      lastSeenAt: Date.now(),
    };
    db.users[id] = u;
    return u;
  });

  const res = NextResponse.json({ user: publicUser(user) });
  setSessionCookie(res, id);
  return res;
}
