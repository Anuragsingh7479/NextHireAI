import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about NextHireAI.",
};

const FAQS = [
  {
    q: "Is NextHireAI free to use?",
    a: "Yes. You can build resumes and cover letters, preview them, and use limited AI for free. Downloads, the full ATS analysis, and premium templates require a Pro plan.",
  },
  {
    q: "What do I get with Pro?",
    a: "Unlimited AI generation, the complete ATS score and analysis, premium templates, PDF & DOCX downloads, unlimited resume saving, and priority support.",
  },
  {
    q: "How much does Pro cost?",
    a: "Pro is ₹699 for 1 month or ₹1,299 for 3 months (the best value). You can upgrade anytime from the Pricing page.",
  },
  {
    q: "How does the ATS score work?",
    a: "We analyze your resume for keyword coverage, readability, grammar, and structure, then give you a score with specific fixes. Free users see a blurred preview; Pro unlocks the full report.",
  },
  {
    q: "Will my subscription renew automatically?",
    a: "Your plan is active until its expiry date. When it expires, premium access is revoked automatically until you renew.",
  },
  {
    q: "Can I cancel?",
    a: "Yes. Your Pro access continues until the end of the paid period. Manage everything from the Billing page.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-semibold tracking-[-0.6px]">Frequently asked questions</h1>
      <p className="mb-8 text-mute">Everything you need to know about NextHireAI.</p>
      <div className="divide-y divide-hairline rounded-lg border border-hairline bg-surface">
        {FAQS.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-ink">
              {f.q}
              <span className="text-mute transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-2 text-sm leading-relaxed text-body">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
