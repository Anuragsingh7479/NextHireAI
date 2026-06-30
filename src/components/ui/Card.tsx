import { cn } from "@/lib/utils";

/** Elevated panel — hairline border, no shadow (per the design system). */
export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-hairline bg-surface p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
