"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Field, Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestCode(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send code.");
      setStep("otp");
      setNotice(`If an account exists for ${email}, a 6-digit code was sent. It expires in 10 minutes.`);
      if (data.devOtp) setDevOtp(data.devOtp); // shown only when email delivery isn't configured
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not reset password.");
      // Full navigation so the new session cookie is picked up everywhere.
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <Card className="p-7">
      <h1 className="text-xl font-semibold tracking-[-0.3px]">Reset your password</h1>
      <p className="mb-6 mt-1 text-sm text-mute">
        {step === "email"
          ? "Enter your email and we'll send you a 6-digit code."
          : "Enter the code and choose a new password."}
      </p>

      {notice && (
        <div className="mb-4 rounded-md border border-hairline bg-surface-elevated p-3 text-sm text-body">
          {notice}
          {devOtp && (
            <div className="mt-2 text-xs text-stone">
              Email delivery isn&apos;t configured yet — your code is{" "}
              <b className="font-mono text-ink">{devOtp}</b> (add SMTP keys to send real emails).
            </div>
          )}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={requestCode} className="space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </Field>
          {error && <p className="text-sm text-accent-red">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={resetPassword} className="space-y-4">
          <Field label="6-digit code">
            <Input
              inputMode="numeric"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              required
            />
          </Field>
          <Field label="New password">
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
            />
          </Field>
          {error && <p className="text-sm text-accent-red">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Resetting…" : "Reset password & sign in"}
          </Button>
          <button
            type="button"
            onClick={() => setStep("email")}
            className="w-full text-center text-xs text-mute hover:text-ink"
          >
            Use a different email
          </button>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-mute">
        <Link href="/login" className="text-ink hover:underline">
          Back to sign in
        </Link>
      </p>
    </Card>
  );
}
