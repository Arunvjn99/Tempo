// @ts-nocheck — verbatim Figma Make export (unused locals + Recharts formatter types preserved).
import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { Sparkles, ArrowRight, ArrowLeft, Info, Minus, Plus, TrendingUp } from "lucide-react";
import { useState, useId } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from "recharts";
import {
  SAFETY_WITHDRAWAL_ANNUAL_RATE,
  generateContributionChartProjectionSeries,
  monthlyTakeHomeImpactFromPreTaxContribution,
} from "@/utils/retirementCalculations";

export function ContributionSetup() {
  const navigate = useEnrollmentFlowNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();
  const [compareMode, setCompareMode] = useState(false);
  const [comparePercent, setComparePercent] = useState(12);
  const [percentInput, setPercentInput] = useState(String(data.contributionPercent));
  const [dollarInput, setDollarInput] = useState(String(Math.round((data.salary * data.contributionPercent) / 100)));
  const gradientId = useId();
  const percent = data.contributionPercent;
  const salary = data.salary;
  
  // Calculate monthly values
  const monthlyPaycheck = Math.round(salary / 12);
  const monthlyContribution = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);
  
  // Calculate take-home impact (rough estimate: 22% tax rate)
  const monthlyTakeHomeImpact = monthlyTakeHomeImpactFromPreTaxContribution(monthlyContribution);
  
  // Projection calculations
  const projectionData = generateContributionChartProjectionSeries(percent, salary);
  const projectedTotal = projectionData[projectionData.length - 1]?.value || 0;
  
  // Monthly retirement income estimate (4% withdrawal rule)
  const monthlyRetirementIncome = Math.round((projectedTotal * SAFETY_WITHDRAWAL_ANNUAL_RATE) / 12);
  
  // Progress indicator (based on recommended 12%)
  const recommendedPercent = 12;
  const progressPercentage = Math.min((percent / recommendedPercent) * 100, 100);
  
  // Income replacement percentage (rough estimate)
  const incomeReplacementPercent = Math.min(Math.round((monthlyRetirementIncome / (salary / 12)) * 100), 100);
  
  // Comparison data
  const comparisonData = generateContributionChartProjectionSeries(comparePercent, salary);
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value || 0;
  const difference = comparisonTotal - projectedTotal;
  
  // Microcopy calculation (1% increase impact)
  const onePercentIncrease = generateContributionChartProjectionSeries(percent + 1, salary);
  const onePercentImpact = (onePercentIncrease[onePercentIncrease.length - 1]?.value || 0) - projectedTotal;

  const quickOptions = [
    { label: "4% Start", value: 4, icon: null },
    { label: "6% Employer match", value: 6, icon: "✅" },
    { label: "10% Strong start", value: 10, icon: null },
    { label: "15% Fast track", value: 15, icon: "🚀" },
  ];

  const handleNext = () => {
    setCurrentStep(3);
    navigate(ep("contribution-source"));
  };
  
  const adjustPercent = (delta: number) => {
    const newValue = Math.max(1, Math.min(25, percent + delta));
    updateData({ contributionPercent: newValue });
    setPercentInput(String(newValue));
    setDollarInput(String(Math.round((salary * newValue) / 100)));
  };
  
  const handlePercentInputChange = (value: string) => {
    setPercentInput(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 25) {
      updateData({ contributionPercent: Math.round(numValue) });
      setDollarInput(String(Math.round((salary * numValue) / 100)));
    }
  };
  
  const handleDollarInputChange = (value: string) => {
    setDollarInput(value);
    const numValue = parseFloat(value.replace(/,/g, ''));
    if (!isNaN(numValue)) {
      const calculatedPercent = Math.round((numValue / salary) * 100);
      if (calculatedPercent >= 1 && calculatedPercent <= 25) {
        updateData({ contributionPercent: calculatedPercent });
        setPercentInput(String(calculatedPercent));
      }
    }
  };
  
  const handleQuickOption = (value: number) => {
    updateData({ contributionPercent: value });
    setPercentInput(String(value));
    setDollarInput(String(Math.round((salary * value) / 100)));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button 
          onClick={() => { setCurrentStep(1); navigate(ep("plan")); }} 
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] transition-colors text-sm" 
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Set your retirement savings</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-base">
          We'll guide you to the right contribution for your future
        </p>
      </div>

      {/* Recommendation Banner */}
      

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* ─── LEFT CARD: Contribution Selector ─── */}
        <div className="card-standard space-y-6 p-6">
          {/* Monthly Paycheck Display */}
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_15%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_7%,var(--surface-card))] p-4">
            <p className="text-[var(--text-secondary)] text-center text-xs font-semibold uppercase tracking-wide">
              Monthly Paycheck
            </p>
            <p className="text-[var(--text-primary)] text-center mt-1 text-2xl font-bold">
              ${monthlyPaycheck.toLocaleString()}
            </p>
          </div>
          
          {/* Large percentage display with +/- buttons */}
          <div className="text-center">
            <p className="text-[var(--text-secondary)] mb-3 text-xs font-semibold uppercase tracking-wide">
              Your Contribution
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => adjustPercent(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))]"
                aria-label="Decrease percentage"
              >
                <Minus className="h-5 w-5 text-[var(--color-primary)]" />
              </button>
              <p className="text-6xl font-extrabold leading-none tracking-tight text-[var(--color-primary)]">
                {percent}%
              </p>
              <button
                onClick={() => adjustPercent(1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))]"
                aria-label="Increase percentage"
              >
                <Plus className="h-5 w-5 text-[var(--color-primary)]" />
              </button>
            </div>
          </div>
          
          {/* Text Input Fields */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[var(--text-secondary)] block mb-2 text-xs font-semibold uppercase tracking-wide">
                Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="25"
                  step="0.5"
                  value={percentInput}
                  onChange={(e) => handlePercentInputChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-2.5 text-base font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm font-semibold">
                  %
                </span>
              </div>
            </div>
            <div>
              <label className="text-[var(--text-secondary)] block mb-2 text-xs font-semibold uppercase tracking-wide">
                Annual $
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm font-semibold">
                  $
                </span>
                <input
                  type="text"
                  value={dollarInput}
                  onChange={(e) => handleDollarInputChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-2.5 pl-7 pr-3 text-base font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                />
              </div>
            </div>
          </div>

          {/* Quick Select - moved up */}
          <div>
            <p className="text-[var(--text-secondary)] mb-2 text-xs font-semibold uppercase tracking-wide">
              Quick Select
            </p>
            <div className="flex gap-2 flex-wrap">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleQuickOption(opt.value)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                    percent === opt.value
                      ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
                      : "bg-[var(--surface-section)] border border-[var(--border-default)] text-[var(--text-primary)] hover:scale-105 hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
                  }`}
                >
                  {opt.label} {opt.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Slider */}
          <div className="px-1">
            <input
              type="range"
              min={1}
              max={25}
              value={percent}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                updateData({ contributionPercent: newValue });
                setPercentInput(String(newValue));
                setDollarInput(String(Math.round((salary * newValue) / 100)));
              }}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((percent - 1) / 24) * 100}%, var(--surface-section) ${((percent - 1) / 24) * 100}%, var(--surface-section) 100%)`,
              }}
            />
            <div className="flex justify-between text-[var(--text-secondary)] mt-2 text-xs">
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Pro Tip - moved here */}
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_15%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--surface-card))] p-3.5">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
              <div>
                <p className="mb-1 text-xs font-bold text-[var(--text-primary)]">
                  Pro Tip
                </p>
                <p className="text-xs leading-normal text-[var(--text-secondary)]">
                  Increasing just 1% could add ~${onePercentImpact.toLocaleString()} to your retirement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT CARD: Projection & Chart ─── */}
        <div className="card-standard space-y-5 p-6">
          {/* Header with Progress */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[var(--text-primary)] text-base font-semibold">
                Retirement Savings Projection
              </h3>
              <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                Growth over 30 years at 7% annual return
              </p>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right">
              <p className="text-xs font-bold text-[var(--color-primary)]">
                {Math.round(progressPercentage)}% on track
              </p>
              <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-section))]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Two column: Projected Total + Monthly Impact */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Projected Total Banner */}
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))] p-4">
              <p className="text-[var(--text-secondary)] text-center text-xs font-semibold uppercase tracking-wide">
                Projected at Age {personalization.retirementAge}
              </p>
              <p className="mt-1 text-center text-3xl font-extrabold leading-none text-[var(--color-primary)]">
                ${(projectedTotal / 1000000).toFixed(1)}M
              </p>
              <p className="mt-1.5 text-center text-xs font-medium text-[var(--color-primary)]">
                ≈ ${monthlyRetirementIncome.toLocaleString()}/mo
              </p>
            </div>

            {/* Monthly Impact - moved here */}
            <div className="space-y-2.5 rounded-xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--color-primary)_6%,var(--surface-card))] p-4">
              <p className="text-[var(--text-primary)] text-center text-xs font-bold uppercase tracking-wide">
                Monthly Impact
              </p>
              
              <div className="space-y-2">
                {/* You contribute */}
                <div>
                  <p className="text-[var(--text-secondary)] text-center text-xs">
                    You contribute
                  </p>
                  <p className="text-[var(--text-primary)] text-center mt-0.5 text-base font-bold">
                    ${monthlyContribution.toLocaleString()}
                  </p>
                </div>
                
                {/* Employer adds */}
                <div className="rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-section))] p-2">
                  <p className="text-center text-xs font-semibold text-[var(--color-primary)]">
                    Employer adds
                  </p>
                  <p className="mt-0.5 text-center text-base font-bold text-[var(--color-primary)]">
                    +${monthlyMatch.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart */}
          <div className="h-64 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id={`${gradientId}-market`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="var(--border-default)" opacity={0.45} vertical={false} />
                <XAxis 
                  key="xaxis"
                  dataKey="year" 
                  tick={{ fontSize: 10, fill: "var(--text-secondary)", fontWeight: 500 }} 
                  tickLine={false} 
                  axisLine={{ stroke: "var(--border-default)" }}
                  interval={4}
                  dy={5}
                />
                <YAxis 
                  key="yaxis"
                  tick={{ fontSize: 10, fill: "var(--text-secondary)", fontWeight: 500 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                  dx={-5}
                />
                <Tooltip
                  key="tooltip"
                  formatter={(val: number | undefined, name: string) => {
                    const v = val ?? 0;
                    if (name === "value") return [`$${v.toLocaleString()}`, "Total Savings"];
                    if (name === "contributions") return [`$${v.toLocaleString()}`, "Your Contributions"];
                    if (name === "marketGain") return [`$${v.toLocaleString()}`, "Market Gains"];
                    return [v, name];
                  }}
                  contentStyle={{ 
                    borderRadius: 12, 
                    fontSize: 12, 
                    border: "1px solid var(--border-default)",
                    backgroundColor: "var(--surface-card)",
                    color: "var(--text-primary)",
                    boxShadow: "none",
                    fontWeight: 500
                  }}
                />
                <ReferenceLine 
                  key="refline"
                  y={projectedTotal * 0.75} 
                  stroke="var(--color-primary)" 
                  strokeDasharray="5 5" 
                  strokeWidth={2}
                  label={{ value: 'Target Goal', position: 'insideTopRight', fill: "var(--color-primary)", fontSize: 10, fontWeight: 600 }}
                />
                <Area 
                  key="area-contributions"
                  type="monotone" 
                  dataKey="contributions" 
                  stroke="var(--text-secondary)" 
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Area 
                  key="area-market"
                  type="monotone" 
                  dataKey="marketGain" 
                  stroke="var(--color-primary)" 
                  fill={`url(#${gradientId}-market)`}
                  strokeWidth={2}
                  stackId="1"
                />
                <Area 
                  key="area-total"
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--color-primary)" 
                  fill={`url(#${gradientId})`} 
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[var(--color-primary)]"></div>
              <p className="text-[var(--text-secondary)] text-xs">Total Savings</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[var(--color-success)]"></div>
              <p className="text-[var(--text-secondary)] text-xs">Market Gains</p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-0.5 w-3 bg-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]" style={{ borderTop: "2px dashed var(--text-secondary)" }}></div>
              <p className="text-[var(--text-secondary)] text-xs">Your Contributions</p>
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="flex items-start gap-2">
            <Info className="w-3.5 h-3.5 text-[var(--text-secondary)] mt-0.5 shrink-0" />
            <p className="text-[var(--text-secondary)] text-xs leading-normal">
              Projection assumes 7% annual return. Actual results may vary. Monthly income uses 4% withdrawal rule.
            </p>
          </div>

          {/* Comparison Toggle */}
          <div className="space-y-3 rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[var(--text-primary)] text-xs font-bold uppercase tracking-wide">
                Compare Scenarios
              </p>
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  compareMode 
                    ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] " 
                    : "bg-[var(--surface-section)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
                }`}
              >
                {compareMode ? "Hide" : "Show"}
              </button>
            </div>
            
            {compareMode && (
              <div className="space-y-3 pt-2 border-t border-[var(--border-default)]/50">
                <div className="flex gap-2">
                  {[10, 12, 15].map((val) => (
                    <button
                      key={val}
                      onClick={() => setComparePercent(val)}
                      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                        comparePercent === val
                          ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
                          : "bg-[var(--surface-section)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                
                <div
                  className={`rounded-lg border p-3 ${
                    difference < 0
                      ? "border-[color-mix(in_srgb,var(--text-secondary)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--text-secondary)_12%,var(--surface-card))]"
                      : "border-[color-mix(in_srgb,var(--color-primary)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
                  }`}
                >
                  <p className={difference < 0 ? 'text-sm font-bold text-[var(--text-primary)]' : 'text-sm font-bold text-[var(--color-primary)]'}>
                    {difference >= 0 ? '+' : ''}${Math.abs(difference).toLocaleString()}
                  </p>
                  <p className={difference < 0 ? 'text-xs text-[var(--text-primary)]' : 'text-xs text-[var(--color-primary)]'}>
                    {difference >= 0 ? 'more' : 'less'} with {comparePercent}% vs {percent}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="sticky bottom-4 md:static space-y-3">
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-4 text-base font-semibold text-[var(--primary-foreground)]  transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98] "
        >
          Save & Continue <ArrowRight className="w-5 h-5" />
        </button>
        <p className="text-center text-[var(--text-secondary)] text-sm">
          You can adjust anytime
        </p>
      </div>
    </div>
  );
}
