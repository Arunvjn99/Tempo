import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign, Info, Percent, Sparkles, TrendingUp, Target, type LucideIcon } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
import {
  generateRecommendations,
  type GeneratedRecommendation,
  type ReadinessApplyPatch,
} from "../flow/readinessRecommendations";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { pathForWizardStep } from "../flow/v1WizardPaths";
import { cn } from "@/lib/utils";

/** Participant benchmark shown in UI (Figma reference — target score line). */
const READINESS_BENCHMARK = 65;

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;
const P = "enrollment.v1.readiness.";

function AnimatedScoreRing({
  value,
  strokeClass,
  centerClassName,
}: {
  value: number;
  strokeClass: string;
  /** Center score number (reference: bold dark text inside donut). */
  centerClassName: string;
}) {
  const { t } = useTranslation();
  const [displayValue, setDisplayValue] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current === value) return;
    const start = prev.current;
    const diff = value - start;
    const duration = 800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - (1 - t) ** 3;
      setDisplayValue(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prev.current = value;
  }, [value]);

  const dashOffset = RING_C - (displayValue / 100) * RING_C;

  return (
    <div className="readiness-score-ring-wrap -rotate-90">
      <svg viewBox="0 0 160 160" aria-hidden>
        <circle cx="80" cy="80" r={RING_R} fill="none" className="stroke-slate-200 dark:stroke-slate-600" strokeWidth="12" />
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          className={strokeClass}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex rotate-90 flex-col items-center justify-center">
        <span className={cn("text-[40px] font-bold tabular-nums leading-none tracking-[0.33px]", centerClassName)}>{displayValue}</span>
        <span className="mt-1 text-[11px] font-normal text-[#99a1af]">{t(`${P}outOf100`)}</span>
      </div>
    </div>
  );
}

function recommendationVisual(recId: string): { boxClass: string; iconClass: string; Icon: LucideIcon } {
  switch (recId) {
    case "auto-increase":
      return {
        boxClass: "bg-blue-100 dark:bg-blue-950/40",
        iconClass: "text-emerald-600 dark:text-emerald-400",
        Icon: TrendingUp,
      };
    case "increase-contribution":
    case "employer-match":
      return {
        boxClass: "bg-blue-100 dark:bg-blue-950/40",
        iconClass: "text-blue-700 dark:text-blue-300",
        Icon: Percent,
      };
    case "strategy-balanced":
    case "strategy-growth":
      return {
        boxClass: "bg-violet-100 dark:bg-violet-950/40",
        iconClass: "text-violet-700 dark:text-violet-300",
        Icon: TrendingUp,
      };
    default:
      return {
        boxClass: "bg-slate-100 dark:bg-slate-800/80",
        iconClass: "text-slate-700 dark:text-slate-200",
        Icon: Sparkles,
      };
  }
}

function applyEnrollmentPatch(patch: ReadinessApplyPatch, updateField: EnrollmentV1Store["updateField"]) {
  switch (patch.kind) {
    case "contribution":
      updateField("contribution", patch.value);
      break;
    case "autoIncreaseOn":
      updateField("autoIncrease", true);
      updateField("autoIncreaseStepResolved", true);
      break;
    case "riskLevel":
      updateField("riskLevel", patch.value);
      break;
    default:
      break;
  }
}

export function RetirementReadiness() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const goToStep = useEnrollmentStore((s) => s.goToStep);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [selectedRecId, setSelectedRecId] = useState<string | null>(null);

  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);

  const projectedBalance = data.projectedBalance;
  const score = data.readinessScore;
  const retirementIncomeGoalAnnual = data.retirementProjection.monthlyIncome * 12;
  const currentAnnualContributions = data.monthlyContribution * 12;
  const annualSavingsGap = Math.max(0, retirementIncomeGoalAnnual - currentAnnualContributions);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };
  const formatCurrencyDetailed = (val: number) =>
    val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const recommendations = useMemo(
    () =>
      generateRecommendations(
        data,
        appliedIds,
        {
          score,
          projectedBalance,
          yearsToRetirement,
        },
        t,
      ),
    [appliedIds, data, projectedBalance, score, yearsToRetirement, t],
  );

  const actionableRecs = useMemo(
    () => recommendations.filter((r) => r.patch.kind !== "none"),
    [recommendations],
  );

  const bestNewScore = useMemo(
    () => actionableRecs.reduce((m, r) => Math.max(m, r.newScore), score),
    [actionableRecs, score],
  );

  const boostPoints = Math.max(0, bestNewScore - score);
  const showRecommendedPanel = actionableRecs.length > 0 && boostPoints > 0;

  const applyRec = (rec: GeneratedRecommendation) => {
    if (rec.patch.kind === "none") return;
    if (!window.confirm(t(`${P}confirmApply`))) return;
    applyEnrollmentPatch(rec.patch, updateField);
    setAppliedIds((prev) => (prev.includes(rec.id) ? prev : [...prev, rec.id]));
  };

  const strategyRec = actionableRecs.find((rec) => rec.id.startsWith("strategy-"));
  const orderedActionableRecs = useMemo(() => {
    if (actionableRecs.length <= 1) return actionableRecs;
    if (!strategyRec || strategyRec.id === actionableRecs[0]?.id) return actionableRecs;
    return [actionableRecs[0], strategyRec, ...actionableRecs.filter((rec) => rec.id !== actionableRecs[0]?.id && rec.id !== strategyRec.id)];
  }, [actionableRecs, strategyRec]);
  const selectedActionableRec =
    orderedActionableRecs.find((rec) => rec.id === selectedRecId) ?? orderedActionableRecs[0];

  useEffect(() => {
    if (orderedActionableRecs.length === 0) {
      setSelectedRecId(null);
      return;
    }
    setSelectedRecId((prev) => (prev && orderedActionableRecs.some((rec) => rec.id === prev) ? prev : orderedActionableRecs[0].id));
  }, [orderedActionableRecs]);

  const handleContinueCustomAllocation = () => {
    const idx = ENROLLMENT_STEPS.indexOf("investment");
    goToStep(idx);
    navigate(pathForWizardStep(idx));
  };

  const alertIsCritical = score < 40;
  const strokeClass = alertIsCritical
    ? "stroke-red-500 dark:stroke-red-400"
    : score < READINESS_BENCHMARK
      ? "stroke-orange-500 dark:stroke-orange-400"
      : "stroke-emerald-500 dark:stroke-emerald-400";
  const centerScoreClass =
    alertIsCritical
      ? "text-red-600 dark:text-red-400"
      : score < READINESS_BENCHMARK
        ? "text-slate-900 dark:text-slate-50"
        : "text-emerald-700 dark:text-emerald-300";

  const targetBarPct = Math.min(100, Math.round((score / READINESS_BENCHMARK) * 100));
  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`);
    if (s >= 70) return t(`${P}statusSolid`);
    if (s >= 40) return t(`${P}statusStarted`);
    return t(`${P}statusEveryStep`);
  };

  return (
    <div className="w-full min-w-0 bg-white px-8 py-8 text-left dark:bg-slate-950">

      {/* ── Page header ── */}
      <header className="mb-7">
        <h1 className="text-[26px] font-bold leading-tight tracking-tight text-[#111827] dark:text-slate-50">
          {t(`${P}pageTitle`)}
        </h1>
        <p className="mt-1.5 text-[14px] text-[#6b7280] dark:text-slate-400">
          {t(`${P}pageSubtitle`)}
        </p>
      </header>

      {/* ── Two-column grid ── */}
      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">

        {/* ════════════ LEFT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* Score card */}
          <div className="rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="flex flex-col items-center">
              {/* Score ring */}
              <div className="readiness-score-visual relative !h-[170px] !w-[170px]">
                <AnimatedScoreRing value={score} strokeClass={strokeClass} centerClassName={centerScoreClass} />
              </div>

              {/* "On Track" */}
              <p className="mt-4 text-[18px] font-bold text-[#111827] dark:text-slate-50">
                {statusMessage(score)}
              </p>

              {/* "You are 67% on track for your goal." */}
              <p className="mt-1 text-center text-[13.5px] text-[#6b7280] dark:text-slate-400">
                <Trans
                  i18nKey={`${P}onTrackLine`}
                  values={{ score }}
                  components={{ score: <span className="font-semibold text-[#111827] dark:text-slate-100" /> }}
                />
              </p>

              {/* Progress bar + "Target: 65" */}
              <div className="mt-3 flex w-full max-w-[230px] items-center gap-2">
                <div className="h-[7px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#e5e7eb] dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-[width] duration-500 ease-out"
                    style={{ width: `${targetBarPct}%` }}
                  />
                </div>
                <span className="shrink-0 text-[12px] text-[#9ca3af]">
                  {t(`${P}target`)} <span className="font-semibold text-[#6b7280]">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-[#f3f4f6] dark:border-slate-800" />

            {/* Projected balance */}
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-[#9ca3af]" aria-hidden />
                <span className="text-[10.5px] font-semibold uppercase tracking-widest text-[#9ca3af]">
                  {t(`${P}projectedBalanceLabel`)}
                </span>
              </div>
              <p className="mt-1 text-[34px] font-bold tabular-nums leading-none text-[#111827] dark:text-slate-50">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-1.5 text-[12px] text-[#9ca3af]">
                At age {data.retirementAge}
              </p>
            </div>
          </div>

          {/* Understanding Your Score — no card bg, plain section */}
          <div>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 shrink-0 text-[#3b82f6]" aria-hidden />
              <p className="text-[15px] font-semibold text-[#111827] dark:text-slate-50">
                {t(`${P}understandingTitle`)}
              </p>
            </div>
            <p className="mt-1.5 text-[13px] leading-[1.6] text-[#4b5563] dark:text-slate-300">
              {t(`${P}understandingBody`, { score })}
            </p>
          </div>

          {/* Annual Funding Summary */}
          <div className="rounded-xl border border-[#bfdbfe] bg-[#eff8ff] px-5 py-4 dark:border-sky-900/50 dark:bg-sky-950/20">
            <p className="text-[15px] font-bold text-[#111827] dark:text-slate-50">
              {t(`${P}fundingTitle`)}
            </p>

            <div className="mt-3.5 space-y-3">
              {/* Retirement Income Goal */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#64748b]" aria-hidden />
                  <span className="text-[13.5px] text-[#374151] dark:text-slate-300">{t(`${P}fundingGoal`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[#111827] dark:text-slate-50">
                  ${formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </span>
              </div>

              {/* Current Annual Contributions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#3b82f6]" aria-hidden />
                  <span className="text-[13.5px] text-[#374151] dark:text-slate-300">{t(`${P}fundingCurrent`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[#2563eb] dark:text-sky-300">
                  ${Math.round(currentAnnualContributions).toLocaleString()}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#bfdbfe]" />

              {/* Annual Savings Gap */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#ef4444]" aria-hidden />
                  <span className="text-[13.5px] text-[#374151] dark:text-slate-300">{t(`${P}fundingGap`)}</span>
                </div>
                <span className="text-[14px] font-semibold tabular-nums text-[#dc2626] dark:text-red-400">
                  ${formatCurrencyDetailed(annualSavingsGap)}
                </span>
              </div>
            </div>

            {/* Footer note */}
            <div className="mt-3.5 border-t border-[#bfdbfe] pt-3 dark:border-sky-900/50">
              <p className="text-[11.5px] leading-[1.6] text-[#64748b] dark:text-slate-400">
                {t(`${P}fundingFooter`)}
              </p>
            </div>
          </div>
        </div>

        {/* ════════════ RIGHT COLUMN ════════════ */}
        <div className="flex flex-col gap-5">

          {/* Boost banner */}
          {showRecommendedPanel ? (
            <div className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] px-5 py-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 shrink-0 text-[#2563eb]" aria-hidden />
                <span className="text-[14px] font-semibold text-[#2563eb] dark:text-indigo-300">
                  {`Boost your score to ${bestNewScore}`}
                </span>
              </div>
              <p className="mt-2 text-[13.5px] leading-[1.6] text-[#374151] dark:text-slate-300">
                {`Applying the recommended changes below can increase your readiness score by ${boostPoints} points and significantly improve your projected balance.`}
              </p>
            </div>
          ) : null}

          {/* Recommendations heading */}
          <div>
            <p className="text-[17px] font-bold text-[#111827] dark:text-slate-50">Recommendations</p>
            <p className="mt-0.5 text-[13px] text-[#6b7280] dark:text-slate-400">
              Select an option to see how it impacts your retirement.
            </p>
          </div>

          {/* Recommendation cards */}
          <div className="flex flex-col gap-3">
            {orderedActionableRecs.map((rec, index) => {
              const isFeatured = index === 0;
              const isSelected = rec.id === selectedActionableRec?.id;
              const { iconClass, Icon } = recommendationVisual(rec.id);
              return (
                <div
                  key={rec.id}
                  className={cn(
                    "relative cursor-pointer rounded-xl border bg-white px-5 py-5 transition-all dark:bg-slate-900",
                    isFeatured ? "mt-3" : "",
                    isSelected
                      ? "border-[#93c5fd] shadow-[0_0_0_1.5px_#93c5fd]"
                      : "border-[#e5e7eb] hover:border-[#93c5fd] dark:border-slate-700",
                  )}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setSelectedRecId(rec.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedRecId(rec.id);
                    }
                  }}
                >
                  {/* RECOMMENDED badge — overlapping top border */}
                  {isFeatured ? (
                    <div className="absolute -top-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-[#1d4ed8] px-3 py-1 shadow-sm">
                      <Sparkles className="h-2.5 w-2.5 text-white" aria-hidden />
                      <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-white">
                        {t(`${P}recBadge`)}
                      </span>
                    </div>
                  ) : null}

                  {/* Icon + title + description */}
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        rec.id.startsWith("strategy-") ? "bg-[#f5f3ff]" : "bg-[#eff6ff]",
                      )}
                    >
                      <Icon className={cn("h-[18px] w-[18px]", rec.id.startsWith("strategy-") ? "text-[#8b5cf6]" : "text-[#2563eb]")} aria-hidden strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold leading-snug text-[#111827] dark:text-slate-50">
                        {rec.title}
                      </p>
                      <p className="mt-0.5 text-[13px] leading-[1.5] text-[#6b7280] dark:text-slate-400">
                        {rec.description}
                      </p>
                    </div>
                  </div>

                  {/* Metrics row — SCORE / SAVINGS / BALANCE */}
                  <div className="mt-4 grid grid-cols-3 border-t border-[#f3f4f6] pt-3 dark:border-slate-800">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                        {t(`${P}metricScore`)}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-[13px] font-medium tabular-nums text-[#9ca3af]">{score}</span>
                        <ArrowRight className="h-3 w-3 shrink-0 text-[#9ca3af]" aria-hidden />
                        <span className="text-[13px] font-bold tabular-nums text-[#16a34a]">{rec.newScore}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                        {t(`${P}metricSavings`)}
                      </p>
                      <p className="mt-1 text-[13px] font-bold tabular-nums text-[#2563eb]">
                        +${rec.additionalAnnualSavings.toLocaleString()}/yr
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#9ca3af]">
                        {t(`${P}metricBalance`)}
                      </p>
                      <p className="mt-1 text-[13px] font-bold tabular-nums text-[#111827] dark:text-slate-100">
                        {formatCurrency(rec.projectedBalanceAfter)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Fallback when no recs */}
            {orderedActionableRecs.length === 0 ? (
              <div className="rounded-xl border border-[#e5e7eb] bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <p className="text-[13px] text-[#6b7280] dark:text-slate-400">
                  {recommendations[0]?.description ?? t(`${P}fallbackRec`)}
                </p>
              </div>
            ) : null}
          </div>

          {/* Bottom CTAs */}
          {selectedActionableRec != null && selectedActionableRec.patch.kind !== "none" ? (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] text-[14px] font-semibold text-white shadow-md transition-colors hover:bg-[#1e40af] active:scale-[0.99]"
                onClick={() => applyRec(selectedActionableRec)}
              >
                Apply Selected <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </button>
              <button
                type="button"
                onClick={handleContinueCustomAllocation}
                className="flex h-12 w-full items-center justify-center rounded-xl border border-[#e5e7eb] bg-white text-[14px] font-semibold text-[#374151] transition-colors hover:bg-[#f9fafb] active:scale-[0.99] dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                Customize Allocation
              </button>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
}
