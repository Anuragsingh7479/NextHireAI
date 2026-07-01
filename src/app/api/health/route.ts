import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Diagnostic endpoint — reports whether required env vars are set and whether the
 * database connects. Returns NO secrets (values are booleans; any URI in an error
 * is stripped). Safe to remove once deployment is confirmed working.
 */
export async function GET() {
  const report: Record<string, unknown> = {
    mongoUriPresent: Boolean(process.env.MONGODB_URI),
    mongoDbName: process.env.MONGODB_DB || null,
    sessionSecretPresent: Boolean(process.env.SESSION_SECRET),
    adminEmailPresent: Boolean(process.env.ADMIN_EMAIL),
    smtpPresent: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
    mongo: "not-tested",
  };

  try {
    if (!process.env.MONGODB_URI) {
      report.mongo = "NO_URI — MONGODB_URI env var missing";
      return NextResponse.json(report);
    }
    const { MongoClient } = await import("mongodb");
    const c = new MongoClient(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
    await c.connect();
    await c.db(process.env.MONGODB_DB || "nexthireai").command({ ping: 1 });
    await c.close();
    report.mongo = "OK";
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e).replace(
      /mongodb(\+srv)?:\/\/\S+/gi,
      "[uri-hidden]"
    );
    report.mongo = "FAIL: " + (e instanceof Error ? e.name : "") + " - " + msg.slice(0, 250);
  }

  return NextResponse.json(report);
}
