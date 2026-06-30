import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "install" | "ghost";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 " +
  "font-medium tracking-[0.2px] rounded-md transition-[background,transform] " +
  "duration-150 active:translate-y-px disabled:opacity-50 disabled:pointer-events-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hairline-strong";

const variants: Record<Variant, string> = {
  // White universal CTA pill — the brand's single primary action.
  primary: "bg-primary text-on-primary hover:bg-primary-pressed",
  secondary: "bg-transparent text-mute hover:text-ink",
  // Tertiary "elevated" button used as the hero's secondary CTA.
  install:
    "bg-surface-elevated text-ink border border-hairline hover:bg-surface-card",
  ghost: "bg-transparent text-ink hover:bg-surface-card",
};

const sizes: Record<Size, string> = {
  md: "text-sm px-4 py-[9px]",
  sm: "text-[13px] px-3 py-[7px]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps & { href: string };

/** Brand button. Renders an <a>/Link when `href` is set, otherwise a <button>. */
export const Button = forwardRef<HTMLButtonElement, ButtonAsButton | ButtonAsLink>(
  function Button({ variant = "primary", size = "md", className, children, ...props }, ref) {
    const classes = cn(base, variants[variant], sizes[size], className);
    if ("href" in props && props.href) {
      return (
        <Link href={props.href} className={classes}>
          {children}
        </Link>
      );
    }
    return (
      <button ref={ref} className={classes} {...(props as ButtonAsButton)}>
        {children}
      </button>
    );
  }
);
