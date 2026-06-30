import Link from "next/link";
import { Logo } from "./Logo";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "anuragsingh02100@gmail.com";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Resume Builder", href: "/signup" },
      { label: "Cover Letters", href: "/signup" },
      { label: "ATS Score", href: "/ats" },
      { label: "Templates", href: "/#templates" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Pricing", href: "/pricing" },
      { label: "Help Center", href: "/help" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
      { label: "Terms & Refund", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid max-w-container gap-10 px-6 py-12 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-[280px] text-sm leading-relaxed text-mute">
            AI resume &amp; cover letter builder. Beat the ATS and get hired faster.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-[13px] font-medium text-ink">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-mute no-underline transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-container flex-col items-start justify-between gap-2 px-6 py-5 text-[13px] text-stone sm:flex-row sm:items-center">
          <span>© {new Date().getFullYear()} NextHireAI. All rights reserved.</span>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-mute no-underline hover:text-ink">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </footer>
  );
}
