import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Refund Policy",
  description:
    "NextHireAI subscription terms, billing, refund and cancellation policy, and acceptable use.",
};

const SUPPORT_EMAIL = "anuragsingh02100@gmail.com";
const SUPPORT_PHONE = "+91 92591 59318";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-2 space-y-2 text-sm leading-relaxed text-body">{children}</div>
    </section>
  );
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-[-0.6px]">Terms &amp; Refund Policy</h1>
      <p className="mt-2 text-sm text-mute">Last updated: 30 June 2026</p>

      <Section title="1. About NextHireAI">
        <p>
          NextHireAI is an AI-powered resume and cover letter builder with an ATS analyzer. Access to
          the builder, AI generation, the full ATS analysis, premium templates, and PDF/DOCX
          downloads requires an active paid subscription.
        </p>
      </Section>

      <Section title="2. Subscription plans & billing">
        <ul className="list-disc space-y-1 pl-5">
          <li><b className="text-ink">Pro · 1 Month</b> — ₹699, grants access for 1 month (30 days) from activation.</li>
          <li><b className="text-ink">Pro · 3 Months</b> — ₹1,299, grants access for 3 months (90 days) from activation.</li>
          <li>Payments are made via UPI. After paying, you upload your payment screenshot and UTR (transaction reference) for verification.</li>
          <li>Access is activated once our team verifies your payment — usually within a few hours. Your plan&apos;s expiry date is shown on your Billing page.</li>
          <li>Subscriptions are <b className="text-ink">one-time for the chosen period</b> and do <b className="text-ink">not auto-renew</b>. When a plan expires, premium access is removed until you renew.</li>
        </ul>
      </Section>

      <Section title="3. Refund policy">
        <ul className="list-disc space-y-1 pl-5">
          <li>
            If your payment was verified but access was <b className="text-ink">not granted</b> due to a
            technical issue on our side, you are entitled to a <b className="text-ink">full refund</b> or
            free activation — your choice.
          </li>
          <li>
            If you were <b className="text-ink">charged twice</b> for the same plan, the duplicate
            payment is refunded in full.
          </li>
          <li>
            Refund requests must be raised within <b className="text-ink">7 days</b> of payment by
            emailing {SUPPORT_EMAIL} with your registered email and UTR. Approved refunds are
            processed to the original UPI account within <b className="text-ink">5–7 business days</b>.
          </li>
          <li>
            Because this is a digital service activated on verification, refunds are not available for
            change of mind after access has been used. Partial/pro-rated refunds for unused time are
            considered case-by-case.
          </li>
        </ul>
      </Section>

      <Section title="4. Cancellation">
        <p>
          You can stop using the service at any time. As plans do not auto-renew, there is nothing to
          cancel — access simply ends on the expiry date. You may delete your resumes and cover
          letters from your dashboard at any time.
        </p>
      </Section>

      <Section title="5. Your data & privacy">
        <p>
          We store the account and content you create (resumes, cover letters) to provide the service.
          We never sell your data. Payment screenshots are used solely to verify your subscription.
          You can request deletion of your account and data by contacting support.
        </p>
      </Section>

      <Section title="6. Acceptable use">
        <p>
          Use NextHireAI for lawful, personal job-application purposes. Do not abuse the AI features,
          attempt to bypass the subscription, or resell access. We may suspend accounts that violate
          these terms.
        </p>
      </Section>

      <Section title="7. Contact us">
        <p>
          Questions about billing, refunds, or your account? We&apos;re here to help.
        </p>
        <p>
          Email:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-ink hover:underline">
            {SUPPORT_EMAIL}
          </a>
          <br />
          Phone:{" "}
          <a href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`} className="text-ink hover:underline">
            {SUPPORT_PHONE}
          </a>
        </p>
      </Section>
    </div>
  );
}
