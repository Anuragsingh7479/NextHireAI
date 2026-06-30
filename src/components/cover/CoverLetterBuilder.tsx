"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { usePremium } from "@/components/providers/PremiumProvider";
import { Field, Input, Textarea, Label } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import * as data from "@/lib/data";
import { aiCoverLetter } from "@/lib/ai/mock";
import type { CoverLetter, CoverLetterStyle } from "@/lib/types";

const STYLES: { id: CoverLetterStyle; label: string }[] = [
  { id: "professional", label: "Professional" },
  { id: "enthusiastic", label: "Enthusiastic" },
  { id: "concise", label: "Concise" },
  { id: "creative", label: "Creative" },
];

export function CoverLetterBuilder({ initial }: { initial: CoverLetter }) {
  const { user, hasAccess } = useAuth();
  const { requirePro } = usePremium();
  const [cl, setCl] = useState<CoverLetter>(initial);
  const [saved, setSaved] = useState(true);
  const [busy, setBusy] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSave = useCallback(
    (next: CoverLetter) => {
      setSaved(false);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        if (user) await data.saveCoverLetter(user.uid, { ...next, updatedAt: Date.now() });
        setSaved(true);
      }, 600);
    },
    [user]
  );

  function patch(p: Partial<CoverLetter>) {
    setCl((prev) => {
      const next = { ...prev, ...p };
      scheduleSave(next);
      return next;
    });
  }

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  async function generate() {
    setBusy(true);
    try {
      const body = await aiCoverLetter(user?.name ?? "", cl.role, cl.company, cl.style);
      patch({ body });
    } finally {
      setBusy(false);
    }
  }

  function download() {
    if (!requirePro()) return;
    window.print();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <input
            value={cl.title}
            onChange={(e) => patch({ title: e.target.value })}
            className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-ink outline-none"
            aria-label="Cover letter title"
          />
          <span className="shrink-0 text-xs text-stone">{saved ? "Saved" : "Saving…"}</span>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-5">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Company">
              <Input value={cl.company} onChange={(e) => patch({ company: e.target.value })} />
            </Field>
            <Field label="Role">
              <Input value={cl.role} onChange={(e) => patch({ role: e.target.value })} />
            </Field>
          </div>
          <div className="mt-1">
            <Label>Writing style</Label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => patch({ style: s.id })}
                  className={
                    "rounded-full border px-3 py-1.5 text-[13px] transition-colors " +
                    (cl.style === s.id
                      ? "border-transparent bg-ink font-semibold text-black"
                      : "border-hairline bg-surface-elevated text-body hover:border-hairline-strong")
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={generate} disabled={busy}>
              <span className="text-accent-yellow">✦</span>{" "}
              {busy ? "Generating…" : "AI Generate Cover Letter"}
            </Button>
          </div>
        </div>
      </div>

      {/* preview / editable body */}
      <div className="lg:sticky lg:top-4 lg:self-start">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold">Letter</span>
          <Button size="sm" onClick={download}>
            {hasAccess ? "⬇ " : "🔒 "}Download
          </Button>
        </div>
        <div className="rounded-lg bg-white p-8 text-[13px] leading-relaxed text-[#1a1a1a] shadow-[0_18px_50px_rgba(0,0,0,.5)]">
          <Textarea
            rows={18}
            value={cl.body}
            onChange={(e) => patch({ body: e.target.value })}
            className="!border-0 !bg-transparent !p-0 !text-[#1a1a1a] !outline-none"
            style={{ whiteSpace: "pre-wrap" }}
            placeholder="Your cover letter will appear here. Click “AI Generate” to draft it."
          />
        </div>
      </div>
    </div>
  );
}
