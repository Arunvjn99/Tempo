// @ts-nocheck — verbatim Figma Make export (unused locals preserved).
import { useState, useMemo, useId } from "react";
import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, TrendingUp, Calendar, Target, DollarSign, Info } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { compareBalancesWithAndWithoutAutoStep, getGrowthRate } from "@/utils/retirementCalculations";

export function AutoIncreaseSetup() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();

  const [increaseAmount, setIncreaseAmount] = useState(data.autoIncreaseAmount);
  const [maxContribution, setMaxContribution] = useState(Math.min(data.autoIncreaseMax, 15));
  const [incrementCycle, setIncrementCycle] = useState<"calendar" | "participant" | "plan">("calendar");

  const currentPercent = data.contributionPercent;
  const salary = data.salary;
  const gradientId = useId().replace(/:/g, "_") + "_autoInc";

  // Calculate current monthly contribution
  const currentMonthlyContribution = Math.round((salary * currentPercent) / 100 / 12);
  const currentAnnualContribution = Math.round((salary * currentPercent) / 100);

  // Progression data for both chart and summary
  const progression = useMemo(() => {
    if (increaseAmount === 0 || currentPercent >= maxContribution) {
      // Need at least 2 points for the chart to render properly
      return [
        { year: 0, percent: currentPercent },
        { year: 1, percent: currentPercent },
      ];
    }
    const points: { year: number; percent: number }[] = [
      { year: 0, percent: currentPercent },
    ];
    let pct = currentPercent;
    let yr = 0;
    while (pct < maxContribution && yr < 30) {
      yr++;
      pct = Math.min(pct + increaseAmount, maxContribution);
      points.push({ year: yr, percent: Math.round(pct * 10) / 10 });
    }
    // Add one flat year after max for visual clarity
    const lastYear = points[points.length - 1].year;
    points.push({ year: lastYear + 1, percent: maxContribution });
    return points;
  }, [currentPercent, increaseAmount, maxContribution]);

  const yearsToMax =
    currentPercent >= maxContribution || increaseAmount === 0
      ? 0
      : Math.ceil((maxContribution - currentPercent) / increaseAmount);

  // Generate year-by-year table data
  const yearByYearData = useMemo(() => {
    if (increaseAmount === 0 || currentPercent >= maxContribution) {
      return [];
    }
    const rows: { year: number; percent: number; annual: number; date: string }[] = [];
    let pct = currentPercent;
    let yr = 0;
    
    // Determine next increase date based on increment cycle
    const getNextDate = (yearOffset: number) => {
      const today = new Date();
      if (incrementCycle === "calendar") {
        return new Date(today.getFullYear() + yearOffset, 0, 1); // Jan 1
      } else if (incrementCycle === "plan") {
        return new Date(today.getFullYear() + yearOffset, 3, 1); // Apr 1
      } else {
        // participant - assume Aug 15 as enrollment date
        return new Date(today.getFullYear() + yearOffset, 7, 15); // Aug 15
      }
    };

    while (pct < maxContribution && yr <= yearsToMax) {
      const annual = Math.round((salary * pct) / 100);
      const nextDate = getNextDate(yr);
      rows.push({
        year: yr,
        percent: Math.round(pct * 10) / 10,
        annual,
        date: nextDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      
      if (pct < maxContribution) {
        pct = Math.min(pct + increaseAmount, maxContribution);
      }
      yr++;
    }
    
    return rows;
  }, [currentPercent, increaseAmount, maxContribution, salary, yearsToMax, incrementCycle]);

  // Financial impact comparison
  const financialImpact = useMemo(() => {
    const yearsToRetirement = personalization.retirementAge - personalization.currentAge;
    const growthRate = getGrowthRate(data.riskLevel);
    return compareBalancesWithAndWithoutAutoStep(
      salary,
      currentPercent,
      increaseAmount,
      maxContribution,
      yearsToRetirement,
      growthRate,
      personalization.currentSavings,
    );
  }, [currentPercent, increaseAmount, maxContribution, salary, data.riskLevel, personalization]);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(2)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const handleSave = () => {
    updateData({
      autoIncrease: true,
      autoIncreaseAmount: increaseAmount,
      autoIncreaseMax: maxContribution,
    });
    setCurrentStep(5);
    navigate(ep("investment"));
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--surface-card)] border border-[var(--border-default)] rounded-lg px-3 py-2 ">
          <p className="text-[var(--text-secondary)] text-xs">
            {label === 0 ? "Today" : `Year ${label}`}
          </p>
          <p className="text-[var(--text-primary)] tabular-nums text-sm font-semibold">
            {payload[0].value}% of salary
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(ep("auto-increase"))}
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-9 h-9 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] flex items-center justify-center">
                <TrendingUp className="w-4.5 h-4.5 text-[var(--color-primary)]" />
              </div>
              <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Configure your automatic increases</h1>
            </div>
            <p className="text-[var(--text-secondary)] mt-1 text-sm">
              Your contribution will gradually increase over time.
            </p>
          </div>
          
          {/* Current Contribution Display - Moved to top right */}
          <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] rounded-xl px-4 py-3 shrink-0">
            <div className="flex items-start gap-6">
              <div>
                <p className="text-[var(--color-primary)] mb-0.5 text-xs font-bold uppercase tracking-wide">
                  Current
                </p>
                <p className="text-[var(--text-primary)] text-2xl font-extrabold leading-none">
                  {currentPercent}%
                </p>
                <p className="text-[var(--color-primary)] mt-1 text-xs">
                  ${currentMonthlyContribution.toLocaleString()}/mo
                </p>
              </div>
              <div className="border-l border-[var(--color-primary)]/25 pl-6">
                <p className="text-[var(--color-primary)] mb-0.5 text-xs font-bold uppercase tracking-wide">
                  Target Max
                </p>
                <p className="text-[var(--text-primary)] text-2xl font-extrabold leading-none">
                  {maxContribution}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid lg:grid-cols-5 gap-5 items-start">
        {/* ════ Left Column — Controls (3/5) ════ */}
        <div className="lg:col-span-3 space-y-4 order-1">
          {/* Increment Cycle Selection - Horizontal Layout */}
          <div className="rounded-2xl border-2 border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[var(--surface-card)] px-4 py-3">
            <h3 className="text-[var(--text-primary)] mb-2.5 text-sm font-bold">
              Increment Cycle
            </h3>
            
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Calendar Year Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-[var(--border-default)] rounded-xl p-3 hover:border-[var(--color-primary)]/25 transition-all has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="calendar"
                    checked={incrementCycle === "calendar"}
                    onChange={(e) => setIncrementCycle(e.target.value as "calendar")}
                    className="w-4 h-4 text-[var(--color-primary)] cursor-pointer"
                  />
                  <p className="text-[var(--text-primary)] text-sm font-semibold">
                    Calendar Year
                  </p>
                </div>
                <p className="text-[var(--text-secondary)] ml-6 text-xs">
                  Every Jan 1st
                </p>
              </label>

              {/* Plan Participant Date Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-[var(--border-default)] rounded-xl p-3 hover:border-[var(--color-primary)]/25 transition-all has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="participant"
                    checked={incrementCycle === "participant"}
                    onChange={(e) => setIncrementCycle(e.target.value as "participant")}
                    className="w-4 h-4 text-[var(--color-primary)] cursor-pointer"
                  />
                  <p className="text-[var(--text-primary)] text-sm font-semibold">
                    Participant Date
                  </p>
                </div>
                <p className="text-[var(--text-secondary)] ml-6 text-xs">
                  On enrollment date
                </p>
              </label>

              {/* Plan Year Option */}
              <label className="flex flex-col gap-2 cursor-pointer group border-2 border-[var(--border-default)] rounded-xl p-3 hover:border-[var(--color-primary)]/25 transition-all has-[:checked]:border-[var(--color-primary)] has-[:checked]:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="increment-cycle"
                    value="plan"
                    checked={incrementCycle === "plan"}
                    onChange={(e) => setIncrementCycle(e.target.value as "plan")}
                    className="w-4 h-4 text-[var(--color-primary)] cursor-pointer"
                  />
                  <p className="text-[var(--text-primary)] text-sm font-semibold">
                    Plan Year
                  </p>
                </div>
                <p className="text-[var(--text-secondary)] ml-6 text-xs">
                  Every April 1
                </p>
              </label>
            </div>
          </div>

          {/* Increase Amount Slider - More Compact */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <label className="text-[var(--text-primary)] text-sm font-medium">
                  How much do you want to increase per cycle?
                </label>

                {/* Slider */}
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--text-secondary)] text-xs">0%</span>
                    <span className="text-[var(--color-primary)] tabular-nums text-sm font-bold">
                      {increaseAmount}% per cycle
                    </span>
                    <span className="text-[var(--text-secondary)] text-xs">3%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(parseFloat(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
                      style={{
                      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${(increaseAmount / 3) * 100}%, var(--surface-section) ${(increaseAmount / 3) * 100}%, var(--surface-section) 100%)`,
                    }}
                  />
                </div>

                {/* Quick presets */}
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setIncreaseAmount(opt)}
                      className={`flex-1 py-1.5 rounded-lg transition-all text-xs font-medium ${
                        increaseAmount === opt
                          ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
                          : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-section)]"
                      }`}
                    >
                      {opt}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Maximum Contribution Slider */}
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--surface-section)] flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="flex-1">
                <label className="text-[var(--text-primary)] text-sm font-medium">
                  Stop increasing when contributions reach
                </label>
                <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                  Your contribution rate will not exceed this percentage.
                </p>

                {/* Slider */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[var(--text-secondary)] text-xs">10%</span>
                    <span className="text-[var(--color-primary)] tabular-nums text-base font-bold">
                      {maxContribution}%
                    </span>
                    <span className="text-[var(--text-secondary)] text-xs">15%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={1}
                    value={maxContribution}
                    onChange={(e) => setMaxContribution(parseInt(e.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
                      style={{
                      background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((maxContribution - 10) / 5) * 100}%, var(--surface-section) ${((maxContribution - 10) / 5) * 100}%, var(--surface-section) 100%)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="flex items-start gap-2.5 px-1">
            <Info className="w-4 h-4 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <p className="text-[var(--text-secondary)] text-xs">
              Automatic increases apply once per year on your enrollment anniversary. Your contribution will
              rise by the selected percentage each year until it reaches your maximum. You can change or
              disable automatic increases at any time.
            </p>
          </div>

          {/* CTA — desktop: below controls in left column */}
          <div className="hidden lg:block pt-1">
            <button
              onClick={handleSave}
              disabled={increaseAmount === 0}
              className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all ${
                increaseAmount > 0
                  ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
                  : "bg-[var(--surface-section)] text-[var(--text-secondary)] cursor-not-allowed"
              }`}
            >
              Save Auto Increase <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ════ Right Column — Projection (2/5) ════ */}
        <div className="lg:col-span-2 order-2">
          <div className="card-standard overflow-hidden lg:sticky lg:top-28">
            {/* Chart */}
            

            {/* Divider */}
            <div className="border-t border-[var(--border-default)]" />

            {/* Progression Summary */}
            <div className="px-5 py-3.5">
              <p className="text-[var(--text-primary)] text-sm">
                {currentPercent >= maxContribution ? (
                  <>Your contribution rate is already at or above your selected maximum.</>
                ) : increaseAmount === 0 ? (
                  <>Select an increase amount to see your contribution growth path.</>
                ) : (
                  <>
                    Your contribution will grow from{" "}
                    <span className="text-[var(--text-primary)] font-semibold">{currentPercent}%</span> to{" "}
                    <span className="text-[var(--text-primary)] font-semibold">{maxContribution}%</span> over
                    approximately{" "}
                    <span className="text-[var(--text-primary)] font-semibold">
                      {yearsToMax} {yearsToMax === 1 ? "year" : "years"}
                    </span>.
                  </>
                )}
              </p>
            </div>

            {/* Savings Impact */}
            {increaseAmount > 0 && financialImpact.difference > 0 && (
              <>
                <div className="border-t border-[var(--border-default)]" />
                <div className="px-5 py-4 space-y-3">
                  <p className="text-[var(--text-primary)] text-sm font-semibold">
                    Savings Impact
                  </p>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div className="bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl px-3 py-3 text-center">
                      <p
                        className="text-[var(--text-secondary)] mb-0.5 text-xs font-semibold uppercase tracking-wide"
                      >
                        Without increases
                      </p>
                      <p className="text-[var(--text-secondary)] tabular-nums text-lg font-bold">
                        {formatCurrency(financialImpact.withoutIncrease)}
                      </p>
                    </div>
                    <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_30%,var(--border-default))] rounded-xl px-3 py-3 text-center">
                      <p
                        className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-[var(--color-primary)]))] mb-0.5 text-xs font-semibold uppercase tracking-wide"
                      >
                        With increases
                      </p>
                      <p className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-[var(--color-primary)]))] tabular-nums text-lg font-bold">
                        {formatCurrency(financialImpact.withIncrease)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] rounded-xl px-3.5 py-2.5">
                    <DollarSign className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                    <p className="text-[var(--text-primary)] text-xs">
                      Automatic increases could add approximately{" "}
                      <span className="font-bold">
                        {formatCurrency(financialImpact.difference)}
                      </span>{" "}
                      more to your retirement savings compared to keeping contributions fixed.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Year-by-Year Progression Table */}
            {yearByYearData.length > 0 && (
              <>
                <div className="border-t border-[var(--border-default)]" />
                <div className="px-4 py-3">
                  <h3 className="text-[var(--text-primary)] mb-3 text-sm font-bold">
                    Growth Timeline
                  </h3>
                  
                  <div className="overflow-x-auto -mx-4">
                    <table className="w-full">
                      <thead className="border-b border-[var(--border-default)]">
                        <tr>
                          <th className="px-3 py-1.5 text-left text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide">
                            Year
                          </th>
                          <th className="px-3 py-1.5 text-left text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide">
                            Date
                          </th>
                          <th className="px-3 py-1.5 text-left text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide">
                            %
                          </th>
                          <th className="px-3 py-1.5 text-right text-[var(--text-secondary)] text-xs font-semibold uppercase tracking-wide">
                            Annual
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {yearByYearData.map((row, idx) => (
                          <tr key={idx} className={`hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-colors ${row.percent === maxContribution ? 'bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]' : ''}`}>
                            <td className="px-3 py-1.5 text-[var(--text-primary)] text-xs font-medium">
                              {row.year === 0 ? 'Now' : `Y${row.year}`}
                            </td>
                            <td className="px-3 py-1.5 text-[var(--text-secondary)] text-xs">
                              {row.date}
                            </td>
                            <td className="px-3 py-1.5">
                              <div className="flex items-center gap-1">
                                <span className="text-[var(--text-primary)] tabular-nums text-xs font-semibold">
                                  {row.percent}%
                                </span>
                                {row.percent === maxContribution && (
                                  <span className="px-1 py-0.5 bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-primary)_72%,var(--text-[var(--color-primary)]))] rounded text-xs font-semibold">
                                    MAX
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-1.5 text-right text-[var(--text-primary)] tabular-nums text-xs font-semibold">
                              ${(row.annual / 1000).toFixed(0)}K
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary */}
                  <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
                    <p className="text-[var(--text-primary)] text-xs">
                      <span className="font-semibold text-[var(--text-primary)]">Timeline:</span> {currentPercent}% → {maxContribution}% over {yearsToMax} {yearsToMax === 1 ? 'yr' : 'yrs'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA — mobile only (sticky bottom) */}
      <div className="sticky bottom-4 lg:hidden">
        <button
          onClick={handleSave}
          disabled={increaseAmount === 0}
          className={`w-full py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 transition-all  ${
            increaseAmount > 0
              ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
              : "bg-[var(--surface-section)] text-[var(--text-secondary)] cursor-not-allowed"
          }`}
        >
          Save Auto Increase <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}