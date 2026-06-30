import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Guides and help for building resumes, cover letters, and using the ATS checker.",
};

const TOPICS = [
  { title: "Getting started", body: "Create an account, then click “New Resume” on your dashboard to begin. Your work auto-saves." },
  { title: "Using AI features", body: "Each section has ✦ AI buttons — generate a summary, bullet points, and skills, or improve your writing." },
  { title: "Switching templates", body: "Open a resume and pick a template from the switcher. Modern, Professional, Minimal, and Student are free; Creative and Executive are Pro." },
  { title: "Checking your ATS score", body: "Go to ATS Score, pick a resume, and review your score and fixes. The full report is a Pro feature." },
  { title: "Downloading", body: "Download as PDF or DOCX from the builder. Downloads require a Pro plan." },
  { title: "Managing your subscription", body: "View your plan, status, and expiry on the Billing page. Premium access is revoked automatically when a plan expires." },
];

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-2 text-3xl font-semibold tracking-[-0.6px]">Help Center</h1>
      <p className="mb-8 text-mute">
        Quick guides to get the most out of NextHireAI. Still stuck?{" "}
        <Link href="/contact" className="text-ink hover:underline">
          Contact support
        </Link>
        .
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {TOPICS.map((t) => (
          <div key={t.title} className="rounded-lg border border-hairline bg-surface p-5">
            <h2 className="text-sm font-semibold text-ink">{t.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-body">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
