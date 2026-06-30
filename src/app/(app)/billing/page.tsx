"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/app/PageHeader";
import { MyPaymentRequests } from "@/components/billing/MyPaymentRequests";
import { PLAN_LABELS } from "@/lib/types";

export default function BillingPage() {
  const { user, isPro } = useAuth();

  if (!user) return null;

  const expiry =
    user.planExpiresAt && isPro
      ? new Date(user.planExpiresAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : null;

  return (
    <div>
      <PageHeader title="Billing & Subscription" subtitle="Manage your plan and view status." />

      <div className="grid max-w-3xl gap-4">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wide text-mute">Current plan</div>
              <div className="mt-1 text-xl font-semibold">
                {isPro ? PLAN_LABELS[user.plan] : "Free"}
              </div>
              <div className="mt-1 text-sm text-mute">
                Status:{" "}
                <span className={isPro ? "text-accent-green" : "text-mute"}>
                  {isPro ? "Active" : "Inactive"}
                </span>
                {expiry && ` · renews/expires ${expiry}`}
              </div>
            </div>
            {isPro ? (
              <span className="rounded-full bg-accent-yellow px-3 py-1 text-xs font-semibold text-black">
                PRO
              </span>
            ) : (
              <Button href="/pricing">Upgrade to Pro</Button>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold">What&apos;s included</h2>
          <ul className="mt-3 space-y-2 text-sm text-body">
            {[
              ["Resume & cover letter builder", true],
              ["AI generation", true],
              ["Full ATS analysis", isPro],
              ["PDF & DOCX downloads", isPro],
              ["Premium templates", isPro],
              ["Unlimited resumes & priority support", isPro],
            ].map(([label, on]) => (
              <li key={label as string} className="flex items-center gap-2">
                <span className={on ? "text-accent-green" : "text-stone"}>{on ? "✓" : "✕"}</span>
                <span className={on ? "" : "text-mute"}>{label}</span>
              </li>
            ))}
          </ul>
        </Card>

        <MyPaymentRequests />

        <Card>
          <h2 className="text-sm font-semibold">Billing history</h2>
          <p className="mt-2 text-sm text-mute">
            {isPro
              ? "Your latest payment is recorded. Full invoice history appears here once Cashfree is connected."
              : "No payments yet."}
          </p>
        </Card>

        <p className="text-xs text-stone">
          Payments are processed securely by Cashfree. Plan changes are verified server-side; if a
          subscription expires, premium access is revoked automatically.
        </p>
      </div>
    </div>
  );
}
