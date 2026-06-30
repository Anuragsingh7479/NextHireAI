"use client";

import { use } from "react";
import Link from "next/link";
import { UpiCheckout } from "@/components/billing/UpiCheckout";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/lib/types";

export default function CheckoutPage({ params }: { params: Promise<{ plan: string }> }) {
  const { plan } = use(params);
  const valid = plan === "pro_1m" || plan === "pro_3m";

  if (!valid) {
    return (
      <EmptyState
        icon="✕"
        title="Unknown plan"
        description="Pick a plan from the pricing page."
        action={<Button href="/pricing">View pricing</Button>}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 text-xs text-stone">
        <Link href="/pricing" className="hover:text-ink">
          ← Back to pricing
        </Link>
      </div>
      <PageHeader title="Complete your payment" subtitle="Pay via UPI, then upload your proof." />
      <UpiCheckout plan={plan as Exclude<Plan, "free">} />
    </div>
  );
}
