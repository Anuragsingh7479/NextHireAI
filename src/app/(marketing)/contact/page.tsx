"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";

const SUPPORT_EMAIL = "anuragsingh02100@gmail.com";
const SUPPORT_PHONE = "+91 92591 59318";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Opens the user's mail client addressed to support. A production build posts
    // to /api/support/contact (validated + rate-limited) and emails support.
    const subject = encodeURIComponent(`Support request from ${form.name || "a user"}`);
    const body = encodeURIComponent(`${form.message}\n\nFrom: ${form.name} <${form.email}>`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-2 text-3xl font-semibold tracking-[-0.6px]">Contact support</h1>
      <p className="mb-6 text-mute">
        We usually reply within 1 business day. You can also reach us directly:
      </p>
      <div className="mb-8 flex flex-col gap-2 text-sm sm:flex-row sm:gap-6">
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ink hover:underline">
          ✉ {SUPPORT_EMAIL}
        </a>
        <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="text-ink hover:underline">
          ☎ {SUPPORT_PHONE}
        </a>
      </div>

      <Card>
        {sent ? (
          <div className="text-sm text-body">
            ✓ Thanks! Your message has been prepared in your email client. We&apos;ll get back to you
            at <b className="text-ink">{form.email || "your email"}</b>.
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your name">
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>
            <Field label="How can we help?">
              <Textarea
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </Field>
            <Button type="submit">Send message</Button>
          </form>
        )}
      </Card>
    </div>
  );
}
