import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, DollarSign, Info, Percent, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
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
      return {
        boxClass: "bg-violet-100 dark:bg-violet-950/40",
        iconClass: "text-violet-700 dark:text-violet-300",
        Icon: Sparkles,
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

  const topActionableRec = actionableRecs[0];
  const strategyRec = actionableRecs.find((rec) => rec.id === "strategy-balanced");
  const orderedActionableRecs = useMemo(() => {
    if (actionableRecs.length <= 1) return actionableRecs;
    if (!strategyRec || strategyRec.id === actionableRecs[0]?.id) return actionableRecs;
    return [actionableRecs[0], strategyRec, ...actionableRecs.filter((rec) => rec.id !== actionableRecs[0]?.id && rec.id !== strategyRec.id)];
  }, [actionableRecs, strategyRec]);

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
  const needsAttention = score < READINESS_BENCHMARK;

  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`);
    if (s >= 70) return t(`${P}statusSolid`);
    if (s >= 40) return t(`${P}statusStarted`);
    return t(`${P}statusEveryStep`);
  };

  return (
    <div className="w-full min-w-0 bg-[#f5f7fa] px-6 py-6 text-left dark:bg-slate-950/60">
      {/* Page header */}
      <header className="mb-5">
        <h1 className="text-[24px] font-medium leading-[36px] tracking-[0.07px] text-[#101828] dark:text-slate-50">
          {t(`${P}pageTitle`)}
        </h1>
        <p className="mt-1 text-[14.4px] font-normal leading-[21.6px] tracking-[-0.18px] text-[#6a7282] dark:text-slate-300">
          {t(`${P}pageSubtitle`)}
        </p>
      </header>

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,588px)_minmax(0,1fr)]">

        {/* ── LEFT COLUMN ── */}
        <div className="min-w-0 space-y-3">

          {/* Score card */}
          <section className="rounded-[16px] border border-[#e5e7eb] bg-white px-[25px] pb-px pt-[25px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] dark:border-slate-700 dark:bg-slate-950">
            {/* Score ring + status text */}
            <div className="flex flex-col items-center pb-3">
              <div className="readiness-score-visual relative !h-[175px] !w-[175px]">
                <AnimatedScoreRing value={score} strokeClass={strokeClass} centerClassName={centerScoreClass} />
              </div>
              <p className="mt-3 text-center text-[16.8px] font-semibold leading-[25.2px] tracking-[-0.41px] text-[#1e2939] dark:text-slate-50">
                {statusMessage(score)}
              </p>
              <p className="mt-1 text-center text-[13.6px] font-normal leading-[20.4px] tracking-[-0.12px] text-[#6a7282] dark:text-slate-300">
                <Trans
                  i18nKey={`${P}onTrackLine`}
                  values={{ score }}
                  components={{ score: <span className="font-semibold text-[#1e2939] dark:text-slate-100" /> }}
                />
              </p>
              <p className="mt-1 text-center text-[12px] font-normal leading-[18px] text-[#99a1af] dark:text-slate-400">
                {t(`${P}benchmarkLine`, { benchmark: READINESS_BENCHMARK })}
              </p>
              <div className="mt-3 flex w-full max-w-[240px] items-center gap-2">
                <div className="h-[6px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#f3f4f6] dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-[#d1d5dc] transition-[width] duration-500 ease-out"
                    style={{ width: `${targetBarPct}%` }}
                  />
                </div>
                <span className="shrink-0 text-[11.2px] font-medium tracking-[0.05px] text-[#99a1af]">
                  {t(`${P}target`)} <span className="font-semibold">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#f3f4f6]" />

            {/* Projected balance */}
            <div className="py-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 text-[#6a7282]" aria-hidden />
                <p className="text-[12.48px] font-medium leading-[18.72px] tracking-[-0.04px] text-[#6a7282]">
                  {t(`${P}projectedBalanceLabel`)}
                </p>
              </div>
              <p className="mt-1 text-[28.8px] font-bold leading-[43.2px] tracking-[0.39px] tabular-nums text-[#101828] dark:text-slate-50">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-1 text-[12px] font-normal leading-[18px] text-[#99a1af]">
                {t(`${P}projectedBalanceSub`, { years: yearsToRetirement })}
              </p>
            </div>
          </section>

          {/* Understanding Your Score */}
          <div className="rounded-[10px] bg-[#f8fafc] px-3 py-3 dark:bg-slate-900/60">
            <div className="flex items-center gap-[6px]">
              <Info className="h-4 w-4 shrink-0 text-[#6a7282]" aria-hidden />
              <p className="text-[18px] font-semibold leading-[28px] tracking-[-0.44px] text-[#0f172b] dark:text-slate-50">
                {t(`${P}understandingTitle`)}
              </p>
            </div>
            <p className="mt-1 text-[14px] font-normal leading-[19.25px] tracking-[-0.15px] text-[#45556c] dark:text-slate-300">
              {t(`${P}understandingBody`, { score })}
            </p>
          </div>

          {/* Annual Funding Summary */}
          <div
            className="rounded-[14px] border border-[#bfdbfe] px-[17px] pb-px pt-[17px] dark:border-sky-900/50"
            style={{ background: "linear-gradient(156.55deg, #eff6ff 0%, #ecfeff 100%)" }}
          >
            <p className="text-[16px] font-bold leading-[24px] tracking-[-0.31px] text-[#0f172b] dark:text-slate-50">
              {t(`${P}fundingTitle`)}
            </p>

            <div className="mt-[10px] space-y-[10px]">
              {/* Goal row */}
              <div className="flex h-6 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#64748b]" aria-hidden />
                  <p className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#475569] dark:text-slate-300">
                    {t(`${P}fundingGoal`)}
                  </p>
                </div>
                <p className="text-[16px] font-bold leading-[24px] tracking-[-0.31px] tabular-nums text-[#0f172b] dark:text-slate-50">
                  ${formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </p>
              </div>

              {/* Current row */}
              <div className="flex h-6 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#3b82f6]" aria-hidden />
                  <p className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#475569] dark:text-slate-300">
                    {t(`${P}fundingCurrent`)}
                  </p>
                </div>
                <p className="text-[16px] font-bold leading-[24px] tracking-[-0.31px] tabular-nums text-[#0ea5e9] dark:text-sky-300">
                  ${Math.round(currentAnnualContributions).toLocaleString()}
                </p>
              </div>

              {/* Thin divider */}
              <div className="h-px bg-[#cbd5e1]" />

              {/* Gap row */}
              <div className="flex h-6 items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-[#ef4444]" aria-hidden />
                  <p className="text-[14px] font-medium leading-[20px] tracking-[-0.15px] text-[#475569] dark:text-slate-300">
                    {t(`${P}fundingGap`)}
                  </p>
                </div>
                <p className="text-[16px] font-bold leading-[24px] tracking-[-0.31px] tabular-nums text-[#dc2626] dark:text-red-400">
                  ${formatCurrencyDetailed(annualSavingsGap)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-[13px] border-t border-[#cbd5e1] pt-[13px] pb-[13px]">
              <p className="text-[12px] font-normal leading-[19.5px] text-[#64748b] dark:text-slate-300">
                {t(`${P}fundingFooter`)}
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="min-w-0">
          <div className="flex flex-col gap-4">

            {/* "Recommended for You" banner */}
            {showRecommendedPanel ? (
              <div
                className="rounded-[16px] border-2 border-[#bedbff] px-[22px] pb-[18px] pt-[18px] dark:border-indigo-900/50"
                style={{ background: "linear-gradient(159.3deg, #eff6ff 0%, #eef2ff 50%, #faf5ff 100%)" }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#1c398e]" aria-hidden />
                    <p className="text-[14.4px] font-bold leading-[21.6px] tracking-[-0.18px] text-[#1c398e] dark:text-indigo-100">
                      {t(`${P}recommendedTitle`)}
                    </p>
                  </div>
                  <span className="rounded-[10px] bg-[#dcfce7] px-2 py-1 text-[12px] font-extrabold leading-[18px] text-[#008236]">
                    {t(`${P}scorePill`, { score: bestNewScore })}
                  </span>
                </div>
                <p className="mt-3 text-[12.8px] font-normal leading-[19.2px] tracking-[-0.06px] text-[#364153] dark:text-slate-300">
                  <Trans
                    i18nKey={`${P}recommendedBody`}
                    values={{ score: bestNewScore, points: boostPoints }}
                    components={{
                      new: <span className="font-semibold text-[#1447e6]" />,
                      pts: <span className="font-semibold text-[#1e2939] dark:text-slate-100" />,
                    }}
                  />
                </p>
              </div>
            ) : null}

            {/* "Optional ways to improve" heading */}
            <div className="flex flex-col gap-1">
              <p className="text-[15.2px] font-semibold leading-[22.8px] tracking-[-0.25px] text-[#101828] dark:text-slate-100">
                {t(`${P}optionalTitle`)}
              </p>
              <p className="text-[12px] font-normal leading-[18px] text-[#99a1af] dark:text-slate-400">
                {t(`${P}optionalSub`)}
              </p>
            </div>

            {/* Recommendation cards */}
            <div className="flex flex-col gap-[10px]">
              {orderedActionableRecs.map((rec, index) => {
                const isFeatured = index === 0;
                const { boxClass, iconClass, Icon } = recommendationVisual(rec.id);
                return (
                  <div
                    key={rec.id}
                    className={cn(
                      "rounded-[14px] p-px",
                      isFeatured
                        ? "border border-[#bedbff] bg-white shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40"
                        : "border border-[rgba(0,0,0,0.1)] bg-[rgba(249,250,251,0.6)] dark:border-slate-700 dark:bg-slate-900/40",
                    )}
                  >
                    <div className="flex flex-col px-4 pt-4">
                      {/* "RECOMMENDED" badge — first card only */}
                      {isFeatured ? (
                        <div className="mb-2 flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-[#155dfc]" aria-hidden />
                          <p className="text-[9.92px] font-semibold uppercase tracking-[0.52px] text-[#155dfc]">
                            {t(`${P}recBadge`)}
                          </p>
                        </div>
                      ) : null}

                      {/* Icon + title + description */}
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]",
                            isFeatured ? "bg-[#eff6ff]" : "bg-[#f3f4f6]",
                          )}
                        >
                          <Icon className={cn("h-4 w-4", iconClass)} aria-hidden strokeWidth={2.25} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[13.6px] font-semibold leading-[20.4px] tracking-[-0.12px] text-[#101828] dark:text-slate-50">
                            {rec.title}
                          </p>
                          <p className="mt-1 text-[12px] font-normal leading-[18px] text-[#6a7282] dark:text-slate-300">
                            {rec.description}
                          </p>

                          {/* Score / Savings / Balance metrics */}
                          <div className="mt-3 flex gap-6">
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[9.92px] font-medium tracking-[0.12px] text-[#99a1af]">
                                {t(`${P}metricScore`)}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-[13.6px] font-semibold tabular-nums text-[#99a1af]">{score}</span>
                                <ArrowRight className="h-3 w-3 text-[#99a1af]" aria-hidden />
                                <span className="text-[13.6px] font-bold tabular-nums text-[#008236]">{rec.newScore}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[9.92px] font-medium tracking-[0.12px] text-[#99a1af]">
                                {t(`${P}metricSavings`)}
                              </p>
                              <p className="text-[13.6px] font-bold tabular-nums text-[#1447e6]">
                                +${rec.additionalAnnualSavings.toLocaleString()}/yr
                              </p>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[9.92px] font-medium tracking-[0.12px] text-[#99a1af]">
                                {t(`${P}metricBalance`)}
                              </p>
                              <p className="text-[13.6px] font-bold tabular-nums text-[#101828] dark:text-slate-100">
                                {formatCurrency(rec.projectedBalanceAfter)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Per-card "Apply Recommendation" button */}
                      <button
                        type="button"
                        className="mb-3 mt-3 w-full rounded-[10px] border border-[#bedbff] bg-white py-2 text-[12.8px] font-semibold leading-[19.2px] tracking-[-0.06px] text-[#0a0a0a] transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                        onClick={() => applyRec(rec)}
                      >
                        {t(`${P}applyRec`)}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Fallback when no actionable recs */}
              {orderedActionableRecs.length === 0 ? (
                <div className="rounded-[14px] border border-[rgba(0,0,0,0.1)] bg-[rgba(249,250,251,0.6)] p-4 dark:border-slate-700 dark:bg-slate-900/40">
                  <p className="text-[13.6px] font-normal leading-[20.4px] text-[#6a7282] dark:text-slate-300">
                    {recommendations[0]?.description ?? t(`${P}fallbackRec`)}
                  </p>
                </div>
              ) : null}
            </div>

            {/* Primary + Secondary CTA */}
            {topActionableRec != null && topActionableRec.patch.kind !== "none" ? (
              <div className="flex flex-col gap-[10px] border-t border-[#e5e7eb] pt-[17px] dark:border-slate-700">
                <button
                  type="button"
                  className="flex h-[44px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#155dfc] text-[13.6px] font-semibold leading-[20.4px] tracking-[-0.12px] text-white shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)] transition-colors hover:bg-blue-700 active:scale-[0.99]"
                  onClick={() => applyRec(topActionableRec)}
                >
                  {t(`${P}applyRec`)} <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={handleContinueCustomAllocation}
                  className="flex h-[46px] w-full items-center justify-center rounded-[14px] border border-[#e5e7eb] bg-white px-[17px] py-[13px] text-[13.6px] font-semibold leading-[20.4px] tracking-[-0.12px] text-[#364153] transition-colors hover:bg-slate-50 active:scale-[0.99] dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                >
                  {t(`${P}continueCustomAllocation`)}
                </button>
              </div>
            ) : null}

          </div>
        </div>
      </div>
    </div>
  );
}
