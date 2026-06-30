"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PLAN_PAYMENT } from "@/lib/payments";

/**
 * Shown inside the app shell when a signed-in user has no active subscription.
 * The app is paid-only — there is no free tier. They must choose a plan to
 * continue. (Billing/checkout/account routes stay reachable so they can pay.)
 */
export function Paywall() {
  const router = useRouter();
  const plans: ("pro_1m" | "pro_3m")[] = ["pro_1m", "pro_3m"];

  return (
    <div className="mx-auto max-w-2xl py-8 text-center">
      <div className="text-3xl">🔒</div>
      <h1 className="mt-3 text-2xl font-semibold tracking-[-0.5px]">Subscribe to unlock NextHireAI</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-mute">
        NextHireAI is a premium tool — choose a plan to build resumes & cover letters, run the full
        ATS analysis, and download in PDF/DOCX.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {plans.map((id) => {
          const p = PLAN_PAYMENT[id];
          const best = id === "pro_3m";
          return (
            <div
              key={id}
              className={
                "flex flex-col rounded-xl border bg-surface p-6 text-left " +
                (best ? "border-accent-yellow" : "border-hairline")
              }
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">{p.title}</h2>
                {best && (
                  <span className="rounded-full bg-accent-yellow px-2.5 py-0.5 text-[10px] font-semibold text-black">
                    BEST VALUE
                  </span>
                )}
              </div>
              <div className="mt-2 text-3xl font-bold">{p.label}</div>
              <div className="text-sm text-mute">
                for {p.months} month{p.months > 1 ? "s" : ""}
              </div>
              <Button className="mt-5 w-full" onClick={() => router.push(`/checkout/${id}`)}>
                Pay {p.label} via UPI
              </Button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-stone">
        Pay via UPI, upload your payment proof, and your access is activated after verification.
      </p>
    </div>
  );
}
