import type { Config } from "tailwindcss";

/**
 * Tailwind maps to the NextHireAI design tokens (defined as CSS variables in
 * src/app/globals.css). Using var() references means utilities like `bg-canvas`
 * or `text-mute` resolve to the exact brand values from the original design.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-pressed": "var(--color-primary-pressed)",
        "on-primary": "var(--color-on-primary)",
        canvas: "var(--color-canvas)",
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
        "surface-card": "var(--color-surface-card)",
        hairline: "var(--color-hairline)",
        "hairline-strong": "var(--color-hairline-strong)",
        ink: "var(--color-ink)",
        body: "var(--color-body)",
        charcoal: "var(--color-charcoal)",
        mute: "var(--color-mute)",
        ash: "var(--color-ash)",
        stone: "var(--color-stone)",
        "accent-blue": "var(--color-accent-blue)",
        "accent-red": "var(--color-accent-red)",
        "accent-green": "var(--color-accent-green)",
        "accent-yellow": "var(--color-accent-yellow)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      maxWidth: {
        container: "var(--container-max)",
        "hero-mockup": "var(--hero-mockup-max)",
      },
      keyframes: {
        lineRise: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        softFade: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        spinSlow: {
          from: { transform: "rotateY(0deg)" },
          to: { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
