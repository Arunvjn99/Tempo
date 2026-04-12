// @ts-nocheck — verbatim Figma Make export (unused locals preserved).
import { useNavigate } from "react-router-dom";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  DollarSign,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  TrendingUp,
  X,
  Percent,
  ChevronRight,
  Award,
  AlertTriangle,
  Info,
  Clock,
  Target,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import type { RiskLevel } from "@/features/enrollment/store/types";
import {
  RETIREMENT_INCOME_TARGET_RATIO,
  getGrowthRate,
  projectBalanceConstantAnnualContributions,
} from "@/utils/retirementCalculations";

/* ─── Types ─── */

interface Suggestion {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  scoreIncrease: number;
  newScore: number;
  additionalAnnualSavings: number;
  projectedBalance: number;
  currentLabel: string;
  currentValue: string;
  newLabel: string;
  newValue: string;
  apply: () => void;
}

/* ─── Animated Counter ─── */

function AnimatedScore({
  value,
  color,
  circumference,
}: {
  value: number;
  color: string;
  circumference: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [animating, setAnimating] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setAnimating(true);
      const start = prevValue.current;
      const diff = value - start;
      const duration = 800;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(start + diff * eased));
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimating(false);
        }
      };
      requestAnimationFrame(animate);
      prevValue.current = value;
    }
  }, [value]);

  const strokeDashoffset = circumference - (displayValue / 100) * circumference;

  return (
    <div className="relative w-48 h-48">
      <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border-default)" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: animating ? "none" : "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-[var(--text-primary)] tabular-nums text-5xl font-bold"
        >
          {displayValue}
        </span>
        <span className="text-[var(--text-secondary)] text-xs">
          out of 100
        </span>
      </div>
    </div>
  );
}

/* ─── Confirmation Modal ─── */

function ConfirmationModal({
  isOpen,
  suggestion,
  currentScore,
  currentBalance,
  formatCurrency,
  onCancel,
  onApply,
}: {
  isOpen: boolean;
  suggestion: Suggestion | null;
  currentScore: number;
  currentBalance: number;
  formatCurrency: (val: number) => string;
  onCancel: () => void;
  onApply: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !suggestion) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onCancel();
  };

  const scoreDiff = suggestion.newScore - currentScore;
  const balanceDiff = suggestion.projectedBalance - currentBalance;
  const newScoreColor =
    suggestion.newScore >= 60 ? "text-[var(--color-primary)]" : suggestion.newScore >= 40 ? "text-[var(--text-secondary)]" : "text-[color-mix(in_srgb,var(--text-primary)_55%,var(--text-secondary))]";

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--modal-overlay)] p-4"
    >
      <div className="card-standard w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-default)]">
          <div>
            <p className="text-[var(--text-primary)] text-base font-semibold">
              Confirm Change
            </p>
            <p className="text-[var(--text-secondary)] mt-0.5 text-xs">
              Review the impact before applying.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--surface-card)] border border-[var(--border-default)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-5">
          {/* What's changing */}
          <div>
            <p
              className="text-[var(--text-secondary)] mb-3 text-xs font-semibold uppercase tracking-wide"
            >
              What&apos;s changing
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[var(--surface-card)] border border-[var(--border-default)]  rounded-xl p-3 text-center">
                <p className="text-[var(--text-secondary)] text-xs font-medium">
                  {suggestion.currentLabel}
                </p>
                <p className="text-[var(--text-primary)] mt-0.5 text-lg font-bold">
                  {suggestion.currentValue}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-[var(--text-secondary)] shrink-0" />
              <div className="flex-1 rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-3 text-center">
                <p className="text-xs font-medium text-[var(--color-primary)]/80">
                  {suggestion.newLabel}
                </p>
                <p className="mt-0.5 text-lg font-bold text-[var(--color-primary)]">
                  {suggestion.newValue}
                </p>
              </div>
            </div>
          </div>

          {/* Impact metrics */}
          <div>
            <p
              className="text-[var(--text-secondary)] mb-3 text-xs font-semibold uppercase tracking-wide"
            >
              Impact
            </p>
            <div className="space-y-3">
              {/* Readiness score */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3">
                <span className="text-[var(--text-secondary)] text-sm">
                  Readiness score
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-secondary)] tabular-nums text-sm font-semibold">
                    {currentScore}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className={`tabular-nums text-sm font-bold ${newScoreColor}`}>
                    {suggestion.newScore}
                  </span>
                  <span
                    className="flex items-center gap-0.5 rounded bg-[var(--surface-suggestion-recommended)] px-1.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]"
                  >
                    <ArrowUpRight className="w-2.5 h-2.5" />+{scoreDiff}
                  </span>
                </div>
              </div>

              {/* Additional savings */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3">
                <span className="text-[var(--text-secondary)] text-sm">
                  Additional annual savings
                </span>
                <span className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] tabular-nums text-sm font-bold">
                  +${suggestion.additionalAnnualSavings.toLocaleString()}
                </span>
              </div>

              {/* Projected balance */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-3">
                <span className="text-[var(--text-secondary)] text-sm">
                  Projected retirement balance
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--text-secondary)] tabular-nums text-sm">
                    {formatCurrency(currentBalance)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-[var(--text-primary)] tabular-nums text-sm font-bold">
                    {formatCurrency(suggestion.projectedBalance)}
                  </span>
                </div>
              </div>

              {/* Balance increase callout */}
              {balanceDiff > 0 && (
                <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] px-4 py-2.5 text-center">
                  <span className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] text-sm font-semibold">
                    +{formatCurrency(balanceDiff)} more at retirement
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--border-default)] px-6 py-4 flex items-center gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[var(--surface-card)] transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onApply}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
          >
            <Zap className="w-3.5 h-3.5" /> Apply Change
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function RetirementReadiness() {
  const navigate = useNavigate();
  const { data, updateData, personalization, setCurrentStep } = useEnrollment();
  const [appliedChanges, setAppliedChanges] = useState<string[]>([]);
  const [confirmingSuggestion, setConfirmingSuggestion] = useState<Suggestion | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const yearsToRetirement = personalization.retirementAge - personalization.currentAge;

  // Score calculation
  const computeScore = (contribPct: number, autoInc: boolean, riskLevel: string) => {
    const contribScore = contribPct * 5;
    const autoIncScore = autoInc ? 12 : 0;
    const timeScore = Math.min(yearsToRetirement * 0.8, 20);
    const savingsBonus = Math.min(personalization.currentSavings / 10000, 10);
    const riskBonus = riskLevel === "growth" ? 3 : riskLevel === "aggressive" ? 5 : 0;
    return Math.min(Math.round(contribScore + autoIncScore + timeScore + savingsBonus + riskBonus), 100);
  };

  const score = computeScore(data.contributionPercent, data.autoIncrease, data.riskLevel);

  // Projections
  const matchPercent = Math.min(data.contributionPercent, 6);
  const annualContribution = Math.round((data.salary * data.contributionPercent) / 100);
  const employerContribution = Math.round((data.salary * matchPercent) / 100);
  
  // Calculate retirement income goal (simplified: 80% of current salary)
  const retirementIncomeGoal = Math.round(data.salary * RETIREMENT_INCOME_TARGET_RATIO);
  const annualSavingsGap = Math.max(0, retirementIncomeGoal - annualContribution - employerContribution);
  
  const growthRate = getGrowthRate(data.riskLevel);

  const projectedBalance = projectBalanceConstantAnnualContributions(
    personalization.currentSavings,
    annualContribution,
    employerContribution,
    yearsToRetirement,
    growthRate,
  );

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  // Score color
  const circumference = 2 * Math.PI * 70;
  const scoreColor =
    score >= 60 ? "var(--color-primary)" : score >= 40 ? "var(--color-primary)" : "var(--text-primary)";

  const getMessage = () => {
    if (score >= 80) return "You're on a great track!";
    if (score >= 60) return "You're building a solid foundation.";
    if (score >= 40) return "You're getting started — keep going!";
    return "Every step counts toward your goal.";
  };

  // ── Build improvement suggestions ──

  const suggestions: Suggestion[] = [];

  // 1. Increase contribution by 2%
  const boostPct = 2;
  const boostedContrib = data.contributionPercent + boostPct;
  if (boostedContrib <= 25 && !appliedChanges.includes("boost-contribution")) {
    const boostedAnnual = Math.round((data.salary * boostedContrib) / 100);
    const boostedMatch = Math.round((data.salary * Math.min(boostedContrib, 6)) / 100);
    const boostedScore = computeScore(boostedContrib, data.autoIncrease, data.riskLevel);
    const boostedBalance = projectBalanceConstantAnnualContributions(
      personalization.currentSavings,
      boostedAnnual,
      boostedMatch,
      yearsToRetirement,
      growthRate,
    );
    const additionalPerYear = boostedAnnual + boostedMatch - annualContribution - employerContribution;

    suggestions.push({
      id: "boost-contribution",
      icon: <Percent className="h-4 w-4 text-[var(--color-primary)]" />,
      title: `Increase contribution by ${boostPct}%`,
      description: "A small increase now compounds into significant retirement savings over time.",
      scoreIncrease: boostedScore - score,
      newScore: boostedScore,
      additionalAnnualSavings: additionalPerYear,
      projectedBalance: boostedBalance,
      currentLabel: "Current contribution",
      currentValue: `${data.contributionPercent}%`,
      newLabel: "New contribution",
      newValue: `${boostedContrib}%`,
      apply: () => {
        updateData({ contributionPercent: boostedContrib });
      },
    });
  }

  // 2. Enable auto-increase
  if (!data.autoIncrease && !appliedChanges.includes("enable-auto-increase")) {
    const autoIncScore = computeScore(data.contributionPercent, true, data.riskLevel);
    // Estimate balance with auto-increase (simplified: avg extra 0.5% per year over the period)
    const avgExtraContrib = Math.round(
      (data.salary * Math.min(data.autoIncreaseAmount * (yearsToRetirement / 2), data.autoIncreaseMax - data.contributionPercent)) / 100
    );
    const autoIncBalance = projectBalanceConstantAnnualContributions(
      personalization.currentSavings,
      annualContribution + avgExtraContrib,
      employerContribution,
      yearsToRetirement,
      growthRate,
    );

    suggestions.push({
      id: "enable-auto-increase",
      icon: <TrendingUp className="w-4 h-4 text-[var(--color-primary)]" />,
      title: "Enable automatic contribution increases",
      description: `Automatically increase your contribution by ${data.autoIncreaseAmount}% each year up to ${data.autoIncreaseMax}%.`,
      scoreIncrease: autoIncScore - score,
      newScore: autoIncScore,
      additionalAnnualSavings: avgExtraContrib,
      projectedBalance: autoIncBalance,
      currentLabel: "Auto-increase",
      currentValue: "Off",
      newLabel: "Auto-increase",
      newValue: `${data.autoIncreaseAmount}%/yr`,
      apply: () => {
        updateData({ autoIncrease: true });
      },
    });
  }

  // 3. Adjust strategy for higher growth
  const growthUpgrade: Record<string, string> = {
    conservative: "balanced",
    balanced: "growth",
  };
  const riskLabels: Record<string, string> = {
    conservative: "Conservative",
    balanced: "Balanced",
    growth: "Growth",
    aggressive: "Aggressive",
  };
  const nextRiskLevel = growthUpgrade[data.riskLevel];
  if (nextRiskLevel && !appliedChanges.includes("upgrade-strategy")) {
    const nextRate = getGrowthRate(nextRiskLevel as RiskLevel);
    const upgradeScore = computeScore(data.contributionPercent, data.autoIncrease, nextRiskLevel);
    const upgradeBalance = projectBalanceConstantAnnualContributions(
      personalization.currentSavings,
      annualContribution,
      employerContribution,
      yearsToRetirement,
      nextRate,
    );
    const extraBalancePerYear = Math.round((upgradeBalance - projectedBalance) / yearsToRetirement);

    suggestions.push({
      id: "upgrade-strategy",
      icon: <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />,
      title: "Adjust investment strategy for higher growth",
      description: `Switch from ${riskLabels[data.riskLevel]} to ${riskLabels[nextRiskLevel]} for potentially higher long-term returns.`,
      scoreIncrease: upgradeScore - score,
      newScore: upgradeScore,
      additionalAnnualSavings: extraBalancePerYear > 0 ? extraBalancePerYear : 0,
      projectedBalance: upgradeBalance,
      currentLabel: "Current strategy",
      currentValue: riskLabels[data.riskLevel],
      newLabel: "New strategy",
      newValue: riskLabels[nextRiskLevel],
      apply: () => {
        updateData({ riskLevel: nextRiskLevel as "conservative" | "balanced" | "growth" | "aggressive" });
      },
    });
  }

  // Sort suggestions by score impact (highest first)
  suggestions.sort((a, b) => b.scoreIncrease - a.scoreIncrease);

  // Calculate potential score with all recommendations
  const potentialScore = suggestions.length > 0 
    ? suggestions.reduce((max, s) => Math.max(max, s.newScore), score)
    : score;
  
  const totalPotentialIncrease = potentialScore - score;

  // ── Handlers ──

  const handleOpenConfirm = (suggestion: Suggestion) => {
    setConfirmingSuggestion(suggestion);
  };

  const handleApply = () => {
    if (!confirmingSuggestion) return;
    confirmingSuggestion.apply();
    setAppliedChanges((prev) => [...prev, confirmingSuggestion.id]);
    setConfirmingSuggestion(null);
    setSuccessMessage("Change applied successfully");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleNext = () => {
    setCurrentStep(7);
    navigate(ep("review"));
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <button
          onClick={() => {
            setCurrentStep(5);
            navigate(ep("investment"));
          }}
          className="flex items-center gap-1 text-[var(--text-secondary)] mb-3 hover:text-[var(--text-primary)] text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Your Retirement Readiness</h1>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Here's how your choices add up before you finalize.
        </p>
      </div>

      {/* Two-column grid */}
      <div className="grid md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* ── Left Column: score & projection ── */}
        <div className="space-y-6 min-w-0">
          {/* Score + Projected Balance — neutral card (depth via shadow, not tint) */}
          <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] p-7 shadow-[var(--shadow-lg)]">
            {/* Score Circle — centered hero */}
            <div className="flex flex-col items-center">
              <AnimatedScore value={score} color={scoreColor} circumference={circumference} />

              {/* Explanatory text */}
              <p className="text-[var(--text-primary)] mt-4 text-center text-base font-semibold">
                {getMessage()}
              </p>
              <p className="text-[var(--text-secondary)] mt-1 text-center text-sm">
                You are{" "}
                <span className="font-semibold">{score}% on track</span> for your retirement goal.
              </p>
              <p className="mt-1 text-center text-xs text-[var(--text-muted-strong)]">
                Most participants your age aim for a readiness score of 65 or higher.
              </p>

              {/* Target benchmark — neutral track */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="h-1.5 w-24 overflow-hidden rounded-full border border-[var(--border-default)] bg-[var(--surface-section)]">
                  <div className="h-full rounded-full bg-[var(--text-secondary)]" style={{ width: "65%" }} />
                </div>
                <span className="text-[var(--text-secondary)] text-xs font-medium">
                  Target: <span className="font-semibold">65</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-[var(--border-default)]" />

            {/* Projected balance — neutral inset well */}
            <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface-section)] p-4 text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 text-[var(--color-primary)]" />
                <p className="text-[var(--text-secondary)] text-xs font-medium">
                  Projected retirement balance
                </p>
              </div>
              <p
                className="text-[var(--text-primary)] tabular-nums text-3xl font-bold"
                style={{ transition: "all 0.5s ease" }}
              >
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-0.5 text-[var(--text-secondary)] text-xs">
                In {yearsToRetirement} years with your current contribution and investment strategy.
              </p>
            </div>
          </div>

          {/* Success Banner — left column so it's near the score */}
          {successMessage && (
            <div
              className="fm-inset-panel [background:var(--color-success-bg)] border border-[var(--color-success-border)] rounded-2xl px-5 py-3.5 flex items-center gap-3"
              style={{ animation: "fadeSlideIn 0.4s ease" }}
            >
              <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
              <p className="text-[var(--text-primary)] text-sm font-semibold">
                {successMessage}
              </p>
            </div>
          )}

          {/* Continue CTA — desktop only position */}
          <div className="hidden md:block pt-1">
            
          </div>
        </div>

        {/* ── Right Column: improvement actions ── */}
        <div className="space-y-6 min-w-0">
          {/* Merged Score + Progress Potential Card */}
          {suggestions.length > 0 && totalPotentialIncrease > 0 && (
            <div className="rounded-2xl border border-[var(--border-default)] px-5 py-4 shadow-[var(--shadow-lg)] [background:var(--surface-recommendation)]">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    Recommended for You
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--surface-suggestion-recommended)] px-2 py-1">
                  <p className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] text-xs font-extrabold">
                    Score: {potentialScore}
                  </p>
                </div>
              </div>
              <p className="text-[var(--text-primary)] mb-3 text-xs leading-normal">
                You can reach a score of <span className="font-semibold text-[var(--color-primary)]">{potentialScore}</span> — apply the recommendations below to boost your readiness by <span className="font-semibold">+{totalPotentialIncrease} points</span>.
              </p>
            </div>
          )}
          
          {/* Improvement Suggestions */}
          {suggestions.length > 0 && (
            <div>
              <div className="mb-3">
                <p className="text-[var(--text-primary)] text-base font-semibold">
                  Optional ways to improve your readiness
                </p>
                <p className="text-[var(--text-secondary)] mt-1 text-xs">
                  You can apply one of these improvements to increase your retirement readiness score.
                </p>
              </div>

              <div className="space-y-4">
                {suggestions.map((suggestion, index) => {
                  const isRecommended = index === 0;
                  return (
                    <div
                      key={suggestion.id}
                      className={`rounded-xl border border-[var(--border-default)] transition-all ${
                        isRecommended
                          ? "bg-[var(--surface-suggestion-recommended)] shadow-[var(--shadow-lg)]"
                          : "bg-[var(--surface-suggestion-muted)]"
                      }`}
                    >
                      <div className="p-5">
                        {/* Recommended badge */}
                        {isRecommended && (
                          <div className="flex items-center gap-1 mb-2.5">
                            <Award className="h-3 w-3 text-[var(--color-primary)]" />
                            <span
                              className="text-xs font-semibold uppercase tracking-wide text-[var(--color-primary)]"
                            >
                              Recommended
                            </span>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isRecommended ? "bg-[var(--surface-suggestion-recommended)]" : "border border-[var(--border-enroll-subtle)] bg-[var(--surface-card)]"
                          }`}>
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[var(--text-primary)] text-sm font-semibold">
                              {suggestion.title}
                            </p>
                            <p className="text-[var(--text-secondary)] mt-0.5 text-xs leading-normal">
                              {suggestion.description}
                            </p>

                            {/* Impact metrics — score transition format */}
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
                              <div>
                                <p className="text-[var(--text-secondary)] text-xs font-medium">
                                  Score
                                </p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <span className="text-[var(--text-secondary)] tabular-nums text-sm font-semibold">
                                    {score}
                                  </span>
                                  <ArrowRight className="w-3 h-3 text-[var(--text-secondary)]" />
                                  <span className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] tabular-nums text-sm font-bold">
                                    {suggestion.newScore}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-[var(--text-secondary)] text-xs font-medium">
                                  Savings
                                </p>
                                <p className="mt-0.5 text-sm font-bold tabular-nums text-[var(--color-primary)]">
                                  +${suggestion.additionalAnnualSavings.toLocaleString()}/yr
                                </p>
                              </div>
                              <div>
                                <p className="text-[var(--text-secondary)] text-xs font-medium">
                                  Balance
                                </p>
                                <p className="text-[var(--text-primary)] mt-0.5 tabular-nums text-sm font-bold">
                                  {formatCurrency(suggestion.projectedBalance)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Apply Button - Tertiary style */}
                        <button
                          onClick={() => handleOpenConfirm(suggestion)}
                          className="mt-3 w-full rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--surface-section)]"
                        >
                          Apply Recommendation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All improvements applied */}
          {suggestions.length === 0 && appliedChanges.length > 0 && (
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)] px-5 py-4 text-center shadow-[var(--shadow-lg)]">
              <CheckCircle2 className="w-6 h-6 text-[var(--color-primary)] mx-auto mb-2" />
              <p className="text-[var(--text-primary)] text-sm font-semibold">
                All improvements applied
              </p>
              <p className="text-[var(--color-primary)] mt-0.5 text-xs">
                Your score and balance have been optimized.
              </p>
            </div>
          )}
          
          {/* Continue Button - Moved to right section */}
          <div className="space-y-2.5 pt-4 border-t border-[var(--border-default)] mt-4">
            <button
              onClick={handleNext}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--primary-foreground)]  transition-all hover:bg-[var(--color-primary-hover)]"
            >
              Apply Recommendation <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleNext}
              className="w-full bg-[var(--surface-card)] text-[var(--text-primary)] py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--surface-card)] border border-[var(--border-default)] transition-all text-sm font-semibold"
            >
              Continue with Custom Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Continue CTA — mobile only, sticky bottom */}
      <div className="md:hidden sticky bottom-4 pt-4">
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-8 py-3.5 text-[var(--primary-foreground)]  transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
        >
          Continue to Review <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!confirmingSuggestion}
        suggestion={confirmingSuggestion}
        currentScore={score}
        currentBalance={projectedBalance}
        formatCurrency={formatCurrency}
        onCancel={() => setConfirmingSuggestion(null)}
        onApply={handleApply}
      />

      {/* Keyframe animation for success banner */}
      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}