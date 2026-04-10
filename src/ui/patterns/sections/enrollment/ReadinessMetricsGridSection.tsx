import { formatPercent } from "@/features/enrollment/store/derived";

export interface ReadinessMetricsGridSectionProps {
  projectedBalanceLabel: string;
  monthlyIncomeLabel: string;
  yearsToRetirement: number;
  contributionPercent: number;
}

export function ReadinessMetricsGridSection({
  projectedBalanceLabel,
  monthlyIncomeLabel,
  yearsToRetirement,
  contributionPercent,
}: ReadinessMetricsGridSectionProps) {
  const metrics = [
    { label: "Projected Balance", value: projectedBalanceLabel },
    { label: "Monthly Income", value: `${monthlyIncomeLabel}/mo` },
    { label: "Years to Retire", value: `${yearsToRetirement} yrs` },
    { label: "Contribution", value: formatPercent(contributionPercent) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <div key={m.label} className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-xs text-muted-foreground">{m.label}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
