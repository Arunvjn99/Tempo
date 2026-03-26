import { useMemo } from "react";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { DollarSign } from "lucide-react";
import type { IncrementCycle, RiskLevel } from "../store/useEnrollmentStore";
import { GROWTH, useAutoIncreaseFinancialImpact, formatAutoIncreaseCurrency } from "../lib/autoIncreaseShared";

export type AutoIncreaseTimelineRow = {
  yearKey: number;
  yearLabel: string;
  dateStr: string;
  percent: number;
  annual: number;
};

function formatIncrementDate(cycle: IncrementCycle, yearOffset: number): string {
  const today = new Date();
  let d: Date;
  if (cycle === "calendar") {
    d = new Date(today.getFullYear() + yearOffset, 0, 1);
  } else if (cycle === "plan") {
    d = new Date(today.getFullYear() + yearOffset, 3, 1);
  } else {
    d = new Date(today.getFullYear() + yearOffset, today.getMonth(), today.getDate());
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatAnnualShort(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${n.toLocaleString()}`;
}

const I = "enrollment.v1.autoIncreaseInsights.";

function buildTimelineRows(
  currentPercent: number,
  increasePerCycle: number,
  maxContribution: number,
  incrementCycle: IncrementCycle,
  salary: number,
  t: TFunction,
): AutoIncreaseTimelineRow[] {
  if (increasePerCycle <= 0 || currentPercent >= maxContribution) return [];
  const out: AutoIncreaseTimelineRow[] = [];
  let pct = currentPercent;
  let yr = 0;
  const push = () => {
    out.push({
      yearKey: yr,
      yearLabel: yr === 0 ? t(`${I}timelineNow`) : t(`${I}timelineY`, { n: yr }),
      dateStr: formatIncrementDate(incrementCycle, yr),
      percent: Math.round(pct * 10) / 10,
      annual: Math.round((salary * pct) / 100),
    });
  };
  push();
  while (pct < maxContribution) {
    yr += 1;
    pct = Math.min(pct + increasePerCycle, maxContribution);
    push();
  }
  return out;
}

export type AutoIncreaseInsightsProps = {
  currentPercent: number;
  increasePerCycle: number;
  maxContribution: number;
  incrementCycle: IncrementCycle;
  salary: number;
  riskLevel: RiskLevel | null;
  currentSavings: number;
  retirementAge: number;
  currentAge: number;
};

/**
 * Right rail for V1 auto-increase config — growth summary, savings impact, banner, timeline table.
 * Values derive from enrollment inputs (POC-quality projection math shared with decision step).
 */
export function AutoIncreaseInsights({
  currentPercent,
  increasePerCycle,
  maxContribution,
  incrementCycle,
  salary,
  riskLevel,
  currentSavings,
  retirementAge,
  currentAge,
}: AutoIncreaseInsightsProps) {
  const { t } = useTranslation();
  const growthRate = GROWTH[riskLevel ?? "balanced"];

  const yearsToMax =
    currentPercent >= maxContribution || increasePerCycle <= 0
      ? 0
      : Math.ceil((maxContribution - currentPercent) / increasePerCycle);

  const financialImpact = useAutoIncreaseFinancialImpact({
    currentPercent,
    increaseAmount: increasePerCycle,
    maxContribution,
    salary,
    growthRate,
    currentSavings,
    retirementAge,
    currentAge,
  });

  const timelineRows = useMemo(
    () =>
      buildTimelineRows(
        currentPercent,
        increasePerCycle,
        maxContribution,
        incrementCycle,
        salary,
        t,
      ),
    [currentPercent, increasePerCycle, maxContribution, incrementCycle, salary, t],
  );

  const showImpact =
    increasePerCycle > 0 && currentPercent < maxContribution && financialImpact.difference > 0;

  return (
    <aside
      className="auto-increase-insights-panel lg:sticky lg:top-4 lg:self-start"
      aria-label={t(`${I}aria`)}
    >
      <div className="auto-increase-insights-panel__section">
        <p className="auto-increase-insights-panel__summary">
          {currentPercent >= maxContribution ? (
            t(`${I}atMax`)
          ) : increasePerCycle <= 0 ? (
            t(`${I}selectIncrease`)
          ) : (
            <Trans
              i18nKey={`${I}growthSummary`}
              values={{ from: currentPercent, to: maxContribution, count: yearsToMax }}
              count={yearsToMax}
              components={{ from: <strong />, to: <strong />, y: <strong /> }}
            />
          )}
        </p>
      </div>

      {showImpact && (
        <div className="auto-increase-insights-panel__section">
          <p
            className="mb-2.5 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            {t(`${I}savingsImpact`)}
          </p>
          <div className="auto-increase-insights-impact-grid">
            <div className="auto-increase-insights-impact-card">
              <p className="auto-increase-insights-impact-label">{t(`${I}withoutIncreases`)}</p>
              <p className="auto-increase-insights-impact-value">
                {formatAutoIncreaseCurrency(financialImpact.withoutIncrease)}
              </p>
            </div>
            <div className="auto-increase-insights-impact-card auto-increase-insights-impact-card--highlight">
              <p className="auto-increase-insights-impact-label">{t(`${I}withIncreases`)}</p>
              <p className="auto-increase-insights-impact-value">
                {formatAutoIncreaseCurrency(financialImpact.withIncrease)}
              </p>
            </div>
          </div>
          <div className="auto-increase-insights-banner">
            <DollarSign className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} aria-hidden />
            <p className="m-0">
              {t(`${I}bannerBefore`)}
              <strong>{formatAutoIncreaseCurrency(financialImpact.difference)}</strong>
              {t(`${I}bannerAfter`)}
            </p>
          </div>
        </div>
      )}

      {timelineRows.length > 0 && (
        <div className="auto-increase-insights-panel__section">
          <h3 className="mb-2.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {t(`${I}timelineTitle`)}
          </h3>
          <div className="auto-increase-insights-table-wrap">
            <table className="auto-increase-insights-table">
              <thead>
                <tr>
                  <th scope="col">{t(`${I}colYear`)}</th>
                  <th scope="col">{t(`${I}colDate`)}</th>
                  <th scope="col">{t(`${I}colPct`)}</th>
                  <th scope="col">{t(`${I}colAnnual`)}</th>
                </tr>
              </thead>
              <tbody>
                {timelineRows.map((row) => (
                  <tr key={row.yearKey}>
                    <td>{row.yearLabel}</td>
                    <td>{row.dateStr}</td>
                    <td>
                      <span className="auto-increase-insights-table__pct">{row.percent}%</span>
                      {row.percent === maxContribution && (
                        <span className="auto-increase-insights-table__max-pill">{t(`${I}maxPill`)}</span>
                      )}
                    </td>
                    <td className="auto-increase-insights-table__pct">{formatAnnualShort(row.annual)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2.5 border-t border-[var(--border-subtle)] pt-2.5 text-[0.7rem]" style={{ color: "var(--text-secondary)" }}>
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {t(`${I}timelineLabel`)}{" "}
            </span>
            {t(`${I}timelineFooter`, {
              count: yearsToMax,
              from: currentPercent,
              to: maxContribution,
            })}
          </p>
        </div>
      )}
    </aside>
  );
}
