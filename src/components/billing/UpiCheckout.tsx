"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Label } from "@/components/ui/Field";
import { fileToCompressedDataUrl } from "@/lib/image";
import { UPI_ID, PAYEE_NAME, PLAN_PAYMENT, buildUpiUrl } from "@/lib/payments";
import type { Plan } from "@/lib/types";

export function UpiCheckout({ plan }: { plan: Exclude<Plan, "free"> }) {
  const { user } = useAuth();
  const router = useRouter();
  const info = PLAN_PAYMENT[plan];
  const upiUrl = buildUpiUrl(info.amount, `NextHireAI ${info.title}`);

  const [screenshot, setScreenshot] = useState<string>("");
  const [utr, setUtr] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      setScreenshot(await fileToCompressedDataUrl(file));
    } catch {
      setError("Could not read that image. Try a PNG or JPG.");
    }
  }

  function copyUpi() {
    navigator.clipboard?.writeText(UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function submit() {
    if (!screenshot) return setError("Please upload your payment screenshot.");
    if (utr.trim().length < 8) return setError("Enter the UTR / transaction reference (min 8 chars).");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/payments/submit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, utr: utr.trim(), screenshot }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Could not submit.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit your payment.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <div className="text-3xl">✅</div>
        <h2 className="mt-3 text-lg font-semibold">Payment submitted!</h2>
        <p className="mt-2 text-sm leading-relaxed text-mute">
          We received your {info.title} payment details. Our team will verify your UTR and activate
          your subscription shortly. You&apos;ll see it on your Billing page once approved.
        </p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => router.push("/billing")}>Go to Billing</Button>
          <Button variant="install" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
      {/* Step 1: pay */}
      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-stone">Step 1 · Pay</div>
        <h2 className="mt-1 text-lg font-semibold">
          {info.title} — <span className="text-accent-green">{info.label}</span>
        </h2>
        <p className="mt-1 text-sm text-mute">Scan with any UPI app (GPay, PhonePe, Paytm…).</p>

        <div className="mx-auto mt-4 w-fit rounded-xl bg-white p-4">
          <QRCodeSVG value={upiUrl} size={208} marginSize={1} />
        </div>

        <div className="mt-4 space-y-1 text-center text-sm">
          <div className="text-mute">
            UPI ID:{" "}
            <button onClick={copyUpi} className="font-medium text-ink hover:underline">
              {UPI_ID} {copied ? "✓" : "⧉"}
            </button>
          </div>
          <div className="text-mute">
            Payee: <span className="text-ink">{PAYEE_NAME}</span>
          </div>
          <div className="text-mute">
            Amount: <span className="text-ink">{info.label}</span>
          </div>
        </div>

        {/* Mobile: open directly in a UPI app */}
        <a
          href={upiUrl}
          className="mt-4 block rounded-md border border-hairline py-2.5 text-center text-sm text-ink hover:bg-surface-card md:hidden"
        >
          Open in UPI app
        </a>
      </Card>

      {/* Step 2: confirm */}
      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-stone">
          Step 2 · Confirm
        </div>
        <h2 className="mt-1 text-lg font-semibold">Upload proof</h2>
        <p className="mt-1 text-sm text-mute">
          After paying, upload the payment screenshot and enter the UTR / transaction ID. We verify
          and activate within a few hours.
        </p>

        <div className="mt-4 space-y-4">
          <div>
            <Label>Payment screenshot</Label>
            {screenshot ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={screenshot}
                  alt="Payment proof"
                  className="max-h-44 w-full rounded-md border border-hairline object-contain"
                />
                <button
                  onClick={() => setScreenshot("")}
                  className="mt-2 text-xs text-mute hover:text-accent-red"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center rounded-md border border-dashed border-hairline bg-surface-elevated py-8 text-sm text-mute hover:border-hairline-strong">
                Click to upload screenshot
                <input type="file" accept="image/*" className="hidden" onChange={onFile} />
              </label>
            )}
          </div>

          <Field label="UTR / Transaction ID">
            <Input
              value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. 412345678901"
            />
          </Field>

          {error && <p className="text-sm text-accent-red">{error}</p>}

          <Button className="w-full" onClick={submit} disabled={busy}>
            {busy ? "Submitting…" : "Submit for verification"}
          </Button>
          <p className="text-center text-[11px] text-stone">
            Your subscription activates after we verify your payment. By continuing you agree to our{" "}
            <a href="/terms" className="underline hover:text-ink">
              Terms &amp; Refund Policy
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
