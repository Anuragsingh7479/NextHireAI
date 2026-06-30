import type { Metadata } from "next";
import { PricingCards } from "@/components/marketing/PricingCards";

export const metadata: Metadata = {
  title: "Pricing",
  description: "NextHireAI Pro pricing. Choose a plan to build resumes & cover letters, run the full ATS analysis, and download in PDF/DOCX.",
};

export default function PricingPage() {
  return (
    <div>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold tracking-[-0.6px] sm:text-4xl">
          Simple, honest pricing
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-mute">
          Choose a plan to unlock the full builder, AI generation, the complete ATS analysis,
          premium templates, and PDF/DOCX downloads.
        </p>
      </div>
      <PricingCards />
    </div>
  );
}
