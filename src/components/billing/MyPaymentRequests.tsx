"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { useAuth } from "@/components/providers/AuthProvider";
import { PLAN_PAYMENT } from "@/lib/payments";
import type { PaymentRequest } from "@/lib/types";

type Row = Pick<PaymentRequest, "id" | "plan" | "amount" | "status" | "utr" | "createdAt">;

/** The user's manual UPI submissions and their verification status. */
export function MyPaymentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Row[]>([]);

  useEffect(() => {
    if (!user) return;
    let live = true;
    fetch("/api/payments/my-requests")
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((d) => live && setRequests(d.requests ?? []))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [user]);

  if (requests.length === 0) return null;

  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold">Your payment submissions</h2>
      <ul className="divide-y divide-hairline">
        {requests.map((r) => (
          <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
            <div>
              <span className="text-ink">{PLAN_PAYMENT[r.plan]?.title ?? r.plan}</span>
              <span className="ml-2 text-xs text-stone">UTR {r.utr}</span>
            </div>
            <StatusPill status={r.status} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function StatusPill({ status }: { status: PaymentRequest["status"] }) {
  const map: Record<string, string> = {
    pending: "bg-accent-yellow/20 text-accent-yellow",
    approved: "bg-accent-green/20 text-accent-green",
    rejected: "bg-accent-red/20 text-accent-red",
  };
  const label = { pending: "Pending review", approved: "Approved", rejected: "Rejected" }[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${map[status]}`}>
      {label}
    </span>
  );
}
