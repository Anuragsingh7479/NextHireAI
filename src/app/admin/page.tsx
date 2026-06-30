"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { Logo } from "@/components/landing/Logo";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AdminPaymentRequests } from "@/components/admin/AdminPaymentRequests";
import { ADMIN_EMAIL } from "@/lib/types";

interface Overview {
  totals: {
    visits: number;
    users: number;
    proUsers: number;
    resumes: number;
    coverLetters: number;
    payments: number;
    revenue: number;
  };
  users: any[];
}

export default function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/overview");
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || "Failed to load.");
      return;
    }
    setData(await res.json());
  }, []);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  async function grant(uid: string, plan: string) {
    await fetch("/api/admin/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, plan }),
    });
    load();
  }

  if (loading) return <Centered>Loading…</Centered>;

  if (!user || !isAdmin) {
    return (
      <Centered>
        <Card className="max-w-md text-center">
          <div className="text-2xl">🔒</div>
          <h1 className="mt-2 text-lg font-semibold">Admin access only</h1>
          <p className="mt-2 text-sm text-mute">
            This panel is restricted to <b className="text-ink">{ADMIN_EMAIL}</b>.
            {!user && " Please sign in with the admin account."}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <Button href="/login" size="sm">Sign in</Button>
            <Button href="/" size="sm" variant="install">Home</Button>
          </div>
        </Card>
      </Centered>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-hairline px-6 py-4">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="rounded-full bg-accent-yellow px-2.5 py-0.5 text-[11px] font-semibold text-black">
            ADMIN
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-mute">{user.email}</span>
          <button onClick={() => signOut()} className="text-mute hover:text-ink">
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-container px-6 py-8">
        <h1 className="mb-6 text-2xl font-semibold tracking-[-0.5px]">Admin Dashboard</h1>

        {error && (
          <Card className="mb-6 border-accent-red/40 text-sm text-body">{error}</Card>
        )}

        {/* Payment verification */}
        <AdminPaymentRequests />

        {data && (
          <>
            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <Stat label="Total visits" value={data.totals.visits} />
              <Stat label="Users" value={data.totals.users} />
              <Stat label="Pro users" value={data.totals.proUsers} />
              <Stat label="Resumes" value={data.totals.resumes} />
              <Stat label="Paid orders" value={data.totals.payments} />
              <Stat label="Revenue" value={`₹${data.totals.revenue.toLocaleString("en-IN")}`} />
            </div>

            <Section title="Users — who's active">
              <Table
                head={["Name", "Email", "Plan", "Status", "Last seen", "Manage"]}
                rows={data.users.map((u) => [
                  u.name ?? "—",
                  u.email ?? "—",
                  u.plan ?? "free",
                  u.subscriptionStatus ?? "inactive",
                  u.lastSeenAt ? timeago(u.lastSeenAt) : "—",
                  <span key="m" className="flex gap-1">
                    <MiniBtn onClick={() => grant(u.uid, "pro_3m")}>Grant Pro</MiniBtn>
                    <MiniBtn onClick={() => grant(u.uid, "free")}>Revoke</MiniBtn>
                  </span>,
                ])}
              />
            </Section>
          </>
        )}

        <p className="mt-8 text-xs text-stone">
          <Link href="/dashboard" className="hover:text-ink">← Back to app</Link>
        </p>
      </main>
    </div>
  );
}

function timeago(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center px-5">{children}</div>;
}
function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Card>
      <div className="text-sm text-mute">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </Card>
  );
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </div>
  );
}
function MiniBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md border border-hairline px-2 py-1 text-xs text-mute hover:border-hairline-strong hover:text-ink"
    >
      {children}
    </button>
  );
}
function Table({
  head,
  rows,
  empty,
}: {
  head: string[];
  rows: React.ReactNode[][];
  empty?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-hairline">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-hairline text-xs uppercase tracking-wide text-stone">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={head.length} className="px-4 py-8 text-center text-mute">
                {empty ?? "No data."}
              </td>
            </tr>
          ) : (
            rows.map((r, i) => (
              <tr key={i} className="text-body">
                {r.map((cell, j) => (
                  <td key={j} className="px-4 py-3">{cell}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
