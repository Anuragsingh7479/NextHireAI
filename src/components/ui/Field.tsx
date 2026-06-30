import { cn } from "@/lib/utils";

const inputBase =
  "w-full rounded-md border border-hairline bg-surface-elevated px-3 py-2.5 text-sm " +
  "text-ink outline-none transition-colors placeholder:text-stone " +
  "focus:border-hairline-strong";

export function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-1.5 block text-xs tracking-[0.2px] text-mute">{children}</span>;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputBase, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputBase, "resize-y leading-relaxed", className)} {...props} />;
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Label>{label}</Label>
      {children}
    </label>
  );
}
