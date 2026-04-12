/** Section headers for Transaction Center — theme tokens only. */
export function SummaryHeader({
  icon,
  title,
  subtitle,
  badge,
  variant = "default",
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: { text: string; color: string };
  variant?: "default" | "ai";
}) {
  return (
    <div className="mb-5 flex items-center gap-2.5 sm:mb-6">
      <div className={variant === "ai" ? "text-[var(--color-accent)] dark:text-[color-mix(in_srgb,var(--color-accent)_80%,var(--surface-card))]" : "text-brand"}>
        {icon}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <h2 className="text-[15px] font-bold tracking-[-0.3px] text-primary sm:text-[16px]">
          {title}
        </h2>
        {badge ? (
          <span className={`rounded-[6px] px-2.5 py-[3px] text-[11px] font-bold ${badge.color}`}>
            {badge.text}
          </span>
        ) : null}
      </div>
      {subtitle ? (
        <span className="ml-auto hidden text-[12px] font-medium text-secondary sm:block">
          {subtitle}
        </span>
      ) : null}
    </div>
  );
}
