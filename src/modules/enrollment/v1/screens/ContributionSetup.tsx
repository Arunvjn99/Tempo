import { useEffect, useId, useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Info, Minus, Plus, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { generateContributionProjectionData } from "../flow/contributionProjection";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import { cn } from "@/lib/utils";

const S = "enrollment.v1.contributionSetup.";

export function ContributionSetup() {
  const { t } = useTranslation();
  const contribution = useEnrollmentStore((s) => s.contribution);
  const salary = useEnrollmentStore((s) => s.salary);
  const retirementAge = useEnrollmentStore((s) => s.retirementAge);
  const updateField = useEnrollmentStore((s) => s.updateField);

  const quickOptions = useMemo(
    () => [
      { label: t(`${S}quick4`), value: 4, icon: null as string | null },
      { label: t(`${S}quick6`), value: 6, icon: "✅" },
      { label: t(`${S}quick10`), value: 10, icon: null },
      { label: t(`${S}quick15`), value: 15, icon: "🚀" },
    ],
    [t],
  );

  const [compareMode, setCompareMode] = useState(false);
  const [comparePercent, setComparePercent] = useState(12);
  const [percentInput, setPercentInput] = useState(String(contribution));
  const [dollarInput, setDollarInput] = useState(String(Math.round((salary * contribution) / 100)));

  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    setPercentInput(String(contribution));
    setDollarInput(String(Math.round((salary * contribution) / 100)));
  }, [contribution, salary]);

  const percent = contribution;
  const monthlyPaycheck = Math.round(salary / 12);
  const monthlyContribution = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);

  const projectionData = generateContributionProjectionData(percent, salary);
  const projectedTotal = projectionData[projectionData.length - 1]?.value ?? 0;
  const monthlyRetirementIncome = Math.round((projectedTotal * 0.04) / 12);

  const recommendedPercent = 12;
  const progressPercentage = Math.min((percent / recommendedPercent) * 100, 100);

  const comparisonData = generateContributionProjectionData(comparePercent, salary);
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value ?? 0;
  const difference = comparisonTotal - projectedTotal;

  const onePercentIncrease = generateContributionProjectionData(percent + 1, salary);
  const onePercentImpact =
    (onePercentIncrease[onePercentIncrease.length - 1]?.value ?? 0) - projectedTotal;

  const adjustPercent = (delta: number) => {
    const newValue = Math.max(1, Math.min(25, percent + delta));
    updateField("contribution", newValue);
  };

  const handlePercentInputChange = (value: string) => {
    setPercentInput(value);
    const numValue = parseFloat(value);
    if (!Number.isNaN(numValue) && numValue >= 1 && numValue <= 25) {
      updateField("contribution", Math.round(numValue));
      setDollarInput(String(Math.round((salary * Math.round(numValue)) / 100)));
    }
  };

  const handleDollarInputChange = (value: string) => {
    setDollarInput(value);
    const numValue = parseFloat(value.replace(/,/g, ""));
    if (!Number.isNaN(numValue)) {
      const calculatedPercent = Math.round((numValue / salary) * 100);
      if (calculatedPercent >= 1 && calculatedPercent <= 25) {
        updateField("contribution", calculatedPercent);
        setPercentInput(String(calculatedPercent));
      }
    }
  };

  const handleQuickOption = (value: number) => {
    updateField("contribution", value);
  };

  const rangePct = `${((percent - 1) / 24) * 100}%`;

  const tooltipFormatter = (val: number, name: string) => {
    const formatted = `$${val.toLocaleString()}`;
    if (name === "value") return [formatted, t(`${S}chartTotalSavings`)];
    if (name === "contributions") return [formatted, t(`${S}chartYourContributions`)];
    if (name === "marketGain") return [formatted, t(`${S}chartMarketGains`)];
    return [formatted, name];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground md:text-2xl">{t(`${S}title`)}</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">{t(`${S}subtitle`)}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card space-y-6">
          <div className="card-highlight">
            <p className="text-center text-[0.75rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`${S}monthlyPaycheck`)}
            </p>
            <p className="mt-1 text-center text-2xl font-bold text-foreground">
              ${monthlyPaycheck.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p className="mb-3 text-[0.8rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`${S}yourContribution`)}
            </p>
            <div className="contribution-control">
              <button
                type="button"
                onClick={() => adjustPercent(-1)}
                className="control-btn"
                aria-label={t(`${S}decreasePctAria`)}
              >
                <Minus className="h-5 w-5" aria-hidden />
              </button>
              <p className="contribution-value">{percent}%</p>
              <button
                type="button"
                onClick={() => adjustPercent(1)}
                className="control-btn"
                aria-label={t(`${S}increasePctAria`)}
              >
                <Plus className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`${S}percentage`)}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={25}
                  step={0.5}
                  value={percentInput}
                  onChange={(e) => handlePercentInputChange(e.target.value)}
                  className="input input--suffix"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="mb-2 block text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
                {t(`${S}annualDollar`)}
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                  $
                </span>
                <input
                  type="text"
                  value={dollarInput}
                  onChange={(e) => handleDollarInputChange(e.target.value)}
                  className="input input--prefix"
                />
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-muted-foreground">
              {t(`${S}quickSelect`)}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleQuickOption(opt.value)}
                  className={cn("chip", percent === opt.value && "chip-active")}
                >
                  {opt.label} {opt.icon ?? ""}
                </button>
              ))}
            </div>
          </div>

          <div className="px-1">
            <input
              type="range"
              min={1}
              max={25}
              value={percent}
              onChange={(e) => updateField("contribution", Number(e.target.value))}
              className="contribution-range"
              style={{ "--range-pct": rangePct } as CSSProperties}
            />
            <div className="mt-2 flex justify-between text-[0.7rem] text-muted-foreground">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          <div className="card-highlight">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="text-[0.7rem] font-bold text-foreground">{t(`${S}proTipTitle`)}</p>
                <p className="text-[0.75rem] leading-snug text-muted-foreground">
                  {t(`${S}proTipBody`, { amount: `$${onePercentImpact.toLocaleString()}` })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground md:text-base">{t(`${S}projectionTitle`)}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{t(`${S}projectionSub`)}</p>
            </div>
            <div className="text-right">
              <p className="success-inline-label">
                {t(`${S}onTrack`, { percent: Math.round(progressPercentage) })}
              </p>
              <div className="success-progress-track">
                <div className="success-progress-fill" style={{ width: `${progressPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="success-card">
              <p className="text-center text-[0.7rem] font-semibold uppercase tracking-wide success-card-muted-label">
                {t(`${S}projectedAtAge`, { age: retirementAge })}
              </p>
              <p className="success-card-value">${(projectedTotal / 1_000_000).toFixed(1)}M</p>
              <p className="success-card-caption">
                {t(`${S}approxPerMo`, { amount: `$${monthlyRetirementIncome.toLocaleString()}` })}
              </p>
            </div>

            <div className="card-soft space-y-2.5">
              <p className="text-center text-[0.7rem] font-bold uppercase tracking-wide text-foreground">
                {t(`${S}monthlyImpact`)}
              </p>
              <div>
                <p className="text-center text-[0.7rem] text-muted-foreground">{t(`${S}youContribute`)}</p>
                <p className="mt-0.5 text-center text-base font-bold text-foreground">
                  ${monthlyContribution.toLocaleString()}
                </p>
              </div>
              <div className="success-card success-card--compact">
                <p className="success-card-emphasis">{t(`${S}employerAdds`)}</p>
                <p className="success-card-emphasis-lg">+${monthlyMatch.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="chart-container h-56 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id={`${gradientId}-m`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.5} vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
                  tickLine={false}
                  axisLine={{ stroke: "var(--color-border)" }}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--color-text-tertiary)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={tooltipFormatter}
                  contentStyle={{
                    borderRadius: 12,
                    fontSize: 11,
                    border: "1px solid var(--color-border)",
                    backgroundColor: "var(--color-background)",
                    color: "var(--color-text)",
                  }}
                />
                <ReferenceLine
                  y={projectedTotal * 0.75}
                  stroke="var(--color-success)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stroke="var(--color-text-tertiary)"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area
                  type="monotone"
                  dataKey="marketGain"
                  stroke="var(--color-success)"
                  fill={`url(#${gradientId}-m)`}
                  strokeWidth={2}
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill={`url(#${gradientId})`}
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[0.7rem] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="chart-legend-swatch chart-legend-swatch--primary" />
              {t(`${S}chartTotalSavings`)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="chart-legend-swatch chart-legend-swatch--success" />
              {t(`${S}chartMarketGains`)}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="chart-legend-dash" />
              {t(`${S}chartYourContributions`)}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
            <p className="text-[0.7rem] leading-snug text-muted-foreground">{t(`${S}disclaimer`)}</p>
          </div>

          <div className="card-soft space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[0.7rem] font-bold uppercase tracking-wide text-foreground">
                {t(`${S}compareScenarios`)}
              </p>
              <button
                type="button"
                onClick={() => setCompareMode(!compareMode)}
                className={cn("chip", compareMode && "chip-active")}
              >
                {compareMode ? t(`${S}hide`) : t(`${S}show`)}
              </button>
            </div>
            {compareMode ? (
              <div className="space-y-3 border-t border-border pt-3">
                <div className="flex gap-2">
                  {[10, 12, 15].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setComparePercent(val)}
                      className={cn("chip flex-1", comparePercent === val && "chip-active")}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                <div
                  className={cn(
                    "difference-card",
                    difference < 0 ? "difference-card--negative" : "difference-card--positive",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-bold",
                      difference < 0 ? "difference-title--negative" : "difference-title--positive",
                    )}
                  >
                    {difference >= 0 ? "+" : "-"}${Math.abs(difference).toLocaleString()}
                  </p>
                  <p
                    className={cn(
                      "text-[0.7rem]",
                      difference < 0 ? "difference-sub--negative" : "difference-sub--positive",
                    )}
                  >
                    {difference >= 0 ? t(`${S}compareMore`) : t(`${S}compareLess`)}{" "}
                    {t(`${S}compareVs`, { compare: comparePercent, current: percent })}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
