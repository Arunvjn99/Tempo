import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ArrowRight, Award, DollarSign, Info, Sparkles } from "lucide-react";
import { useEnrollmentStore, type EnrollmentV1Store } from "../store/useEnrollmentStore";
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
const P = "enrollment.v1.readiness.";

function AnimatedScoreRing({
  value,
  strokeClass,
  displayClass,
}: {
  value: number;
  strokeClass: string;
  displayClass: string;
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
        <span className={cn("text-3xl font-bold tabular-nums sm:text-4xl", displayClass)}>{displayValue}</span>
        <span className="text-xs text-muted-foreground">{t(`${P}outOf100`)}</span>
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

export function RetirementReadiness() {
  const { t } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const yearsToRetirement = Math.max(0, data.retirementAge - data.currentAge);

  const projectedBalance = data.projectedBalance;
  const score = data.readinessScore;

  const totalAnnualContributions = Math.round(data.monthlyContribution * 12 + data.employerMatch * 12);

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

  const targetBarPct = Math.min(100, Math.round((score / READINESS_BENCHMARK) * 100));

  const statusMessage = (s: number) => {
    if (s >= 80) return t(`${P}statusGreat`);
    if (s >= 70) return t(`${P}statusSolid`);
    if (s >= 40) return t(`${P}statusStarted`);
    return t(`${P}statusEveryStep`);
  };

  return (
    <div className="w-full min-w-0 space-y-4 text-left">
      <header className="mb-1">
        <h1 className="text-2xl font-semibold leading-tight text-foreground">{t(`${P}pageTitle`)}</h1>
        <p className="mt-1 text-sm leading-snug text-muted-foreground">{t(`${P}pageSubtitle`)}</p>
      </header>

      <div className="grid min-w-0 items-start gap-4 md:grid-cols-[minmax(0,1fr)_min(22rem,100%)] lg:grid-cols-[minmax(0,1fr)_24rem]">
        {/* ── Left: score hero + understanding + funding (Figma) ── */}
        <div className="min-w-0 space-y-4">
          <div className="card rounded-xl border p-5 shadow-sm">
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

              <p className="mt-3 text-center text-sm font-semibold text-foreground">{statusMessage(score)}</p>
              <p className="mt-1 text-center text-sm text-muted-foreground">
                <Trans
                  i18nKey={`${P}onTrackLine`}
                  values={{ score }}
                  components={{ score: <span className="font-semibold text-foreground" /> }}
                />
              </p>
              <p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">
                {t(`${P}benchmarkLine`, { benchmark: READINESS_BENCHMARK })}
              </p>

              <div className="readiness-target-bar w-full max-w-xs">
                <div className="readiness-target-bar__track flex-1">
                  <div className="readiness-target-bar__fill" style={{ width: `${targetBarPct}%` }} />
                </div>
                <span className="readiness-target-bar__label">
                  {t(`${P}target`)}{" "}
                  <span className="font-semibold text-foreground">{READINESS_BENCHMARK}</span>
                </span>
              </div>
            </div>

            <div className="my-4 border-t border-border" />

            <div className="text-center">
              <div className="mb-1 flex items-center justify-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" aria-hidden />
                <p className="text-xs font-medium text-muted-foreground">{t(`${P}projectedBalanceLabel`)}</p>
              </div>
              <p className="text-3xl font-bold tabular-nums text-foreground sm:text-[1.8rem]">
                {formatCurrency(projectedBalance)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`${P}projectedBalanceSub`, { years: yearsToRetirement })}
              </p>
            </div>
          </div>

          <div className="readiness-understanding-card">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div>
                <h3 className="text-base font-semibold text-foreground">{t(`${P}understandingTitle`)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t(`${P}understandingBody`, { score })}</p>
              </div>
            </div>
          </div>

          <div className="readiness-funding-card">
            <h3 className="readiness-funding-card__title">{t(`${P}fundingTitle`)}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-tertiary h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">{t(`${P}fundingGoal`)}</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">
                  {formatCurrencyDetailed(retirementIncomeGoalAnnual)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-3 w-3 shrink-0 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{t(`${P}fundingCurrent`)}</span>
                </div>
                <span className="shrink-0 font-semibold tabular-nums text-primary">
                  {formatCurrencyDetailed(totalAnnualContributions)}
                </span>
              </div>
              <div className="border-t border-border" />
              <div className="flex items-center justify-between gap-3 text-sm">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="metric-dot-danger h-3 w-3 shrink-0 rounded-full" />
                  <span className="text-muted-foreground">{t(`${P}fundingGap`)}</span>
                </div>
                <span className="text-danger-token shrink-0 font-semibold tabular-nums">
                  {formatCurrencyDetailed(annualSavingsGap)}
                </span>
              </div>
            </div>
            <p className="readiness-funding-card__footer">{t(`${P}fundingFooter`)}</p>
          </div>
        </div>

        {/* ── Right: reference section (Recommended + optional improvements) ── */}
        <div className="min-w-0 space-y-3">
          {showRecommendedPanel ? (
            <div className="readiness-recommended-panel">
              <div className="readiness-recommended-panel__title-row">
                <p className="readiness-recommended-panel__title">
                  <Sparkles className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {t(`${P}recommendedTitle`)}
                </p>
                <span className="readiness-recommended-panel__score-pill">
                  {t(`${P}scorePill`, { score: bestNewScore })}
                </span>
              </div>
              <p className="readiness-recommended-panel__body">
                <Trans
                  i18nKey={`${P}recommendedBody`}
                  values={{ score: bestNewScore, points: boostPoints }}
                  components={{
                    new: <span className="font-semibold text-primary" />,
                    pts: <span className="font-semibold text-foreground" />,
                  }}
                />
              </p>
            </div>
          ) : null}

          {actionableRecs.length > 0 ? (
            <div>
              <div className="readiness-rec-list-header mb-3">
                <p className="readiness-rec-list-header__title">{t(`${P}optionalTitle`)}</p>
                <p className="readiness-rec-list-header__sub">{t(`${P}optionalSub`)}</p>
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
                            {t(`${P}recBadge`)}
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
                                <p className="readiness-rec-metrics__label">{t(`${P}metricScore`)}</p>
                                <div className="readiness-rec-metrics__value-row">
                                  <span className="tabular-nums text-sm font-semibold text-muted-foreground">{score}</span>
                                  <ArrowRight className="h-3 w-3 text-border" aria-hidden />
                                  <span className="tabular-nums text-sm font-bold text-[var(--color-success)]">
                                    {rec.newScore}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="readiness-rec-metrics__label">{t(`${P}metricSavings`)}</p>
                                <p className="readiness-rec-metrics__value-row text-sm font-bold text-primary">
                                  {t(`${P}savingsPerYr`, {
                                    amount: `$${rec.additionalAnnualSavings.toLocaleString()}`,
                                  })}
                                </p>
                              </div>
                              <div>
                                <p className="readiness-rec-metrics__label">{t(`${P}metricBalance`)}</p>
                                <p className="readiness-rec-metrics__value-row text-sm font-bold tabular-nums text-foreground">
                                  {formatCurrency(rec.projectedBalanceAfter)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button type="button" className="readiness-rec-apply" onClick={() => applyRec(rec)}>
                          {t(`${P}applyRec`)}
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
                {recommendations[0]?.description ?? t(`${P}fallbackRec`)}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
