import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  userMonthly: number;
  employerMonthly: number;
  userPercent: number;
  employerPercent: number;
  className?: string;
};

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

export function MonthlyContribution({ userMonthly, employerMonthly, userPercent, employerPercent, className }: Props) {
  const { t } = useTranslation();

  const Row = ({
    label,
    amount,
    pct,
    barPct,
    barColor,
    ariaLabel,
  }: {
    label: string;
    amount: string;
    pct: string;
    barPct: number;
    barColor: string;
    ariaLabel: string;
  }) => (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1">
        <span className="font-dashboard-body text-sm font-medium text-[var(--color-text)]">{label}</span>
        <span className="font-dashboard-body text-right text-sm tabular-nums text-[var(--color-text-secondary)]">
          {amount}{" "}
          <span className="text-[var(--color-text-tertiary)]">({pct})</span>
        </span>
      </div>
      <div
        className="h-1 w-full overflow-hidden rounded-full"
        style={{ background: "color-mix(in srgb, var(--color-text-secondary) 10%, var(--color-background-tertiary))" }}
        role="progressbar"
        aria-valuenow={Math.round(barPct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div className="h-full rounded-full transition-all" style={{ width: `${barPct}%`, background: barColor }} />
      </div>
    </div>
  );

  return (
    <section className={cn(pePanel, className)}>
      <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">
        {t("dashboard.postEnrollment.monthlyContribution")}
      </h2>

      <div className="mt-8 space-y-8">
        <Row
          label={t("dashboard.postEnrollment.peContribYou")}
          amount={money(userMonthly)}
          pct={`${userPercent.toFixed(1)}%`}
          barPct={userPercent}
          barColor="var(--color-primary)"
          ariaLabel={t("dashboard.postEnrollment.peContribYou")}
        />
        <Row
          label={t("dashboard.postEnrollment.peContribEmployer")}
          amount={money(employerMonthly)}
          pct={`${employerPercent.toFixed(1)}%`}
          barPct={employerPercent}
          barColor="color-mix(in srgb, var(--color-success) 80%, var(--color-primary) 20%)"
          ariaLabel={t("dashboard.postEnrollment.peContribEmployer")}
        />
      </div>
    </section>
  );
}
