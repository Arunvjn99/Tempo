import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Award, DollarSign, Info, Sparkles } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
import { computeMockRetirementProjection } from "../flow/projection";
import {
  computeProjectedBalancePure,
  computeReadinessScore,
  getGrowthRate,
} from "../flow/readinessMetrics";
import {
  generateRecommendations,
  type GeneratedRecommendation,
  type ReadinessApplyPatch,
} from "../flow/readinessRecommendations";
import { cn } from "@/lib/utils";

/** Participant benchmark shown in UI (Figma reference). */
const READINESS_BENCHMARK = 85;

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;

function AnimatedScoreRing({
  value,
  strokeClass,
  displayClass,
}: {
  value: number;
  strokeClass: string;
  displayClass: string;
}) {
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
        <circle cx="80" cy="80" r={RING_R} fill="none" className="score-ring-track" strokeWidth="10" />
        <circle
          cx="80"
          cy="80"
          r={RING_R}
          fill="none"
          className={strokeClass}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="absolute inset-0 flex rotate-90 flex-col items-center justify-center">
        <span className={cn("text-4xl font-bold tabular-nums sm:text-5xl", displayClass)}>{displayValue}</span>
        <span className="text-xs text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
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

function statusMessage(score: number): string {
  if (score >= 80) return "You're on a great track!";
  if (score >= 60) return "You're building a solid foundation.";
  if (score >= 40) return "You're getting started — keep going!";
  return "Every step counts toward your goal.";
}

export function RetirementReadiness() {
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);
  const growthRate = getGrowthRate(data.riskLevel);

  const matchPercent = Math.min(data.contribution, 6);
  const annualEmployee = Math.round((data.salary * data.contribution) / 100);
  const annualEmployer = Math.round((data.salary * matchPercent) / 100);
  const totalAnnualContributions = annualEmployee + annualEmployer;

  const projectedBalance = computeProjectedBalancePure(
    data.salary,
    data.currentSavings,
    data.contribution,
    yearsToRetirement,
    growthRate,
  );

  const score = computeReadinessScore(
    data.contribution,
    data.autoIncrease,
    data.riskLevel,
    yearsToRetirement,
    data.currentSavings,
  );

  const retirementIncomeGoalAnnual = Math.round(projectedBalance * 0.03);
  const annualSavingsGap = Math.max(0, retirementIncomeGoalAnnual - totalAnnualContributions);

  const formatCurrency = (val: number) => {
    if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}M`;
    if (val >= 1_000) return `$${Math.round(val / 1_000).toLocaleString()}K`;
    return `$${Math.round(val).toLocaleString()}`;
  };

  const formatCurrencyDetailed = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  const recommendations = useMemo(
    () =>
      generateRecommendations(data, appliedIds, {
        score,
        projectedBalance,
        yearsToRetirement,
      }),
    [appliedIds, data, projectedBalance, score, yearsToRetirement],
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

  useEffect(() => {
    const p = computeMockRetirementProjection(data.contribution, data.riskLevel);
    const { retirementProjection: rp } = useEnrollmentStore.getState();
    if (rp.estimatedValue === p.estimatedValue && rp.monthlyIncome === p.monthlyIncome) return;
    updateField("retirementProjection", p);
  }, [data.contribution, data.riskLevel, updateField]);

  const applyRec = (rec: GeneratedRecommendation) => {
    if (rec.patch.kind === "none") return;
    if (!window.confirm("Apply this recommendation to your enrollment selections?")) return;
    applyEnrollmentPatch(rec.patch, updateField);
    setAppliedIds((prev) => (prev.includes(rec.id) ? prev : [...prev, rec.id]));
  };

  const alertIsCritical = score < 40;
  const strokeClass = alertIsCritical
    ? "stroke-[var(--color-danger)]"
    : score <= 70
      ? "stroke-[var(--color-warning)]"
      : "stroke-[var(--color-success)]";
  const displayClass = alertIsCritical
    ? "text-[var(--color-danger)]"
    : score <= 70
      ? "text-[var(--color-warning)]"
      : "text-[var(--color-success)]";

  const understandingCopy = `Your score of ${score} is based on contributions, timeline, and projected growth — there is room to improve.`;

  const targetBarPct = Math.min(100, Math.round((score / READINESS_BENCHMARK) * 100));

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-5">
        <h1 className="text-2xl font-semibold text-foreground">Your Retirement Readiness</h1>
        <p className="mt-1 text-sm text-muted-foreground md:text-base">
          Here&apos;s how your choices add up before you finalize.
        </p>
      </header>

      <div className="grid items-start gap-6 md:grid-cols-[1fr_min(22rem,100%)] lg:grid-cols-[1fr_24rem]">
        {/* ── Left: score hero + understanding + funding (Figma) ── */}
        <div className="min-w-0 space-y-5">
          <div className="card p-6">
            <div className="flex flex-col items-center">
              <div className="readiness-score-visual relative">
                <div className="readiness-score-glow" aria-hidden />
                <div className="readiness-score-deco" aria-hidden>
                  <svg viewBox="0 0 160 160" fill="none">
                    <circle
                      cx="80"
                      cy="80"
                      r="74"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeDasharray="4 10"
                      className="text-border opacity-80"
                    />
                  </svg>
                </div>
                <AnimatedScoreRing value={score} strokeClass={strokeClass} displayClass={displayClass} />
              </div>

              <p className="mt-4 text-center text-base font-semibold text-foreground">{statusMessage(score)}</p>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                You are <span className="font-semibold text-foreground">{score}%</span> on track for your retirement
                goal.
              </p>
              <p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">
                Most participants your age aim for a readiness score of {READINESS_BENCHMARK} or higher.
              </p>

              <div className="readiness-target-bar w-full max-w-xs">
                <div className="readiness-target-bar__track flex-1">
                  <div className="readiness-target-bar__fill" style={{ width: `${targetBarPct}%` }} />
                </div>
                <span className="readiness-target-bar__label">
                  Target: <span className="font-semibold text-foreground">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            <div className="my-5 border-t border-border" />

            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-xs font-medium text-muted-foreground">Projected retirement balance</p>
              </div>
              <p className="text-3xl font-bold tabular-nums text-foreground sm:text-[1.8rem]">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                In {yearsToRetirement} years with your current contribution and investment strategy.
              </p>
            </div>
          </div>

          <div className="readiness-understanding-card">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <h3 className="text-base font-semibold text-foreground">Understanding Your Score</h3>
                <p className="mt-1 text-sm text-muted-foreground">{understandingCopy}</p>
              </div>
            </div>
          </div>

          <div className="readiness-funding-card">
            <h3 className="readiness-funding-card__title">Annual Funding Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-tertiary h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">Retirement Income Goal</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Current Annual Contributions</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-primary">
                  {formatCurrencyDetailed(totalAnnualContributions)}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-danger h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">Annual Savings Gap</span>
                </div>
                <span className="text-danger-token shrink-0 font-semibold tabular-nums">
                  {formatCurrencyDetailed(annualSavingsGap)}
                </span>
              </div>
            </div>
            <p className="readiness-funding-card__footer">
              This shows the gap between your retirement income goal and current annual contributions. Close this gap by
              increasing contributions or adjusting your retirement timeline.
            </p>
          </div>
        </div>

        {/* ── Right: reference section (Recommended + optional improvements) ── */}
        <div className="min-w-0 space-y-4">
          {showRecommendedPanel ? (
            <div className="readiness-recommended-panel">
              <div className="readiness-recommended-panel__title-row">
                <p className="readiness-recommended-panel__title">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  Recommended for You
                </p>
                <span className="readiness-recommended-panel__score-pill">Score: {bestNewScore}</span>
              </div>
              <p className="readiness-recommended-panel__body">
                You can reach a score of <span className="font-semibold text-primary">{bestNewScore}</span> — apply the
                recommendations below to boost your readiness by{" "}
                <span className="font-semibold text-foreground">+{boostPoints} points</span>.
              </p>
            </div>
          ) : null}

          {actionableRecs.length > 0 ? (
            <div>
              <div className="readiness-rec-list-header mb-3">
                <p className="readiness-rec-list-header__title">Optional ways to improve your readiness</p>
                <p className="readiness-rec-list-header__sub">
                  You can apply one of these improvements to increase your retirement readiness score.
                </p>
              </div>
              <div className="space-y-2.5">
                {actionableRecs.map((rec, index) => {
                  const Icon = rec.Icon;
                  const isFeatured = index === 0;
                  return (
                    <div
                      key={rec.id}
                      className={cn("readiness-rec-card", isFeatured && "readiness-rec-card--featured")}
                    >
                      <div className="readiness-rec-card__inner">
                        {isFeatured ? (
                          <div className="readiness-rec-badge">
                            <Award className="h-3 w-3" aria-hidden />
                            Recommended
                          </div>
                        ) : null}
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                              isFeatured ? "bg-[color-mix(in_srgb,var(--primary)_10%,var(--muted))]" : "bg-muted",
                            )}
                          >
                            <Icon className={cn("h-4 w-4", isFeatured ? "text-primary" : "text-muted-foreground")} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-foreground">{rec.title}</p>
                            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{rec.description}</p>
                            <div className="readiness-rec-metrics">
                              <div>
                                <p className="readiness-rec-metrics__label">Score</p>
                                <div className="readiness-rec-metrics__value-row">
                                  <span className="tabular-nums text-sm font-semibold text-muted-foreground">{score}</span>
                                  <ArrowRight className="h-3 w-3 text-border" aria-hidden />
                                  <span className="tabular-nums text-sm font-bold text-[var(--color-success)]">
                                    {rec.newScore}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="readiness-rec-metrics__label">Savings</p>
                                <p className="readiness-rec-metrics__value-row text-sm font-bold text-primary">
                                  +${rec.additionalAnnualSavings.toLocaleString()}/yr
                                </p>
                              </div>
                              <div>
                                <p className="readiness-rec-metrics__label">Balance</p>
                                <p className="readiness-rec-metrics__value-row text-sm font-bold tabular-nums text-foreground">
                                  {formatCurrency(rec.projectedBalanceAfter)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button type="button" className="readiness-rec-apply" onClick={() => applyRec(rec)}>
                          Apply Recommendation
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card card--pad-sm">
              <p className="text-sm text-muted-foreground">
                {recommendations[0]?.description ??
                  "Walk through contributions and investment strategy with your goals in mind before you enroll."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
