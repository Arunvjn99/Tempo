// @ts-nocheck — Recharts formatter + SVG style objects; logic preserved from app utilities.
import { useNavigate } from "react-router-dom";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { Sparkles, ArrowRight, ArrowLeft, Info, Minus, Plus } from "lucide-react";
import { useState, useId } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import {
  generateContributionChartProjectionSeries,
  SAFETY_WITHDRAWAL_ANNUAL_RATE,
} from "@/utils/retirementCalculations";

const chartTooltipStyle = {
  borderRadius: 12,
  fontSize: 11,
  border: "1px solid var(--border-default)",
  backgroundColor: "var(--surface-card)",
  color: "var(--text-primary)",
  boxShadow: "var(--shadow-md)",
  fontWeight: 500,
} as const;

export function ContributionSetup() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep, personalization } = useEnrollment();
  const [compareMode, setCompareMode] = useState(false);
  const [comparePercent, setComparePercent] = useState(12);
  const [percentInput, setPercentInput] = useState(String(data.contributionPercent));
  const [dollarInput, setDollarInput] = useState(String(Math.round((data.salary * data.contributionPercent) / 100)));
  const gradientId = useId();
  const percent = data.contributionPercent;
  const salary = data.salary;

  const monthlyPaycheck = Math.round(salary / 12);
  const monthlyContribution = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);

  const projectionData = generateContributionChartProjectionSeries(percent, salary);
  const projectedTotal = projectionData[projectionData.length - 1]?.value || 0;

  const monthlyRetirementIncome = Math.round((projectedTotal * SAFETY_WITHDRAWAL_ANNUAL_RATE) / 12);

  const recommendedPercent = 12;
  const progressPercentage = Math.min((percent / recommendedPercent) * 100, 100);

  const comparisonData = generateContributionChartProjectionSeries(comparePercent, salary);
  const comparisonTotal = comparisonData[comparisonData.length - 1]?.value || 0;
  const difference = comparisonTotal - projectedTotal;

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
    const numValue = parseFloat(value.replace(/,/g, ""));
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

  const sliderTrack = `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((percent - 1) / 24) * 100}%, var(--surface-section) ${((percent - 1) / 24) * 100}%, var(--surface-section) 100%)`;

  return (
    <div className="space-y-6">
      <div>
        <button
          type="button"
          onClick={() => {
            setCurrentStep(1);
            navigate(ep("plan"));
          }}
          className="mb-3 flex items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="text-[var(--text-primary)]">Set your retirement savings</h1>
        <p className="mt-1 text-[var(--text-secondary)]" style={{ fontSize: "0.95rem" }}>
          We&apos;ll guide you to the right contribution for your future
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-lg)]">
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))_0%,color-mix(in_srgb,var(--color-primary)_6%,var(--surface-section))_100%)] p-4">
            <p
              className="text-center text-[var(--text-secondary)]"
              style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Monthly Paycheck
            </p>
            <p className="mt-1 text-center text-[var(--text-primary)]" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              ${monthlyPaycheck.toLocaleString()}
            </p>
          </div>

          <div className="text-center">
            <p
              className="mb-3 text-[var(--text-secondary)]"
              style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Your Contribution
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => adjustPercent(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))]"
                aria-label="Decrease percentage"
              >
                <Minus className="h-5 w-5 text-[var(--color-primary)]" />
              </button>
              <p
                className="text-[var(--color-primary)]"
                style={{ fontSize: "4rem", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}
              >
                {percent}%
              </p>
              <button
                type="button"
                onClick={() => adjustPercent(1)}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))]"
                aria-label="Increase percentage"
              >
                <Plus className="h-5 w-5 text-[var(--color-primary)]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-2 block text-[var(--text-secondary)]"
                style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Percentage
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  max={25}
                  step={0.5}
                  value={percentInput}
                  onChange={(e) => handlePercentInputChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] px-3 py-2.5 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{ fontSize: "0.95rem", fontWeight: 500 }}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  style={{ fontSize: "0.85rem", fontWeight: 600 }}
                >
                  %
                </span>
              </div>
            </div>
            <div>
              <label
                className="mb-2 block text-[var(--text-secondary)]"
                style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Annual $
              </label>
              <div className="relative">
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  style={{ fontSize: "0.85rem", fontWeight: 600 }}
                >
                  $
                </span>
                <input
                  type="text"
                  value={dollarInput}
                  onChange={(e) => handleDollarInputChange(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] py-2.5 pl-7 pr-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  style={{ fontSize: "0.95rem", fontWeight: 500 }}
                />
              </div>
            </div>
          </div>

          <div>
            <p
              className="mb-2 text-[var(--text-secondary)]"
              style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
            >
              Quick Select
            </p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleQuickOption(opt.value)}
                  className={`rounded-lg px-2.5 py-1.5 transition-all ${
                    percent === opt.value
                      ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                      : "bg-[var(--surface-section)] text-[var(--text-primary)] hover:scale-105 hover:bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-section))]"
                  }`}
                  style={{ fontSize: "0.75rem", fontWeight: 600 }}
                >
                  {opt.label} {opt.icon}
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
              onChange={(e) => {
                const newValue = Number(e.target.value);
                updateData({ contributionPercent: newValue });
                setPercentInput(String(newValue));
                setDollarInput(String(Math.round((salary * newValue) / 100)));
              }}
              className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
              style={{ background: sliderTrack }}
            />
            <div className="mt-2 flex justify-between text-[var(--text-secondary)]" style={{ fontSize: "0.7rem" }}>
              <span>1%</span>
              <span>25%</span>
            </div>
          </div>

          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-purple)_22%,var(--border-default))] bg-[linear-gradient(135deg,var(--color-purple-soft)_0%,color-mix(in_srgb,var(--color-purple)_8%,var(--surface-card))_100%)] p-3.5">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-purple)]" />
              <div>
                <p
                  className="text-[color-mix(in_srgb,var(--color-purple)_88%,var(--text-primary))]"
                  style={{ fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.25rem" }}
                >
                  Pro Tip
                </p>
                <p className="text-[color-mix(in_srgb,var(--color-purple)_65%,var(--text-primary))]" style={{ fontSize: "0.75rem", lineHeight: 1.5 }}>
                  Increasing just 1% could add ~${onePercentImpact.toLocaleString()} to your retirement
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-[var(--shadow-lg)]">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-[var(--text-primary)]" style={{ fontSize: "0.95rem", fontWeight: 600 }}>
                Retirement Savings Projection
              </h3>
              <p className="mt-0.5 text-[var(--text-secondary)]" style={{ fontSize: "0.75rem" }}>
                Growth over 30 years at 7% annual return
              </p>
            </div>

            <div className="text-right">
              <p className="text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]" style={{ fontSize: "0.8rem", fontWeight: 700 }}>
                {Math.round(progressPercentage)}% on track
              </p>
              <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-success)_18%,var(--surface-section))]">
                <div
                  className="h-full rounded-full bg-[var(--color-success)] transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-success)_12%,var(--surface-card))_0%,color-mix(in_srgb,var(--color-success)_6%,var(--surface-section))_100%)] p-4">
              <p
                className="text-center text-[var(--text-secondary)]"
                style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Projected at Age {personalization.retirementAge}
              </p>
              <p
                className="mt-1 text-center text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]"
                style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}
              >
                ${(projectedTotal / 1000000).toFixed(1)}M
              </p>
              <p className="mt-1.5 text-center text-[var(--color-success)]" style={{ fontSize: "0.75rem", fontWeight: 500 }}>
                ≈ ${monthlyRetirementIncome.toLocaleString()}/mo
              </p>
            </div>

            <div className="space-y-2.5 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-default))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))_0%,transparent_100%)] p-4">
              <p
                className="text-center text-[var(--text-primary)]"
                style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}
              >
                Monthly Impact
              </p>

              <div className="space-y-2">
                <div>
                  <p className="text-center text-[var(--text-secondary)]" style={{ fontSize: "0.7rem" }}>
                    You contribute
                  </p>
                  <p className="mt-0.5 text-center text-[var(--text-primary)]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    ${monthlyContribution.toLocaleString()}
                  </p>
                </div>

                <div className="rounded-lg border border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] p-2">
                  <p className="text-center text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]" style={{ fontSize: "0.7rem", fontWeight: 600 }}>
                    Employer adds
                  </p>
                  <p className="mt-0.5 text-center text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))]" style={{ fontSize: "1rem", fontWeight: 700 }}>
                    +${monthlyMatch.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-64 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-default))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))_0%,transparent_100%)] p-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id={`${gradientId}-market`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  key="grid"
                  strokeDasharray="3 3"
                  stroke="var(--border-default)"
                  opacity={0.4}
                  vertical={false}
                />
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
                  contentStyle={chartTooltipStyle}
                />
                <ReferenceLine
                  key="refline"
                  y={projectedTotal * 0.75}
                  stroke="var(--color-success)"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: "Target Goal",
                    position: "insideTopRight",
                    fill: "var(--color-success)",
                    fontSize: 10,
                    fontWeight: 600,
                  }}
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
                  stroke="var(--color-success)"
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

          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[var(--color-primary)]" />
              <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.7rem" }}>
                Total Savings
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[var(--color-success)]" />
              <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.7rem" }}>
                Market Gains
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div
                className="h-0.5 w-3 bg-[color-mix(in_srgb,var(--text-secondary)_50%,transparent)]"
                style={{ borderTop: "2px dashed var(--text-secondary)" }}
              />
              <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.7rem" }}>
                Your Contributions
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" />
            <p className="text-[var(--text-secondary)]" style={{ fontSize: "0.7rem", lineHeight: 1.5 }}>
              Projection assumes 7% annual return. Actual results may vary. Monthly income uses 4% withdrawal rule.
            </p>
          </div>

          <div className="space-y-3 rounded-xl border border-[color-mix(in_srgb,var(--border-default)_65%,var(--surface-section))] bg-[color-mix(in_srgb,var(--surface-section)_65%,var(--surface-card))] p-4">
            <div className="flex items-center justify-between">
              <p className="text-[var(--text-primary)]" style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Compare Scenarios
              </p>
              <button
                type="button"
                onClick={() => setCompareMode(!compareMode)}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  compareMode
                    ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                    : "border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-section)]"
                }`}
                style={{ fontSize: "0.7rem", fontWeight: 600 }}
              >
                {compareMode ? "Hide" : "Show"}
              </button>
            </div>

            {compareMode && (
              <div className="space-y-3 border-t border-[color-mix(in_srgb,var(--border-default)_65%,var(--surface-section))] pt-2">
                <div className="flex gap-2">
                  {[10, 12, 15].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setComparePercent(val)}
                      className={`flex-1 rounded-lg px-3 py-2 transition-all ${
                        comparePercent === val
                          ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                          : "border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-primary)] hover:bg-[var(--surface-section)]"
                      }`}
                      style={{ fontSize: "0.8rem", fontWeight: 600 }}
                    >
                      {val}%
                    </button>
                  ))}
                </div>

                <div
                  className={`rounded-lg border p-3 ${
                    difference < 0
                      ? "border-[color-mix(in_srgb,var(--danger)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--danger)_10%,var(--surface-card))]"
                      : "border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]"
                  }`}
                >
                  <p
                    className={
                      difference < 0
                        ? "text-[color-mix(in_srgb,var(--danger)_85%,var(--text-primary))]"
                        : "text-[color-mix(in_srgb,var(--color-success)_75%,var(--text-primary))]"
                    }
                    style={{ fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    {difference >= 0 ? "+" : ""}${Math.abs(difference).toLocaleString()}
                  </p>
                  <p
                    className={difference < 0 ? "text-[var(--danger)]" : "text-[var(--color-success)]"}
                    style={{ fontSize: "0.7rem" }}
                  >
                    {difference >= 0 ? "more" : "less"} with {comparePercent}% vs {percent}%
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-4 space-y-3 md:static">
        <button
          type="button"
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-4 text-[var(--primary-foreground)] shadow-[var(--shadow-lg)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98] md:shadow-[var(--shadow-md)]"
          style={{ fontSize: "1.05rem", fontWeight: 600 }}
        >
          Save & Continue <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-center text-[var(--text-secondary)]" style={{ fontSize: "0.85rem" }}>
          You can adjust anytime
        </p>
      </div>
    </div>
  );
}
