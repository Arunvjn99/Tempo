import { useTranslation } from "react-i18next";
import type { PortfolioAllocationSlice } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  portfolio: PortfolioAllocationSlice;
  onViewDetails?: () => void;
  className?: string;
};

const SEGMENTS: { key: keyof PortfolioAllocationSlice; labelKey: string; colorVar: string }[] = [
  { key: "usStocks", labelKey: "dashboard.postEnrollment.usEquities", colorVar: "var(--ds-portfolio-us)" },
  { key: "intlStocks", labelKey: "dashboard.postEnrollment.intlEquities", colorVar: "var(--ds-portfolio-intl)" },
  { key: "bonds", labelKey: "dashboard.postEnrollment.fixedIncome", colorVar: "var(--ds-portfolio-bonds)" },
  { key: "cash", labelKey: "dashboard.postEnrollment.peCashLabel", colorVar: "var(--ds-portfolio-cash)" },
];

export function PortfolioAllocation({ portfolio, onViewDetails, className }: Props) {
  const { t } = useTranslation();

  return (
    <section className={cn(pePanel, className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">
          {t("dashboard.postEnrollment.portfolioHealth")}
        </h2>
        {onViewDetails && (
          <button
            type="button"
            onClick={onViewDetails}
            className="font-dashboard-body text-sm font-semibold text-[var(--color-primary)] hover:underline"
          >
            {t("dashboard.postEnrollment.viewAll")}
          </button>
        )}
      </div>

      <div
        className="mt-8 flex h-3 w-full overflow-hidden rounded-full shadow-inner"
        style={{
          boxShadow: "inset 0 1px 2px color-mix(in srgb, var(--foreground) 6%, transparent)",
        }}
        role="img"
        aria-label={t("dashboard.postEnrollment.portfolioHealth")}
      >
        {SEGMENTS.map(({ key, colorVar }) => (
          <div
            key={key}
            className="h-full min-w-0 transition-all"
            style={{
              width: `${portfolio[key]}%`,
              background: colorVar,
            }}
          />
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {SEGMENTS.map(({ key, labelKey, colorVar }) => (
          <li key={key} className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: colorVar }} aria-hidden />
            <span className="font-dashboard-body">{t(labelKey)}</span>
            <span className="font-dashboard-heading tabular-nums font-semibold text-[var(--color-text)]">
              {portfolio[key]}%
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
