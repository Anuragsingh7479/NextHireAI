"use client";

import { useEffect, useState } from "react";
import { usePremium } from "@/components/providers/PremiumProvider";
import { aiAtsReport } from "@/lib/ai/mock";
import type { AtsReport, ResumeData } from "@/lib/types";

/**
 * ATS analysis card. Free users see a BLURRED preview with a lock overlay; the
 * full report renders only for Pro. (The real version returns the full report
 * from the server only after subscription verification — the blur is just UX.)
 */
export function AtsCard({ data, isPro }: { data: ResumeData; isPro: boolean }) {
  const { openUpgrade } = usePremium();
  const [report, setReport] = useState<AtsReport | null>(null);

  useEffect(() => {
    let live = true;
    aiAtsReport(data).then((r) => live && setReport(r));
    return () => {
      live = false;
    };
    // Recompute when the resume content meaningfully changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data)]);

  return (
    <div className="rounded-lg border border-hairline bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">ATS Score</h2>
        <span className="text-xs text-stone">{isPro ? "Full analysis" : "Free preview"}</span>
      </div>

      <div className="relative">
        <div className={isPro ? "" : "pointer-events-none select-none blur-[7px] opacity-60"}>
          {report ? (
            <ReportBody report={report} />
          ) : (
            <div className="py-8 text-center text-sm text-mute">Analyzing…</div>
          )}
        </div>

        {!isPro && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-md bg-surface/50">
            <div className="text-xl">🔒</div>
            <p className="max-w-[240px] text-center text-sm text-body">
              Full ATS score, missing keywords &amp; fixes are a Pro feature.
            </p>
            <button
              onClick={() => openUpgrade("Unlock your full ATS score, missing keywords, and fixes with Pro.")}
              className="rounded-md bg-primary px-3 py-1.5 text-[13px] font-medium text-on-primary hover:bg-primary-pressed"
            >
              View Full Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportBody({ report }: { report: AtsReport }) {
  const color =
    report.score >= 80 ? "var(--color-accent-green)" : report.score >= 60 ? "var(--color-accent-yellow)" : "var(--color-accent-red)";
  return (
    <div>
      <div className="flex items-center gap-4">
        <Gauge value={report.score} color={color} />
        <p className="text-[13px] leading-relaxed text-mute">{report.summary}</p>
      </div>
      <Block dot="var(--color-accent-red)" label="Missing keywords">
        <div className="flex flex-wrap gap-1.5">
          {report.missingKeywords.map((k, i) => (
            <span
              key={i}
              className="rounded-full border border-hairline px-2.5 py-1 text-[11px] text-mute"
            >
              {k}
            </span>
          ))}
        </div>
      </Block>
      <Block dot="var(--color-accent-yellow)" label="Grammar">
        <ul className="space-y-1 text-[13px] text-body">
          {report.grammar.map((g, i) => (
            <li key={i}>• {g}</li>
          ))}
        </ul>
      </Block>
      <Block dot="var(--color-accent-blue)" label="Improvement tips">
        <ul className="space-y-1 text-[13px] text-body">
          {report.tips.map((t, i) => (
            <li key={i}>• {t}</li>
          ))}
        </ul>
      </Block>
    </div>
  );
}

function Block({
  dot,
  label,
  children,
}: {
  dot: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <div className="mb-2 flex items-center gap-2 text-[13px] font-medium text-ink">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
        {label}
      </div>
      {children}
    </div>
  );
}

function Gauge({ value, color }: { value: number; color: string }) {
  return (
    <div
      className="relative grid h-[84px] w-[84px] shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${color} ${value}%, var(--color-surface-card) 0)` }}
    >
      <div className="absolute inset-[9px] rounded-full bg-surface" />
      <b className="relative z-10 text-[22px] font-bold">{value}</b>
    </div>
  );
}
