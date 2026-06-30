export function EmptyState({
  icon = "✦",
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-hairline bg-surface/40 px-6 py-16 text-center">
      <div className="text-2xl text-stone">{icon}</div>
      <h3 className="mt-3 text-base font-medium text-ink">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-mute">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
