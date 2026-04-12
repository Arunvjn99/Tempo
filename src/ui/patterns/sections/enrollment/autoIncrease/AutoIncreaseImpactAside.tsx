import { DollarSign } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { formatCurrency, formatPercent } from "@/features/enrollment/store/derived";

export interface ScheduleRow {
  year: number;
  pct: number;
  annual: number;
  date: string;
}

export interface AutoIncreaseImpactAsideProps {
  contributionPercent: number;
  autoIncreaseMax: number;
  autoIncreaseAmount: number;
  yearsToMax: number;
  hasDiff: boolean;
  projectedBalance: number;
  projectedBalanceNoAI: number;
  schedule: ScheduleRow[];
}

export function AutoIncreaseImpactAside({
  contributionPercent,
  autoIncreaseMax,
  autoIncreaseAmount,
  yearsToMax,
  hasDiff,
  projectedBalance,
  projectedBalanceNoAI,
  schedule,
}: AutoIncreaseImpactAsideProps) {
  return (
    <div className="lg:col-span-2">
      <div className="card-standard overflow-hidden lg:sticky lg:top-28">
        <div className="px-5 py-3.5">
          <p className="mb-1 text-[0.85rem] font-bold text-primary">Projected Impact</p>
          <p className="text-[0.82rem] text-secondary">
            {contributionPercent >= autoIncreaseMax ? (
              <>Your contribution rate is already at or above your selected maximum.</>
            ) : autoIncreaseAmount === 0 ? (
              <>Select an increase amount to see your contribution growth path.</>
            ) : (
              <>
                Your contribution will grow from{" "}
                <span className="font-semibold text-primary">{formatPercent(contributionPercent)}</span> to{" "}
                <span className="font-semibold text-primary">{formatPercent(autoIncreaseMax)}</span> over approximately{" "}
                <span className="font-semibold text-primary">
                  {yearsToMax} {yearsToMax === 1 ? "year" : "years"}
                </span>
                .
              </>
            )}
          </p>
        </div>

        {hasDiff && (
          <>
            <div className="border-t border-default" />
            <div className="space-y-3 px-5 py-4">
              <p className="text-[0.82rem] font-semibold text-primary">Savings Impact</p>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-xl border border-default bg-surface-soft px-3 py-3 text-center">
                  <p className="mb-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-secondary">
                    Without increases
                  </p>
                  <p className="text-[1.1rem] font-bold text-primary tabular-nums">
                    {formatCurrency(projectedBalanceNoAI)}
                  </p>
                </div>
                <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-3 text-center">
                  <p className="mb-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-success">
                    With increases
                  </p>
                  <p className="text-[1.1rem] font-bold text-success tabular-nums">
                    {formatCurrency(projectedBalance)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-success/20 bg-success/5 px-3.5 py-2.5">
                <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <p className="text-[0.78rem] text-primary">
                  Auto-increases could add approximately{" "}
                  <span className="font-bold text-success">
                    {formatCurrency(projectedBalance - projectedBalanceNoAI)}
                  </span>{" "}
                  more to your retirement savings.
                </p>
              </div>
            </div>
          </>
        )}

        {schedule.length > 0 && (
          <>
            <div className="border-t border-default" />
            <div className="px-4 py-3">
              <h3 className="mb-3 text-[0.85rem] font-bold text-primary">Growth Timeline</h3>
              <div className="-mx-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-default">
                    <tr>
                      {["Year", "Date", "%", "Annual"].map((h, i) => (
                        <th
                          key={h}
                          className={cn(
                            "px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-wide text-secondary",
                            i === 3 ? "text-right" : "text-left",
                          )}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {schedule.map((row, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "transition-colors hover:bg-muted",
                          row.pct === autoIncreaseMax && "bg-surface-soft",
                        )}
                      >
                        <td className="px-3 py-1.5 text-[0.75rem] font-medium text-primary">
                          {row.year === 0 ? "Now" : `Y${row.year}`}
                        </td>
                        <td className="px-3 py-1.5 text-[0.7rem] text-secondary">{row.date}</td>
                        <td className="px-3 py-1.5">
                          <div className="flex items-center gap-1">
                            <span className="text-[0.75rem] font-semibold text-primary tabular-nums">
                              {formatPercent(row.pct, 1)}
                            </span>
                            {row.pct === autoIncreaseMax && (
                              <span className="rounded bg-primary/10 px-1 py-0.5 text-[0.55rem] font-semibold text-brand">
                                MAX
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-1.5 text-right text-[0.75rem] font-semibold text-primary tabular-nums">
                          {formatCurrency(row.annual)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 border-t border-default pt-3">
                <p className="text-[0.7rem] text-secondary">
                  <span className="font-semibold text-primary">Timeline:</span>{" "}
                  {formatPercent(contributionPercent)} → {formatPercent(autoIncreaseMax)} over {yearsToMax}{" "}
                  {yearsToMax === 1 ? "yr" : "yrs"}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
