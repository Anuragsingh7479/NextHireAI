"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePremium } from "@/components/providers/PremiumProvider";
import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    id: "pro_1m" as const,
    name: "Pro · 1 Month",
    price: "₹699",
    cadence: "for 1 month",
    features: [
      "Unlimited AI resume generation",
      "Unlimited AI cover letters",
      "Full ATS score & analysis",
      "Premium templates",
      "PDF & DOCX download",
      "Priority support",
    ],
    cta: "Choose 1 month",
  },
  {
    id: "pro_3m" as const,
    name: "Pro · 3 Months",
    price: "₹1,299",
    cadence: "for 3 months",
    best: true,
    features: [
      "Everything in 1-month Pro",
      "Unlimited AI usage",
      "Unlimited downloads",
      "All future premium features",
      "Best value — longer access",
    ],
    cta: "Choose 3 months",
  },
];

export function PricingCards() {
  const { isPro } = useAuth();
  const { openUpgrade } = usePremium();
  const router = useRouter();

  return (
    <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
      {PLANS.map((p) => (
        <div
          key={p.id}
          className={
            "flex flex-col rounded-xl border bg-surface p-6 " +
            (p.best ? "border-accent-yellow" : "border-hairline")
          }
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold">{p.name}</h3>
            {p.best && (
              <span className="rounded-full bg-accent-yellow px-2.5 py-0.5 text-[10px] font-semibold text-black">
                BEST VALUE
              </span>
            )}
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold">{p.price}</span>
            <span className="ml-1 text-sm text-mute">{p.cadence}</span>
          </div>
          <ul className="mt-5 flex-1 space-y-2.5 text-sm text-body">
            {p.features.map((f) => (
              <li key={f} className="flex gap-2">
                <span className="text-accent-green">✓</span>
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button className="w-full" onClick={() => router.push(`/checkout/${p.id}`)}>
              {p.cta}
            </Button>
          </div>
        </div>
      ))}
      <p className="text-center text-xs text-stone sm:col-span-2">
        {isPro
          ? "You're on Pro — thank you! Manage your plan in Billing."
          : "Pay via UPI — your access is activated after the admin verifies your payment."}
        {!isPro && (
          <>
            {" "}
            <button onClick={() => openUpgrade()} className="underline hover:text-ink">
              See what Pro unlocks
            </button>
          </>
        )}
      </p>
    </div>
  );
}
