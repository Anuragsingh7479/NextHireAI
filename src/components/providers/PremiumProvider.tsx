"use client";

import { createContext, useCallback, useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { PLAN_PRICES } from "@/lib/types";

interface PremiumContextValue {
  /** Returns true if the user is Pro; otherwise opens the upgrade modal and returns false. */
  requirePro: (reason?: string) => boolean;
  openUpgrade: (reason?: string) => void;
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

const DEFAULT_REASON =
  "Upgrade to Pro to download your resume, cover letter, premium templates, and unlock the complete ATS analysis.";

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { hasAccess } = useAuth();
  const router = useRouter();

  // Send the buyer to the UPI checkout page for the chosen plan.
  function choose(plan: "pro_1m" | "pro_3m") {
    setOpen(false);
    router.push(`/checkout/${plan}`);
  }
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(DEFAULT_REASON);

  const openUpgrade = useCallback((r?: string) => {
    setReason(r || DEFAULT_REASON);
    setOpen(true);
  }, []);

  const requirePro = useCallback(
    (r?: string) => {
      if (hasAccess) return true;
      openUpgrade(r);
      return false;
    },
    [hasAccess, openUpgrade]
  );

  return (
    <PremiumContext.Provider value={{ requirePro, openUpgrade }}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="relative w-full max-w-[460px] rounded-xl border border-hairline bg-surface p-7">
            <button
              aria-label="Close"
              className="absolute right-3.5 top-3.5 text-lg text-mute hover:text-ink"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <div className="text-2xl">👑</div>
            <h3 className="mb-2 mt-2.5 text-xl font-semibold tracking-[-0.3px]">Upgrade to Pro</h3>
            <p className="mb-[18px] text-sm leading-relaxed text-body">{reason}</p>

            <div className="mb-[18px] flex flex-col gap-2.5">
              <button
                onClick={() => choose("pro_1m")}
                className="flex items-center justify-between rounded-md border border-hairline px-[15px] py-[13px] text-left transition-colors hover:border-hairline-strong"
              >
                <div>
                  <div className="text-sm font-semibold">Pro · 1 Month</div>
                  <div className="mt-0.5 text-xs text-mute">
                    Full ATS · PDF/DOCX · premium templates · priority support
                  </div>
                </div>
                <div className="text-base font-bold">{PLAN_PRICES.pro_1m.label}</div>
              </button>

              <button
                onClick={() => choose("pro_3m")}
                className="flex items-center justify-between rounded-md border border-accent-yellow px-[15px] py-[13px] text-left"
              >
                <div>
                  <div className="text-sm font-semibold">
                    Pro · 3 Months{" "}
                    <span className="ml-1.5 rounded-full bg-accent-yellow px-2 py-0.5 text-[10px] font-semibold text-black">
                      BEST VALUE
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-mute">
                    Everything in 1-month + all future premium features
                  </div>
                </div>
                <div className="text-base font-bold">{PLAN_PRICES.pro_3m.label}</div>
              </button>
            </div>

            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block rounded-md border border-hairline py-2.5 text-center text-sm text-ink hover:bg-surface-card"
            >
              Compare plans
            </Link>
            <p className="mt-3 text-center text-[11px] text-stone">
              Demo checkout — real payments go through Cashfree (server-verified).
            </p>
          </div>
        </div>
      )}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error("usePremium must be used within <PremiumProvider>");
  return ctx;
}
