"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { PLAN_PAYMENT } from "@/lib/payments";
import type { PaymentRequest } from "@/lib/types";

/** Admin review of manual UPI payments. Approving grants the plan immediately. */
export function AdminPaymentRequests() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState<string>("");

  const load = useCallback(async () => {
    setError("");
    const res = await fetch("/api/admin/payment-requests");
    if (!res.ok) {
      setError((await res.json().catch(() => ({}))).error || "Failed to load requests.");
      return;
    }
    setRequests((await res.json()).requests);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(pr: PaymentRequest, action: "approve" | "reject") {
    await fetch("/api/admin/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: pr.id, action }),
    });
    load();
  }

  const pending = requests.filter((r) => r.status === "pending");

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-sm font-semibold">
        Payment Requests{" "}
        {pending.length > 0 && (
          <span className="ml-1 rounded-full bg-accent-yellow px-2 py-0.5 text-[11px] font-semibold text-black">
            {pending.length} pending
          </span>
        )}
      </h2>

      {error && <Card className="mb-3 text-sm text-accent-red">{error}</Card>}

      {requests.length === 0 ? (
        <Card className="text-sm text-mute">No payment requests yet.</Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {requests.map((r) => (
            <Card key={r.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-medium text-ink">{r.email}</div>
                  <div className="text-xs text-mute">
                    {PLAN_PAYMENT[r.plan]?.title ?? r.plan} · ₹{r.amount}
                  </div>
                </div>
                <StatusPill status={r.status} />
              </div>

              {r.screenshot && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.screenshot}
                  alt="Payment proof"
                  onClick={() => setZoom(r.screenshot)}
                  className="max-h-40 w-full cursor-zoom-in rounded-md border border-hairline object-contain"
                />
              )}

              <div className="text-xs text-mute">
                UTR: <span className="font-mono text-ink">{r.utr}</span>
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => act(r, "approve")}
                    className="flex-1 rounded-md bg-accent-green/90 py-1.5 text-xs font-medium text-black hover:bg-accent-green"
                  >
                    ✓ Approve &amp; activate
                  </button>
                  <button
                    onClick={() => act(r, "reject")}
                    className="rounded-md border border-hairline px-2 py-1.5 text-xs text-mute hover:text-accent-red"
                  >
                    Reject
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {zoom && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setZoom("")}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Payment proof" className="max-h-[90vh] max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: PaymentRequest["status"] }) {
  const map = {
    pending: "bg-accent-yellow/20 text-accent-yellow",
    approved: "bg-accent-green/20 text-accent-green",
    rejected: "bg-accent-red/20 text-accent-red",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${map[status]}`}>
      {status}
    </span>
  );
}
