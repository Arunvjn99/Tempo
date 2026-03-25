import { cn } from "@/lib/utils";

export type MonthlyContributionRow = {
  label: string;
  percentLabel: string;
  amountLabel: string;
  /** 0–100 for bar width */
  barPercent: number;
};

export type MonthlyContributionCardProps = {
  className?: string;
  youPercentLabel?: string;
  youAmountLabel?: string;
  employerPercentLabel?: string;
  employerAmountLabel?: string;
  totalLabel?: string;
};

function BarRow({ label, percentLabel, amountLabel, barPercent }: MonthlyContributionRow) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-medium text-[var(--text-primary)]">{label}</span>
        <span className="shrink-0 text-[var(--text-muted)]">
          {percentLabel} → <span className="font-semibold text-[var(--text-primary)]">{amountLabel}</span>
        </span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full"
        style={{ background: "color-mix(in srgb, var(--border-subtle) 55%, transparent)" }}
        role="presentation"
      >
        <div
          className="h-full rounded-full transition-[width] duration-500"
          style={{
            width: `${Math.min(100, Math.max(0, barPercent))}%`,
            background: "var(--primary)",
          }}
        />
      </div>
    </div>
  );
}

/**
 * Post-enrollment summary: employee vs employer monthly deferrals with progress bars.
 */
export function MonthlyContributionCard({
  className,
  youPercentLabel = "8%",
  youAmountLabel = "$450",
  employerPercentLabel = "4%",
  employerAmountLabel = "+$225",
  totalLabel = "$675",
}: MonthlyContributionCardProps) {
  const rows: MonthlyContributionRow[] = [
    { label: "You", percentLabel: youPercentLabel, amountLabel: youAmountLabel, barPercent: 67 },
    { label: "Employer", percentLabel: employerPercentLabel, amountLabel: employerAmountLabel, barPercent: 33 },
  ];

  return (
    <section
      className={cn(
        "mb-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-6 shadow-sm sm:p-8",
        className,
      )}
      aria-labelledby="monthly-contribution-heading"
    >
      <h2 id="monthly-contribution-heading" className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
        Monthly contributions
      </h2>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Payroll deferrals going into your plan this month.</p>

      <div className="mt-6 space-y-5">
        {rows.map((r) => (
          <BarRow key={r.label} {...r} />
        ))}
        <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-4 text-base font-semibold text-[var(--text-primary)]">
          <span>Total per month</span>
          <span className="text-[var(--primary)]">{totalLabel}</span>
        </div>
      </div>
    </section>
  );
}
