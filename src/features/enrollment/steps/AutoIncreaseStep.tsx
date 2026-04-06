import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { motionTokens } from "@/features/crp-pre-enrollment/motion";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import type { IncrementCycle } from "../types";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import {
  computeProjectedBalancePure,
  getGrowthRate,
  projectBalanceWithAutoIncrease,
} from "../utils/calculations";

const W = "enrollment.v1.autoIncreaseWizard.";
const C = "enrollment.v1.autoIncreaseConfig.";

const ease = motionTokens.ease;
const RATES = [1, 2, 3] as const;
const MAX_CAP_MIN = 10;
const MAX_CAP_MAX = 15;

type Phase = "decision" | "config";

const CYCLE_OPTIONS: {
  value: IncrementCycle;
  titleKey: string;
  subKey: string;
}[] = [
  {
    value: "calendar",
    titleKey: `${C}cycleCalendarTitle`,
    subKey: `${C}cycleCalendarSub`,
  },
  {
    value: "participant",
    titleKey: `${C}cycleParticipantTitle`,
    subKey: `${C}cycleParticipantSub`,
  },
  {
    value: "plan",
    titleKey: `${C}cyclePlanTitle`,
    subKey: `${C}cyclePlanSub`,
  },
];

function clampRate(n: number): (typeof RATES)[number] {
  if (!Number.isFinite(n)) return 1;
  const r = Math.round(n);
  const clamped = Math.max(1, Math.min(3, r));
  return (RATES as readonly number[]).includes(clamped)
    ? (clamped as (typeof RATES)[number])
    : 1;
}

/**
 * Auto-increase wizard step — UI and flow aligned with core-retirement-platform
 * `AutoIncreaseClient`, themed with enrollment CSS variables for light/dark mode.
 */
export function AutoIncreaseStep() {
  const { t, i18n } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);

  const [phase, setPhase] = useState<Phase>(() =>
    data.autoIncrease ? "config" : "decision",
  );
  const [showSkipModal, setShowSkipModal] = useState(false);

  useEffect(() => {
    const r = data.autoIncreaseRate;
    if (!Number.isFinite(r) || r < 1 || r > 3 || Math.round(r) !== r) {
      updateField("autoIncreaseRate", clampRate(r));
    }
  }, [data.autoIncreaseRate, updateField]);

  const contributionPct = data.contribution;
  const years = Math.max(1, data.retirementAge - data.currentAge);
  const growthRate = getGrowthRate(data.riskLevel);
  const stepPct = clampRate(data.autoIncreaseRate);
  const autoIncreaseMax = Math.min(
    MAX_CAP_MAX,
    Math.max(MAX_CAP_MIN, data.autoIncreaseMax),
  );

  const fmtMoney = useCallback(
    (n: number) =>
      new Intl.NumberFormat(i18n.language, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.round(n)),
    [i18n.language],
  );

  const { baseBalance, boostedBalance, gain } = useMemo(() => {
    const base = computeProjectedBalancePure(
      data.salary,
      data.currentSavings,
      contributionPct,
      years,
      growthRate,
    );
    const boosted = projectBalanceWithAutoIncrease(
      data.salary,
      data.currentSavings,
      contributionPct,
      years,
      growthRate,
      stepPct,
      autoIncreaseMax,
    );
    return {
      baseBalance: base,
      boostedBalance: boosted,
      gain: boosted - base,
    };
  }, [
    data.salary,
    data.currentSavings,
    contributionPct,
    years,
    growthRate,
    stepPct,
    autoIncreaseMax,
  ]);

  const yearsToMax = useMemo(() => {
    if (stepPct <= 0) return 0;
    return Math.ceil((autoIncreaseMax - contributionPct) / stepPct);
  }, [autoIncreaseMax, contributionPct, stepPct]);

  const timeline = useMemo(() => {
    const steps: { year: number; pct: number }[] = [];
    let pct = contributionPct;
    const maxSteps = Math.min(yearsToMax + 1, 10);
    for (let y = 0; y < maxSteps; y++) {
      steps.push({ year: y, pct: Math.min(pct, autoIncreaseMax) });
      pct = Math.min(pct + stepPct, autoIncreaseMax);
    }
    return steps;
  }, [contributionPct, stepPct, autoIncreaseMax, yearsToMax]);

  const activeCycle = CYCLE_OPTIONS.find((c) => c.value === data.incrementCycle);
  const cycleLabel = activeCycle ? t(activeCycle.titleKey) : "";

  const handleEnable = useCallback(() => {
    updateField("autoIncreaseRate", stepPct);
    updateField("autoIncrease", true);
    const r = saveAutoIncreasePreference({ enabled: true, skipped: false });
    if (!r.ok && import.meta.env.DEV) {
      console.warn("[AutoIncreaseStep] save preference (enable):", r.error);
    }
    setPhase("config");
  }, [stepPct, updateField]);

  const handleOpenSkip = useCallback(() => setShowSkipModal(true), []);

  const confirmSkip = useCallback(() => {
    updateField("autoIncrease", false);
    updateField("autoIncreaseStepResolved", true);
    const r = saveAutoIncreasePreference({ enabled: false, skipped: true });
    if (!r.ok && import.meta.env.DEV) {
      console.warn("[AutoIncreaseStep] save preference (skip):", r.error);
    }
    setShowSkipModal(false);
  }, [updateField]);

  const handleDisableToDecision = useCallback(() => {
    updateField("autoIncrease", false);
    setPhase("decision");
  }, [updateField]);

  const setRate = useCallback(
    (r: (typeof RATES)[number]) => {
      updateField("autoIncreaseRate", r);
      updateField("autoIncrease", true);
    },
    [updateField],
  );

  const setCap = useCallback(
    (n: number) => {
      updateField(
        "autoIncreaseMax",
        Math.min(MAX_CAP_MAX, Math.max(MAX_CAP_MIN, n)),
      );
    },
    [updateField],
  );

  useEffect(() => {
    if (!showSkipModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowSkipModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showSkipModal]);

  const cardBase = {
    background: "var(--enroll-card-bg)",
    borderColor: "var(--enroll-card-border)",
  } as const;

  const successBorder =
    "color-mix(in srgb, var(--color-success) 45%, var(--enroll-card-border))";
  const successSurface =
    "color-mix(in srgb, var(--color-success) 10%, var(--enroll-card-bg))";
  const mutedLine = "color-mix(in srgb, var(--enroll-text-secondary) 35%, var(--enroll-card-border))";

  const configDuration =
    yearsToMax > 0
      ? t(`${W}configDurationYears`, { count: yearsToMax })
      : t(`${W}configDurationNone`);

  const sidebar = (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5 shadow-sm"
        style={{
          ...cardBase,
          border: "1px solid var(--enroll-card-border)",
          boxShadow: "var(--enroll-elevation-1)",
        }}
      >
        <h3
          className="mb-4 text-sm font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${W}sidebarProjectedTitle`)}
        </h3>
        <div
          className="flex items-center justify-between rounded-lg px-3 py-2.5"
          style={{
            background:
              "color-mix(in srgb, var(--enroll-text-secondary) 8%, var(--enroll-card-bg))",
          }}
        >
          <span
            className="text-xs"
            style={{ color: "var(--enroll-text-secondary)" }}
          >
            {t(`${W}sidebarWithout`)}
          </span>
          <span
            className="text-sm font-bold"
            style={{ color: "var(--enroll-text-primary)" }}
          >
            {fmtMoney(baseBalance)}
          </span>
        </div>
        <div
          className="mt-2 flex items-center justify-between rounded-lg border px-3 py-2.5"
          style={{
            borderColor: successBorder,
            background: successSurface,
          }}
        >
          <span className="text-xs" style={{ color: "var(--color-success)" }}>
            {t(`${W}sidebarWith`)}
          </span>
          <span className="text-sm font-bold" style={{ color: "var(--color-success)" }}>
            {fmtMoney(boostedBalance)}
          </span>
        </div>
        {gain > 0 && (
          <div
            className="mt-3 flex items-center justify-between pt-3"
            style={{
              borderTop: `1px solid ${mutedLine}`,
            }}
          >
            <span
              className="text-xs font-medium"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {t(`${W}sidebarDifference`)}
            </span>
            <span className="text-base font-bold" style={{ color: "var(--color-success)" }}>
              +{fmtMoney(gain)}
            </span>
          </div>
        )}
      </div>

      <div
        className="rounded-2xl p-5 shadow-sm"
        style={{
          ...cardBase,
          border: "1px solid var(--enroll-card-border)",
          boxShadow: "var(--enroll-elevation-1)",
        }}
      >
        <h3
          className="mb-3 text-sm font-semibold"
          style={{ color: "var(--enroll-text-primary)" }}
        >
          {t(`${W}sidebarSettingsTitle`)}
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--enroll-text-secondary)" }}>
              {t(`${W}settingCurrentRate`)}
            </span>
            <span
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {contributionPct}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--enroll-text-secondary)" }}>
              {t(`${W}settingIncreasePerCycle`)}
            </span>
            <span
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              +{stepPct}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--enroll-text-secondary)" }}>
              {t(`${W}settingMaxCap`)}
            </span>
            <span
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {autoIncreaseMax}%
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: "var(--enroll-text-secondary)" }}>
              {t(`${W}settingCycle`)}
            </span>
            <span
              className="font-semibold"
              style={{ color: "var(--enroll-text-primary)" }}
            >
              {cycleLabel}
            </span>
          </div>
          {yearsToMax > 0 && (
            <>
              <div className="h-px" style={{ background: mutedLine }} />
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--enroll-text-secondary)" }}>
                  {t(`${W}settingTimeToMax`)}
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {t(`${W}settingTimeToMaxVal`, { count: yearsToMax })}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="ew-step min-w-0 w-full" style={{ gap: 0 }}>
      <div className="mx-auto w-full max-w-[1100px] pb-2">
        <AnimatePresence mode="wait">
          {phase === "decision" ? (
            <motion.div
              key="decision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease }}
            >
              <div className="mb-6 text-left">
                <h1
                  className="text-xl font-semibold md:text-2xl"
                  style={{ color: "var(--enroll-text-primary)" }}
                >
                  {t(`${W}decisionTitle`)}
                </h1>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${W}decisionSubtitle`)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleOpenSkip}
                  className="group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-sm"
                  style={{
                    ...cardBase,
                    borderColor: "var(--enroll-card-border)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--enroll-text-muted)" }}
                  >
                    {t(`${W}fixedLabel`)}
                  </p>
                  <motion.p
                    key={`base-${Math.round(baseBalance / 1000)}`}
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-3xl font-bold"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {fmtMoney(baseBalance)}
                  </motion.p>
                  <p
                    className="mt-1.5 text-xs"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${W}fixedSub`, { percent: contributionPct })}
                  </p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium transition group-hover:opacity-90"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${W}skipCta`)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={handleEnable}
                  className="group relative rounded-2xl border-2 p-6 text-left transition-all duration-200 hover:shadow-md"
                  style={{
                    background: successSurface,
                    borderColor: successBorder,
                  }}
                >
                  <div className="absolute -top-2.5 right-4">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm"
                      style={{ background: "var(--color-success)" }}
                    >
                      <Sparkles className="size-2.5" aria-hidden />
                      {t(`${W}recommendedBadge`)}
                    </span>
                  </div>
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--enroll-text-muted)" }}
                  >
                    {t(`${W}autoLabel`)}
                  </p>
                  <motion.p
                    key={`boost-${Math.round(boostedBalance / 1000)}`}
                    initial={{ opacity: 0.4, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.22 }}
                    className="mt-3 text-3xl font-bold"
                    style={{ color: "var(--color-success)" }}
                  >
                    {fmtMoney(boostedBalance)}
                  </motion.p>
                  <p
                    className="mt-1.5 text-xs"
                    style={{ color: "var(--enroll-text-secondary)" }}
                  >
                    {t(`${W}autoSub`)}
                  </p>
                  <div
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold transition group-hover:opacity-90"
                    style={{ color: "var(--color-success)" }}
                  >
                    {t(`${W}enableCta`)}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </div>
                </button>
              </div>

              {gain > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.25 }}
                  className="mt-5 flex items-center gap-3 rounded-xl border px-4 py-3"
                  style={{
                    borderColor: successBorder,
                    background: successSurface,
                  }}
                >
                  <TrendingUp
                    className="size-4 shrink-0"
                    style={{ color: "var(--color-success)" }}
                    aria-hidden
                  />
                  <p className="text-sm" style={{ color: "var(--enroll-text-primary)" }}>
                    {t(`${W}insightLine`, { amount: `+${fmtMoney(gain)}` })}
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="config"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease }}
            >
              <div className="mb-6 text-left">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full"
                    style={{
                      background:
                        "color-mix(in srgb, var(--color-success) 18%, var(--enroll-card-bg))",
                    }}
                  >
                    <CheckCircle2
                      className="size-4"
                      style={{ color: "var(--color-success)" }}
                      aria-hidden
                    />
                  </div>
                  <div>
                    <h1
                      className="text-xl font-semibold md:text-2xl"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      {t(`${W}configEnabledTitle`)}
                    </h1>
                    <p
                      className="mt-0.5 text-sm"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      {t(`${W}configEnabledSubtitle`, {
                        from: contributionPct,
                        to: autoIncreaseMax,
                        duration: configDuration,
                      })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisableToDecision}
                  className="mt-3 text-xs font-medium underline-offset-4 transition hover:underline"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${W}disableLink`)}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
                <div className="min-w-0 space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04, duration: 0.25 }}
                    className="rounded-2xl border p-5 shadow-sm"
                    style={{
                      ...cardBase,
                      border: "1px solid var(--enroll-card-border)",
                      boxShadow: "var(--enroll-elevation-1)",
                    }}
                  >
                    <div
                      className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-[color:var(--enroll-card-border)] divide-[color:var(--enroll-card-border)]"
                    >
                      <div className="px-0 pb-3 sm:pb-0 sm:pr-4">
                        <p
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: "var(--enroll-text-muted)" }}
                        >
                          {t(`${W}statProjected`)}
                        </p>
                        <motion.p
                          key={`proj-${Math.round(boostedBalance / 1000)}`}
                          initial={{ opacity: 0.4 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-xl font-bold"
                          style={{ color: "var(--enroll-text-primary)" }}
                        >
                          {fmtMoney(boostedBalance)}
                        </motion.p>
                      </div>
                      <div className="px-0 py-3 sm:px-4 sm:py-0">
                        <p
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: "var(--color-success)" }}
                        >
                          {t(`${W}statGain`)}
                        </p>
                        <motion.p
                          key={`gain-${Math.round(gain / 1000)}`}
                          initial={{ opacity: 0.4 }}
                          animate={{ opacity: 1 }}
                          className="mt-1 text-xl font-bold"
                          style={{ color: "var(--color-success)" }}
                        >
                          +{fmtMoney(gain)}
                        </motion.p>
                      </div>
                      <div className="px-0 pt-3 sm:pl-4 sm:pt-0">
                        <p
                          className="text-[10px] font-medium uppercase tracking-wider"
                          style={{ color: "var(--enroll-text-muted)" }}
                        >
                          {t(`${W}statTimeToMax`)}
                        </p>
                        <p
                          className="mt-1 text-xl font-bold"
                          style={{ color: "var(--enroll-text-primary)" }}
                        >
                          {yearsToMax > 0
                            ? t(`${W}statTimeToMaxYr`, {
                                count: yearsToMax,
                              })
                            : t(`${W}statTimeToMaxDash`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="lg:hidden">{sidebar}</div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08, duration: 0.25 }}
                    className="rounded-2xl border p-5"
                    style={{
                      ...cardBase,
                      border: "1px solid var(--enroll-card-border)",
                    }}
                  >
                    <p
                      className="mb-1 text-sm font-semibold"
                      style={{ color: "var(--enroll-text-primary)" }}
                    >
                      {t(`${W}incrementTitle`)}
                    </p>
                    <p
                      className="mb-3 text-xs"
                      style={{ color: "var(--enroll-text-secondary)" }}
                    >
                      {t(`${W}incrementSub`)}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {CYCLE_OPTIONS.map((opt) => {
                        const active = data.incrementCycle === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateField("incrementCycle", opt.value)}
                            className="flex flex-col rounded-xl border p-3 text-left transition-all duration-150"
                            style={{
                              borderColor: active
                                ? "var(--enroll-brand)"
                                : "var(--enroll-card-border)",
                              borderWidth: active ? 2 : 1,
                              background: active
                                ? "color-mix(in srgb, var(--enroll-brand) 8%, var(--enroll-card-bg))"
                                : "var(--enroll-card-bg)",
                            }}
                          >
                            <span
                              className="text-sm font-medium"
                              style={{
                                color: active
                                  ? "var(--enroll-brand)"
                                  : "var(--enroll-text-primary)",
                              }}
                            >
                              {t(opt.titleKey)}
                            </span>
                            <span
                              className="mt-0.5 text-[11px]"
                              style={{ color: "var(--enroll-text-secondary)" }}
                            >
                              {t(opt.subKey)}
                            </span>
                            {active && (
                              <motion.span
                                layoutId="auto-increase-cycle-sel"
                                className="mt-1.5 flex items-center gap-1 text-[11px] font-medium"
                                style={{ color: "var(--enroll-brand)" }}
                              >
                                <CheckCircle2 className="size-3" aria-hidden />
                                {t(`${W}cycleSelected`)}
                              </motion.span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.25 }}
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                  >
                    <div
                      className="rounded-2xl border p-5"
                      style={{
                        ...cardBase,
                        border: "1px solid var(--enroll-card-border)",
                      }}
                    >
                      <p
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        {t(`${W}increasePerCycleTitle`)}
                      </p>
                      <p
                        className="mb-3 text-xs"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        {t(`${W}increasePerCycleSub`)}
                      </p>
                      <div className="flex gap-2">
                        {RATES.map((r) => (
                          <button
                            key={r}
                            type="button"
                            onClick={() => setRate(r)}
                            className="flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-150"
                            style={{
                              borderColor:
                                stepPct === r
                                  ? "var(--enroll-brand)"
                                  : "var(--enroll-card-border)",
                              borderWidth: stepPct === r ? 2 : 1,
                              background:
                                stepPct === r
                                  ? "var(--enroll-brand)"
                                  : "var(--enroll-card-bg)",
                              color:
                                stepPct === r
                                  ? "var(--color-text-on-primary)"
                                  : "var(--enroll-text-secondary)",
                            }}
                          >
                            {r}%
                          </button>
                        ))}
                      </div>
                      <input
                        type="range"
                        min={1}
                        max={3}
                        step={1}
                        value={stepPct}
                        onChange={(e) =>
                          setRate(
                            Number(e.target.value) as (typeof RATES)[number],
                          )
                        }
                        className="contribution-range mt-3 h-3 w-full min-w-0 cursor-pointer"
                        aria-label={t(`${W}rateAria`)}
                      />
                    </div>

                    <div
                      className="rounded-2xl border p-5"
                      style={{
                        ...cardBase,
                        border: "1px solid var(--enroll-card-border)",
                      }}
                    >
                      <p
                        className="mb-1 text-sm font-semibold"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        {t(`${W}maxCapTitle`)}
                      </p>
                      <p
                        className="mb-3 text-xs"
                        style={{ color: "var(--enroll-text-secondary)" }}
                      >
                        {t(`${W}maxCapSub`)}
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setCap(autoIncreaseMax - 1)}
                          disabled={autoIncreaseMax <= MAX_CAP_MIN}
                          className="flex size-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30"
                          style={{
                            borderColor: "var(--enroll-card-border)",
                            color: "var(--enroll-text-secondary)",
                            background: "var(--enroll-card-bg)",
                          }}
                        >
                          <Minus className="size-3.5" aria-hidden />
                        </button>
                        <motion.span
                          key={autoIncreaseMax}
                          initial={{ scale: 0.9, opacity: 0.4 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-3xl font-bold tabular-nums"
                          style={{ color: "var(--enroll-text-primary)" }}
                        >
                          {autoIncreaseMax}%
                        </motion.span>
                        <button
                          type="button"
                          onClick={() => setCap(autoIncreaseMax + 1)}
                          disabled={autoIncreaseMax >= MAX_CAP_MAX}
                          className="flex size-9 items-center justify-center rounded-lg border transition disabled:cursor-not-allowed disabled:opacity-30"
                          style={{
                            borderColor: "var(--enroll-card-border)",
                            color: "var(--enroll-text-secondary)",
                            background: "var(--enroll-card-bg)",
                          }}
                        >
                          <Plus className="size-3.5" aria-hidden />
                        </button>
                      </div>
                      <input
                        type="range"
                        min={MAX_CAP_MIN}
                        max={MAX_CAP_MAX}
                        step={1}
                        value={autoIncreaseMax}
                        onChange={(e) => setCap(Number(e.target.value))}
                        className="contribution-range mt-3 h-3 w-full min-w-0 cursor-pointer"
                        aria-label={t(`${W}capAria`)}
                      />
                      <div
                        className="mt-1 flex justify-between text-[10px]"
                        style={{ color: "var(--enroll-text-muted)" }}
                      >
                        <span>{MAX_CAP_MIN}%</span>
                        <span>{MAX_CAP_MAX}%</span>
                      </div>
                    </div>
                  </motion.div>

                  {yearsToMax > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.16, duration: 0.25 }}
                      className="rounded-2xl border p-5"
                      style={{
                        ...cardBase,
                        border: "1px solid var(--enroll-card-border)",
                      }}
                    >
                      <p
                        className="mb-4 text-sm font-semibold"
                        style={{ color: "var(--enroll-text-primary)" }}
                      >
                        {t(`${W}timelineTitle`)}
                      </p>
                      <div className="relative">
                        <div
                          className="absolute bottom-3 top-3 w-px"
                          style={{
                            left: 11,
                            background: "var(--enroll-card-border)",
                          }}
                          aria-hidden
                        />
                        <div className="space-y-0">
                          {timeline.map((step, i) => {
                            const isFirst = i === 0;
                            const isLast = step.pct >= autoIncreaseMax;
                            const barWidth = Math.max(
                              8,
                              ((step.pct - contributionPct) /
                                (autoIncreaseMax - contributionPct || 1)) *
                                100,
                            );
                            return (
                              <motion.div
                                key={step.year}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  delay: i * 0.05,
                                  duration: 0.25,
                                }}
                                className="flex items-center gap-3 py-1.5"
                              >
                                <div
                                  className="relative z-10 flex size-[22px] shrink-0 items-center justify-center rounded-full border-2"
                                  style={{
                                    borderColor: isLast
                                      ? "var(--color-success)"
                                      : isFirst
                                        ? "var(--enroll-brand)"
                                        : "var(--enroll-card-border)",
                                    background: isLast
                                      ? "var(--color-success)"
                                      : isFirst
                                        ? "var(--enroll-brand)"
                                        : "var(--enroll-card-bg)",
                                  }}
                                >
                                  {(isFirst || isLast) && (
                                    <Check
                                      className="size-3"
                                      style={{
                                        color: isLast
                                          ? "var(--color-text-on-primary)"
                                          : "var(--color-text-on-primary)",
                                      }}
                                      aria-hidden
                                    />
                                  )}
                                </div>
                                <span
                                  className="w-14 shrink-0 text-xs sm:w-12"
                                  style={{ color: "var(--enroll-text-secondary)" }}
                                >
                                  {isFirst
                                    ? t(`${W}timelineNow`)
                                    : t(`${W}timelineYear`, { n: step.year })}
                                </span>
                                <div className="flex min-w-0 flex-1 items-center gap-2">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${barWidth}%` }}
                                    transition={{
                                      delay: i * 0.05 + 0.1,
                                      duration: 0.4,
                                      ease: [0.4, 0, 0.2, 1],
                                    }}
                                    className="h-2 min-w-[8px] rounded-full"
                                    style={{
                                      background: isLast
                                        ? "var(--color-success)"
                                        : "color-mix(in srgb, var(--enroll-brand) 55%, transparent)",
                                    }}
                                  />
                                  <span
                                    className="shrink-0 text-xs font-bold tabular-nums"
                                    style={{
                                      color: isLast
                                        ? "var(--color-success)"
                                        : "var(--enroll-text-primary)",
                                    }}
                                  >
                                    {step.pct}%
                                  </span>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="hidden min-w-0 lg:block">
                  <div className="lg:sticky lg:top-2">{sidebar}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showSkipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: "color-mix(in srgb, var(--color-background) 0%, black 45%)" }}
            onClick={() => setShowSkipModal(false)}
            role="presentation"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto w-full max-w-md rounded-2xl border p-6 shadow-2xl"
              style={{
                background: "var(--enroll-card-bg)",
                borderColor: "var(--enroll-card-border)",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="auto-increase-skip-wizard-title"
            >
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "color-mix(in srgb, var(--color-error) 12%, var(--enroll-card-bg))",
                  }}
                >
                  <AlertTriangle
                    className="size-5"
                    style={{ color: "var(--color-error)" }}
                    aria-hidden
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowSkipModal(false)}
                  aria-label={t(`${W}closeAria`)}
                  className="rounded-lg p-1 transition hover:opacity-80"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>

              <h2
                id="auto-increase-skip-wizard-title"
                className="text-lg font-semibold"
                style={{ color: "var(--enroll-text-primary)" }}
              >
                {t(`${W}skipModalTitle`)}
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--enroll-text-secondary)" }}
              >
                {t(`${W}skipModalSubtitle`, { years })}
              </p>

              <div
                className="mt-4 rounded-xl border-2 p-4"
                style={{
                  borderColor:
                    "color-mix(in srgb, var(--color-error) 35%, var(--enroll-card-border))",
                  background:
                    "color-mix(in srgb, var(--color-error) 8%, var(--enroll-card-bg))",
                }}
              >
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--color-error)" }}
                >
                  {t(`${W}skipModalImpactTitle`)}
                </p>
                <p
                  className="mt-1 text-3xl font-bold"
                  style={{ color: "var(--color-error)" }}
                >
                  −{fmtMoney(gain)}
                </p>
                <p
                  className="mt-0.5 text-xs"
                  style={{ color: "var(--enroll-text-secondary)" }}
                >
                  {t(`${W}skipModalImpactSub`)}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="rounded-lg p-3"
                  style={{
                    background:
                      "color-mix(in srgb, var(--enroll-text-secondary) 8%, var(--enroll-card-bg))",
                  }}
                >
                  <p
                    className="text-[10px] uppercase"
                    style={{ color: "var(--enroll-text-muted)" }}
                  >
                    {t(`${W}skipModalCardWithout`)}
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--enroll-text-primary)" }}
                  >
                    {fmtMoney(baseBalance)}
                  </p>
                </div>
                <div
                  className="rounded-lg border p-3"
                  style={{
                    borderColor: successBorder,
                    background: successSurface,
                  }}
                >
                  <p
                    className="text-[10px] uppercase"
                    style={{ color: "var(--color-success)" }}
                  >
                    {t(`${W}skipModalCardWith`)}
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--color-success)" }}
                  >
                    {fmtMoney(boostedBalance)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={confirmSkip}
                  className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition hover:opacity-90"
                  style={{
                    borderColor: "var(--enroll-card-border)",
                    color: "var(--enroll-text-secondary)",
                    background: "var(--enroll-card-bg)",
                  }}
                >
                  {t(`${W}skipModalSkipAnyway`)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateField("autoIncrease", true);
                    const r = saveAutoIncreasePreference({
                      enabled: true,
                      skipped: false,
                    });
                    if (!r.ok && import.meta.env.DEV) {
                      console.warn(
                        "[AutoIncreaseStep] save preference (modal enable):",
                        r.error,
                      );
                    }
                    setShowSkipModal(false);
                    setPhase("config");
                  }}
                  className="flex-1 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-90"
                  style={{
                    background: "var(--enroll-brand)",
                    color: "var(--color-text-on-primary)",
                  }}
                >
                  {t(`${W}skipModalEnable`)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
