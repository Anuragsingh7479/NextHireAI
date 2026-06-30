import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/server/auth";
import { listUserPaymentRequests } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ requests: [] });
  // Drop the heavy screenshot from the list payload.
  const list = await listUserPaymentRequests(user.id);
  const requests = list.map(({ screenshot, ...rest }) => {
    void screenshot;
    return rest;
  });
  return NextResponse.json({ requests });
}
