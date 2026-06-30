// Infinite client/company marquee (faithful to the original hero TrustStrip).
const COMPANIES = [
  "GOOGLE",
  "AMAZON",
  "MICROSOFT",
  "STRIPE",
  "META",
  "NETFLIX",
  "UBER",
  "AIRBNB",
];

export function TrustStrip() {
  const row = [...COMPANIES, ...COMPANIES];
  const item =
    "text-[13px] font-medium tracking-[1.5px] text-stone whitespace-nowrap";

  return (
    <div className="relative overflow-hidden border-t border-hairline">
      <div className="mx-auto flex max-w-container items-center gap-[14px] px-6 pb-6 pt-[22px]">
        <span className={`${item} shrink-0 !text-ash`}>Trusted by candidates hired at</span>
        <div className="marquee-mask relative flex-1 overflow-hidden">
          <div className="marquee-track flex w-max gap-12">
            {row.map((c, i) => (
              <span key={i} className={item}>
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
