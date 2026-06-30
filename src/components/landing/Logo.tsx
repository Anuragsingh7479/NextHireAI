import Link from "next/link";

/** NextHireAI wordmark + the original "N" monogram from the hero design. */
export function Logo() {
  return (
    <Link
      href="/"
      aria-label="NextHireAI"
      className="inline-flex items-center gap-[10px] no-underline"
    >
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <rect x="0.5" y="0.5" width="39" height="39" rx="9.5" fill="#121212" stroke="#242728" />
        <path
          d="M13 27V13L27 27V13"
          stroke="#f4f4f6"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-base font-semibold tracking-[-0.2px] text-ink">
        NextHire<span className="text-mute"> AI</span>
      </span>
    </Link>
  );
}
