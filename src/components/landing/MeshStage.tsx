"use client";

/**
 * Hero 3D object. The original design rendered a faceted crystal in Three.js;
 * this is a dependency-free SVG/CSS rendition in the same monochrome language
 * (dark facets, white hairline edges, a soft glow halo behind it). It honours
 * prefers-reduced-motion via CSS. A real Three.js scene can be swapped in later
 * behind this same component boundary.
 */
export function MeshStage({
  glow = "mono",
  size = "md",
}: {
  glow?: "mono" | "red";
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "min(48vw, 620px)" : "min(40vw, 520px)";
  const glowColor =
    glow === "red"
      ? "radial-gradient(circle, rgba(255,97,97,0.22), rgba(255,97,97,0.05) 42%, transparent 68%)"
      : "radial-gradient(circle, rgba(255,255,255,0.16), rgba(255,255,255,0.03) 44%, transparent 70%)";

  return (
    <div
      className="relative aspect-square select-none"
      style={{ width: dim, pointerEvents: "none" }}
    >
      <div
        className="absolute -inset-[12%] blur-lg"
        style={{ background: glowColor }}
        aria-hidden
      />
      <div className="crystal-spin absolute inset-0 grid place-items-center">
        <svg viewBox="0 0 200 200" className="h-3/4 w-3/4" aria-hidden>
          {/* faceted crystal — dark fills, white hairline edges */}
          <g fill="#121212" stroke="#f4f4f6" strokeWidth="1.4" strokeLinejoin="round">
            <polygon points="100,18 150,75 100,100" fill="#181818" />
            <polygon points="100,18 50,75 100,100" fill="#0f0f0f" />
            <polygon points="50,75 100,100 70,150" fill="#141414" />
            <polygon points="150,75 100,100 130,150" fill="#101010" />
            <polygon points="70,150 100,100 130,150 100,182" fill="#0d0d0d" />
          </g>
          <polyline
            points="100,18 100,100 100,182"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes drift {
          0%, 100% { transform: rotate(-4deg) translateY(0); }
          50% { transform: rotate(4deg) translateY(-10px); }
        }
        .crystal-spin {
          animation: drift 9s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .crystal-spin { animation: none; }
        }
      `}</style>
    </div>
  );
}
