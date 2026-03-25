import { useMemo } from "react";
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

function buildTimelineRows(
  currentPercent: number,
  increasePerCycle: number,
  maxContribution: number,
  incrementCycle: IncrementCycle,
  salary: number,
): AutoIncreaseTimelineRow[] {
  if (increasePerCycle <= 0 || currentPercent >= maxContribution) return [];
  const out: AutoIncreaseTimelineRow[] = [];
  let pct = currentPercent;
  let yr = 0;
  const push = () => {
    out.push({
      yearKey: yr,
      yearLabel: yr === 0 ? "Now" : `Y${yr}`,
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
      ),
    [currentPercent, increasePerCycle, maxContribution, incrementCycle, salary],
  );

  const showImpact =
    increasePerCycle > 0 && currentPercent < maxContribution && financialImpact.difference > 0;

  return (
    <aside
      className="auto-increase-insights-panel lg:sticky lg:top-4 lg:self-start"
      aria-label="Auto increase impact and timeline"
    >
      <div className="auto-increase-insights-panel__section">
        <p className="auto-increase-insights-panel__summary">
          {currentPercent >= maxContribution ? (
            <>Your contribution rate is already at or above your selected maximum.</>
          ) : increasePerCycle <= 0 ? (
            <>Select an increase amount per cycle to see how your contribution grows over time.</>
          ) : (
            <>
              Your contribution will grow from <strong>{currentPercent}%</strong> to{" "}
              <strong>{maxContribution}%</strong> over approximately{" "}
              <strong>
                {yearsToMax} {yearsToMax === 1 ? "year" : "years"}
              </strong>
              .
            </>
          )}
        </p>
      </div>

      {showImpact && (
        <div className="auto-increase-insights-panel__section">
          <p
            className="mb-2.5 text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Savings impact
          </p>
          <div className="auto-increase-insights-impact-grid">
            <div className="auto-increase-insights-impact-card">
              <p className="auto-increase-insights-impact-label">Without increases</p>
              <p className="auto-increase-insights-impact-value">
                {formatAutoIncreaseCurrency(financialImpact.withoutIncrease)}
              </p>
            </div>
            <div className="auto-increase-insights-impact-card auto-increase-insights-impact-card--highlight">
              <p className="auto-increase-insights-impact-label">With increases</p>
              <p className="auto-increase-insights-impact-value">
                {formatAutoIncreaseCurrency(financialImpact.withIncrease)}
              </p>
            </div>
          </div>
          <div className="auto-increase-insights-banner">
            <DollarSign className="h-4 w-4 shrink-0" style={{ color: "var(--success)" }} aria-hidden />
            <p className="m-0">
              Automatic increases could add approximately{" "}
              <strong>{formatAutoIncreaseCurrency(financialImpact.difference)}</strong> more to your retirement savings.
            </p>
          </div>
        </div>
      )}

      {timelineRows.length > 0 && (
        <div className="auto-increase-insights-panel__section">
          <h3 className="mb-2.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Growth timeline
          </h3>
          <div className="auto-increase-insights-table-wrap">
            <table className="auto-increase-insights-table">
              <thead>
                <tr>
                  <th scope="col">Year</th>
                  <th scope="col">Date</th>
                  <th scope="col">%</th>
                  <th scope="col">Annual</th>
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
                        <span className="auto-increase-insights-table__max-pill">MAX</span>
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
              Timeline:
            </span>{" "}
            {currentPercent}% → {maxContribution}% over {yearsToMax} {yearsToMax === 1 ? "yr" : "yrs"}
          </p>
        </div>
      )}
    </aside>
  );
}
