// @ts-nocheck — verbatim Figma Make export (unused locals preserved).
import { useNavigate } from "react-router-dom";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import { ArrowRight, ArrowLeft, Lightbulb, Wallet, Sparkles, TrendingUp, Shield, DollarSign, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function ContributionSource() {
  const navigate = useNavigate();
  const { data, updateData, setCurrentStep } = useEnrollment();

  // State for showing advanced options
  const [showAdvanced, setShowAdvanced] = useState(data.contributionSources.afterTax > 0);

  const sources = data.contributionSources;
  const salary = data.salary;
  const percent = data.contributionPercent;
  const monthlyTotal = Math.round((salary * percent) / 100 / 12);
  const matchPercent = Math.min(percent, 6);
  const monthlyMatch = Math.round((salary * matchPercent) / 100 / 12);

  const monthlyPreTax = Math.round(monthlyTotal * sources.preTax / 100);
  const monthlyRoth = Math.round(monthlyTotal * sources.roth / 100);
  const monthlyAfterTax = Math.round(monthlyTotal * sources.afterTax / 100);
  const totalMonthlyInvestment = monthlyTotal + monthlyMatch;

  // Plan defaults (60% Pre-Tax, 40% Roth, 0% After-Tax)
  const planDefault = { preTax: 60, roth: 40, afterTax: 0 };
  const planDefaultPreTax = Math.round(monthlyTotal * planDefault.preTax / 100);
  const planDefaultRoth = Math.round(monthlyTotal * planDefault.roth / 100);

  // Recommended allocation (40% Pre-Tax, 60% Roth, 0% After-Tax)
  const recommended = { preTax: 40, roth: 60, afterTax: 0 };

  // Dynamic feedback based on allocation
  const getDynamicFeedback = () => {
    if (sources.roth > sources.preTax) {
      return "More tax-free income in retirement";
    } else if (sources.preTax > sources.roth) {
      return "Lower taxes today";
    }
    return "Balanced tax strategy";
  };

  // Handle individual slider changes with normalization to ensure total = 100%
  const handlePreTaxChange = (value: number) => {
    const newPreTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newPreTax;
    
    // Proportionally distribute remaining between Roth and AfterTax
    const currentRothAfterTaxTotal = sources.roth + sources.afterTax;
    if (currentRothAfterTaxTotal > 0) {
      const rothRatio = sources.roth / currentRothAfterTaxTotal;
      updateData({
        contributionSources: {
          preTax: newPreTax,
          roth: Math.round(remaining * rothRatio),
          afterTax: Math.round(remaining * (1 - rothRatio)),
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: newPreTax,
          roth: remaining,
          afterTax: 0,
        },
      });
    }
  };

  const handleRothChange = (value: number) => {
    const newRoth = Math.min(100, Math.max(0, value));
    const remaining = 100 - newRoth;
    
    // Proportionally distribute remaining between PreTax and AfterTax
    const currentPreTaxAfterTaxTotal = sources.preTax + sources.afterTax;
    if (currentPreTaxAfterTaxTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxAfterTaxTotal;
      updateData({
        contributionSources: {
          preTax: Math.round(remaining * preTaxRatio),
          roth: newRoth,
          afterTax: Math.round(remaining * (1 - preTaxRatio)),
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: remaining,
          roth: newRoth,
          afterTax: 0,
        },
      });
    }
  };

  const handleAfterTaxChange = (value: number) => {
    const newAfterTax = Math.min(100, Math.max(0, value));
    const remaining = 100 - newAfterTax;
    
    // Proportionally distribute remaining between PreTax and Roth
    const currentPreTaxRothTotal = sources.preTax + sources.roth;
    if (currentPreTaxRothTotal > 0) {
      const preTaxRatio = sources.preTax / currentPreTaxRothTotal;
      updateData({
        contributionSources: {
          preTax: Math.round(remaining * preTaxRatio),
          roth: Math.round(remaining * (1 - preTaxRatio)),
          afterTax: newAfterTax,
        },
      });
    } else {
      updateData({
        contributionSources: {
          preTax: remaining,
          roth: 0,
          afterTax: newAfterTax,
        },
      });
    }
  };

  const applyRecommendation = () => {
    updateData({
      contributionSources: {
        preTax: recommended.preTax,
        roth: recommended.roth,
        afterTax: recommended.afterTax,
      },
    });
  };

  const applyDefaultAllocation = () => {
    updateData({
      contributionSources: {
        preTax: planDefault.preTax,
        roth: planDefault.roth,
        afterTax: planDefault.afterTax,
      },
    });
    handleNext();
  };

  const handleNext = () => {
    setCurrentStep(4);
    navigate(ep("auto-increase"));
  };

  // Calculate total to show error if doesn't equal 100%
  const total = sources.preTax + sources.roth + sources.afterTax;

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => {
            setCurrentStep(2);
            navigate(ep("contribution"));
          }}
          className="mb-3 flex items-center gap-1 text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          style={{ fontSize: "0.85rem" }}
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-[var(--text-primary)]" style={{ fontSize: "2rem", fontWeight: 700 }}>
              How do you want to pay taxes?
            </h1>
            <p className="mt-2 text-[var(--text-secondary)]" style={{ fontSize: "1rem", lineHeight: 1.6 }}>
              Choose when you want to pay taxes on your savings.
            </p>
          </div>
          <div className="inline-flex shrink-0 items-center gap-3 rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))_0%,color-mix(in_srgb,var(--color-primary)_6%,var(--surface-section))_100%)] px-5 py-3">
            <Wallet className="h-5 w-5 text-[var(--color-primary)]" />
            <p className="text-[var(--text-primary)]" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
              You&apos;re contributing {percent}% (${monthlyTotal.toLocaleString()}/month)
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-5" style={{ gridTemplateColumns: "35% 65%" }}>
        {/* LEFT: Plan Default Card - 35% (reduced emphasis) */}
        <div className="card-standard flex flex-col space-y-4 p-5 opacity-90">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-md border border-[var(--border-default)] bg-[var(--surface-section)] px-2.5 py-1">
                <p className="text-[var(--text-secondary)] text-xs font-bold uppercase tracking-wide">
                  Default
                </p>
              </div>
            </div>
            <h3 className="text-[var(--text-primary)] text-base font-bold">
              Plan Default
            </h3>
            <p className="text-[var(--text-secondary)] mt-1 text-xs">
              Applied if no changes are made
            </p>
          </div>

          {/* Gradient Bar */}
          <div>
            <div className="h-2.5 rounded-full overflow-hidden flex">
              {planDefault.preTax > 0 && (
                <div 
                  className="bg-[var(--color-primary)]"
                  style={{ width: `${planDefault.preTax}%` }}
                />
              )}
              {planDefault.roth > 0 && (
                <div 
                  className="bg-[var(--color-purple)]"
                  style={{ width: `${planDefault.roth}%` }}
                />
              )}
            </div>
          </div>

          {/* Allocation Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Pre-Tax ({planDefault.preTax}%)
                </p>
              </div>
              <p className="text-[var(--text-primary)] text-sm font-semibold">
                ${planDefaultPreTax.toLocaleString()}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Roth ({planDefault.roth}%)
                </p>
              </div>
              <p className="text-[var(--text-primary)] text-sm font-semibold">
                ${planDefaultRoth.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Helper Text */}
          <div className="pt-3 border-t border-[var(--border-default)] flex-1 flex items-end">
            <p className="text-[var(--text-secondary)] text-center w-full text-xs leading-normal">
              Your employer's default allocation balances tax benefits.
            </p>
          </div>

          {/* Apply Button - Tertiary style */}
          <button
            onClick={() => {
              updateData({
                contributionSources: {
                  preTax: planDefault.preTax,
                  roth: planDefault.roth,
                  afterTax: planDefault.afterTax,
                },
              });
              handleNext();
            }}
            className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)]  transition-all hover:bg-[var(--color-primary-hover)]"
          >
            Continue with Plan Default 
          </button>
        </div>

        {/* RIGHT: Your Tax Strategy Card - 65% */}
        <div className="card-standard border-2 border-[color-mix(in_srgb,var(--color-primary)_15%,var(--border-default))] p-6 flex gap-6">
          {/* Left Section - 70% */}
          <div className="flex-1 space-y-4 flex flex-col" style={{ width: "70%" }}>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-[var(--text-primary)] text-lg font-bold">
                  Your Tax Strategy
                </h3>
                <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                  Total allocation: 100%
                </p>
              </div>
              <div className="px-3 py-1.5 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] rounded-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                <p className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-wide">
                  Recommended
                </p>
              </div>
            </div>

            {/* Visual Allocation Bar */}
            <div className="space-y-2">
              <div className="h-4 rounded-full overflow-hidden flex  border border-[var(--border-default)]">
                {sources.preTax > 0 && (
                  <div 
                    className="bg-[var(--color-primary)] transition-all duration-300"
                    style={{ width: `${sources.preTax}%` }}
                  />
                )}
                {sources.roth > 0 && (
                  <div 
                    className="bg-[var(--color-purple)] transition-all duration-300"
                    style={{ width: `${sources.roth}%` }}
                  />
                )}
                {sources.afterTax > 0 && (
                  <div 
                    className="bg-[var(--color-warning)] transition-all duration-300"
                    style={{ width: `${sources.afterTax}%` }}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                  <span className="text-[var(--text-secondary)]">{sources.preTax}% Pre-Tax</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-purple)]" />
                  <span className="text-[var(--text-secondary)]">{sources.roth}% Roth</span>
                </div>
                {sources.afterTax > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                    <span className="text-[var(--text-secondary)]">{sources.afterTax}% After-Tax</span>
                  </div>
                )}
              </div>
            </div>

            {/* Individual Sliders */}
            <div className="space-y-4">
              {/* Pre-Tax Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                      <p className="text-[var(--text-primary)] text-sm font-semibold">
                        Pre-Tax
                      </p>
                    </div>
                    <p className="text-[var(--text-secondary)] ml-5 text-xs leading-snug">
                      Lower taxes today
                    </p>
                  </div>
                  <p className="text-[var(--color-primary)] text-xl font-extrabold leading-none">
                    {sources.preTax}%
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sources.preTax}
                  onChange={(e) => handlePreTaxChange(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
                  style={{
                    background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${sources.preTax}%, var(--surface-section) ${sources.preTax}%, var(--surface-section) 100%)`,
                  }}
                />
                <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
                  <span>0%</span>
                  <span className="text-[var(--text-primary)] font-semibold">${monthlyPreTax.toLocaleString()}/mo</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Roth Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-purple)]" />
                      <p className="text-[var(--text-primary)] text-sm font-semibold">
                        Roth
                      </p>
                    </div>
                    <p className="text-[var(--text-secondary)] ml-5 text-xs leading-snug">
                      Tax-free withdrawals later
                    </p>
                  </div>
                  <p className="text-[var(--color-purple)] text-xl font-extrabold leading-none">
                    {sources.roth}%
                  </p>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={sources.roth}
                  onChange={(e) => handleRothChange(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-purple)]"
                  style={{
                    background: `linear-gradient(to right, var(--color-purple) 0%, var(--color-purple) ${sources.roth}%, var(--surface-section) ${sources.roth}%, var(--surface-section) 100%)`,
                  }}
                />
                <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
                  <span>0%</span>
                  <span className="text-[var(--text-primary)] font-semibold">${monthlyRoth.toLocaleString()}/mo</span>
                  <span>100%</span>
                </div>
              </div>

              {/* After-Tax Slider (Progressive Disclosure) */}
              {showAdvanced && (
                <div className="space-y-2 border-t border-[var(--border-default)] pt-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="px-2 py-0.5 bg-[var(--surface-section)] border border-[var(--border-default)] rounded">
                      <p className="text-[color:var(--color-primary)] text-xs font-bold uppercase">
                        Advanced
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-[var(--color-warning)]" />
                          <p className="text-[var(--text-primary)] text-sm font-semibold">
                            After-Tax
                          </p>
                        </div>
                        <p className="text-[var(--text-secondary)] ml-5 text-xs leading-snug">
                          For advanced strategies (e.g., backdoor Roth)
                        </p>
                      </div>
                      <p className="text-[var(--color-warning)] text-xl font-extrabold leading-none">
                        {sources.afterTax}%
                      </p>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={sources.afterTax}
                      onChange={(e) => handleAfterTaxChange(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-warning)]"
                      style={{
                        background: `linear-gradient(to right, var(--color-warning) 0%, var(--color-warning) ${sources.afterTax}%, var(--surface-section) ${sources.afterTax}%, var(--surface-section) 100%)`,
                      }}
                    />
                    <div className="flex items-center justify-between text-[var(--text-secondary)] text-xs">
                      <span>0%</span>
                      <span className="text-[var(--text-primary)] font-semibold">${monthlyAfterTax.toLocaleString()}/mo</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Show/Hide Advanced Options */}
            {!showAdvanced && (
              <button
                onClick={() => setShowAdvanced(true)}
                className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors self-start text-xs font-medium"
              >
                <ChevronDown className="w-4 h-4" />
                Show advanced options
              </button>
            )}
            {showAdvanced && (
              <button
                onClick={() => {
                  setShowAdvanced(false);
                  // Reset after-tax to 0 when hiding
                  if (sources.afterTax > 0) {
                    updateData({
                      contributionSources: {
                        preTax: sources.preTax + sources.afterTax,
                        roth: sources.roth,
                        afterTax: 0,
                      },
                    });
                  }
                }}
                className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors self-start text-xs font-medium"
              >
                <ChevronUp className="w-4 h-4" />
                Hide advanced options
              </button>
            )}

            {/* Merged Recommendation Card - Score + Recommendation */}
            <div className="rounded-xl border-2 border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                  <p className="text-[var(--text-primary)] text-sm font-bold">
                    Recommended for You
                  </p>
                </div>
                <div className="rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-section))] px-2 py-1">
                  <p className="text-xs font-extrabold text-[var(--color-primary)]">
                    Score: 72
                  </p>
                </div>
              </div>
              <p className="text-[var(--text-primary)] mb-2.5 text-xs leading-normal">
                {recommended.preTax}% Pre-Tax / {recommended.roth}% Roth — optimized for your profile
              </p>
            </div>

            {/* Smart Insight - Shortened */}
            <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] rounded-xl p-3">
              <div className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-[var(--text-primary)] text-xs font-semibold leading-normal">
                    Roth may be better — tax-free income later
                  </p>
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={total !== 100}
                className="w-full mt-3 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-2 px-4 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-card)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue with Custom Allocation
              </button>
            </div>
          </div>

          {/* Right Section - 30% - Restructured Monthly Impact */}
          <div className="border-l border-[var(--border-default)] pl-5 flex flex-col justify-between" style={{ width: "30%" }}>
            <div className="space-y-4">
              <div>
                <h4 className="text-[var(--text-primary)] mb-1 text-xs font-bold uppercase tracking-wide">
                  Your monthly impact
                </h4>
              </div>

              {/* Grouped Contribution */}
              <div>
                <p className="text-[var(--text-secondary)] mb-2 text-xs">
                  You contribute:
                </p>
                <p className="text-[var(--text-primary)] mb-3 text-xl font-extrabold">
                  ${monthlyTotal.toLocaleString()}
                </p>
                
                {/* Breakdown */}
                <div className="space-y-1.5 pl-3 border-l-2 border-[var(--border-default)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                      <p className="text-[var(--text-secondary)] text-xs">
                        Pre-Tax
                      </p>
                    </div>
                    <p className="text-[var(--text-primary)] text-xs font-semibold">
                      ${monthlyPreTax.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-purple)]" />
                      <p className="text-[var(--text-secondary)] text-xs">
                        Roth
                      </p>
                    </div>
                    <p className="text-[var(--text-primary)] text-xs font-semibold">
                      ${monthlyRoth.toLocaleString()}
                    </p>
                  </div>

                  {monthlyAfterTax > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-[var(--color-warning)]" />
                        <p className="text-[var(--text-secondary)] text-xs">
                          After-Tax
                        </p>
                      </div>
                      <p className="text-[var(--text-primary)] text-xs font-semibold">
                        ${monthlyAfterTax.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Employer Match - Highlighted */}
              <div className="rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_25%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-section))] p-3">
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                  Employer match
                </p>
                <p className="text-lg font-extrabold text-[var(--color-primary)]">
                  +${monthlyMatch.toLocaleString()}/month
                </p>
                <p className="mt-1 text-xs text-[var(--color-primary)]">
                  100% on first {matchPercent}%
                </p>
              </div>

              {/* Total Investment */}
              <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-3">
                <p className="text-[var(--text-secondary)] mb-1 text-xs font-semibold">
                  Total investment
                </p>
                <p className="text-[var(--text-primary)] text-2xl font-extrabold">
                  ${totalMonthlyInvestment.toLocaleString()}
                </p>
                <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
                  per month
                </p>
              </div>
            </div>

            {/* Continue with Custom Allocation Button */}
            <button
              onClick={handleNext}
              disabled={total !== 100}
              className="rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] py-2 px-4 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-card)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continue with Custom Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Understanding the Difference Section - Lighter weight */}
      <div className="space-y-3 opacity-90">
        <h2 className="text-[var(--text-primary)] text-xl font-bold">
          Understanding the Difference
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Pre-Tax Card */}
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]">
                <TrendingUp className="h-4 w-4 text-[var(--primary-foreground)]" />
              </div>
              <h3 className="text-[var(--text-primary)] text-base font-bold">
                Pre-Tax
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <p className="text-[var(--text-primary)] text-xs">
                  Lower taxes today
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <p className="text-[var(--text-primary)] text-xs">
                  Reduces current taxable income
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-[var(--color-primary)] mt-0.5 shrink-0" />
                <p className="text-[var(--text-primary)] text-xs">
                  Pay taxes when you withdraw
                </p>
              </div>
            </div>
          </div>

          {/* Roth Card */}
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-purple)_22%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-purple)_10%,var(--surface-card))] p-4">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-purple)]">
                <Shield className="h-4 w-4 text-[var(--primary-foreground)]" />
              </div>
              <h3 className="text-[var(--text-primary)] text-base font-bold">
                Roth
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-purple)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Tax-free withdrawals later
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-purple)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Pay taxes now at current rate
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-purple)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Growth is tax-free
                </p>
              </div>
            </div>
          </div>

          {/* After-Tax Card */}
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))] p-4 md:col-span-2 lg:col-span-1">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-warning)]">
                <DollarSign className="h-4 w-4 text-[var(--primary-foreground)]" />
              </div>
              <h3 className="text-[var(--text-primary)] text-base font-bold">
                After-Tax
              </h3>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-warning)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  For high earners
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-warning)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Mega backdoor Roth option
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-warning)]" />
                <p className="text-[var(--text-primary)] text-xs">
                  Advanced tax strategy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}