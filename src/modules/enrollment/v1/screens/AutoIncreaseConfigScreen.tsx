import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import type { IncrementCycle } from "../store/useEnrollmentStore";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { isEnrollmentStepValid } from "../flow/stepValidation";
import { AutoIncreaseInsights } from "../components/AutoIncreaseInsights";

const AUTO_INCREASE_STEP_INDEX = ENROLLMENT_STEPS.indexOf("autoIncrease");
const C = "enrollment.v1.autoIncreaseConfig.";

/**
 * V1 Auto Increase setup — 8/4 grid (Figma `auto-increase-setup`), insights rail + timeline.
 */
export function AutoIncreaseConfigScreen() {
  const { t } = useTranslation();
  const data = useEnrollmentStore();
  const updateField = useEnrollmentStore((s) => s.updateField);

  const [increaseAmount, setIncreaseAmount] = useState(() =>
    Math.min(3, Math.max(0, data.autoIncreaseRate ?? 1)),
  );
  const [maxContribution, setMaxContribution] = useState(
    Math.min(Math.max(data.autoIncreaseMax, 10), 15),
  );
  const [incrementCycle, setIncrementCycle] = useState<IncrementCycle>(data.incrementCycle);

  useEffect(() => {
    setIncreaseAmount(Math.min(3, Math.max(0, data.autoIncreaseRate ?? 0)));
    setMaxContribution(Math.min(Math.max(data.autoIncreaseMax, 10), 15));
    setIncrementCycle(data.incrementCycle);
  }, [data.autoIncreaseRate, data.autoIncreaseMax, data.incrementCycle]);

  const currentPercent = data.contribution;
  const salary = data.salary;
  const currentMonthlyContribution = Math.round((salary * currentPercent) / 100 / 12);

  const yearsToMax =
    currentPercent >= maxContribution || increaseAmount <= 0
      ? 0
      : Math.ceil((maxContribution - currentPercent) / increaseAmount);

  const increaseRangePct = `${(increaseAmount / 3) * 100}%`;
  const maxRangePct = `${((maxContribution - 10) / 5) * 100}%`;

  const valid = useMemo(() => {
    const snapshot = useEnrollmentStore.getState();
    return isEnrollmentStepValid(AUTO_INCREASE_STEP_INDEX, {
      ...snapshot,
      autoIncreaseRate: increaseAmount,
      autoIncreaseMax: maxContribution,
      incrementCycle,
      autoIncrease: true,
    });
  }, [increaseAmount, maxContribution, incrementCycle]);

  useEffect(() => {
    updateField("autoIncreaseRate", increaseAmount);
    updateField("autoIncreaseMax", maxContribution);
    updateField("incrementCycle", incrementCycle);
    updateField("autoIncrease", true);
    updateField("autoIncreaseStepResolved", valid);
  }, [increaseAmount, maxContribution, incrementCycle, valid, updateField]);

  const cycleOptions = (
    [
      { id: "calendar" as const, title: t(`${C}cycleCalendarTitle`), sub: t(`${C}cycleCalendarSub`) },
      { id: "participant" as const, title: t(`${C}cycleParticipantTitle`), sub: t(`${C}cycleParticipantSub`) },
      { id: "plan" as const, title: t(`${C}cyclePlanTitle`), sub: t(`${C}cyclePlanSub`) },
    ] satisfies { id: IncrementCycle; title: string; sub: string }[]
  ).map((opt) => (
    <label
      key={opt.id}
      className={cn(
        "flex min-w-0 cursor-pointer flex-col gap-2 rounded-xl border-2 p-3 transition-colors",
        incrementCycle === opt.id ? "border-[var(--primary)]" : "border-[var(--border-subtle)] hover:opacity-90",
      )}
      style={
        incrementCycle === opt.id
          ? { background: "color-mix(in srgb, var(--primary) 8%, var(--color-background))" }
          : { background: "var(--color-background)" }
      }
    >
      <div className="flex items-center gap-2">
        <span className="relative flex h-4 w-4 shrink-0 items-center justify-center rounded-full has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-primary)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--color-background)]">
          <input
            type="radio"
            name="increment-cycle-config"
            checked={incrementCycle === opt.id}
            onChange={() => setIncrementCycle(opt.id)}
            className="absolute inset-0 z-[1] h-full w-full cursor-pointer opacity-0"
          />
          <span
            className={cn(
              "pointer-events-none flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors",
              incrementCycle === opt.id
                ? "border-[var(--color-primary)]"
                : "border-[var(--color-border)] bg-transparent",
            )}
            aria-hidden
          >
            {incrementCycle === opt.id ? (
              <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
            ) : null}
          </span>
        </span>
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          <span className="mr-1.5" aria-hidden>
            {opt.id === "calendar" ? "📅" : opt.id === "participant" ? "👤" : "📋"}
          </span>
          {opt.title}
        </p>
      </div>
      <p className="ml-6 text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
        {opt.sub}
      </p>
    </label>
  ));

  return (
    <div className="w-full min-w-0 space-y-4 text-left">
      <div className="mb-4 flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <div className="success-icon-soft flex items-center justify-center text-base leading-none">
              <span aria-hidden>📈</span>
            </div>
            <h1 className="text-2xl font-semibold leading-tight" style={{ color: "var(--text-primary)" }}>
              {t(`${C}title`)}
            </h1>
          </div>
          <p className="text-sm leading-snug" style={{ color: "var(--text-muted)" }}>
            {t(`${C}subtitle`)}
          </p>
        </div>
        <div className="auto-increase-metrics-card flex min-w-0 w-full flex-wrap gap-4 px-4 py-3 lg:w-auto lg:max-w-full lg:shrink-0">
          <div>
            <p
              className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              {t(`${C}current`)}
            </p>
            <p className="text-2xl font-extrabold leading-none" style={{ color: "var(--text-primary)" }}>
              {currentPercent}%
            </p>
            <p className="mt-1 text-[0.7rem] font-medium" style={{ color: "var(--primary)" }}>
              {t(`${C}perMo`, { amount: `$${currentMonthlyContribution.toLocaleString()}` })}
            </p>
          </div>
          <div className="auto-increase-metrics-card__divider min-h-[2.5rem] border-l pl-4">
            <p
              className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              {t(`${C}targetMax`)}
            </p>
            <p className="text-2xl font-extrabold leading-none" style={{ color: "var(--text-primary)" }}>
              {maxContribution}%
            </p>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 grid-cols-12 gap-4">
        <div className="col-span-12 min-w-0 space-y-3 lg:col-span-8">
          <div className="auto-increase-config-card p-4">
            <h3 className="mb-2.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
              {t(`${C}incrementCycle`)}
            </h3>
            <div className="grid min-w-0 gap-3 sm:grid-cols-3">{cycleOptions}</div>
          </div>

          <div className="auto-increase-config-card p-4">
            <div className="flex gap-3">
              <div className="icon-box-soft flex items-center justify-center text-base leading-none">
                <span aria-hidden>📅</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {t(`${C}increasePerCycle`)}
                </span>
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
                    <span>{t(`${C}range0`)}</span>
                    <span className="text-sm font-bold tabular-nums" style={{ color: "var(--primary)" }}>
                      {t(`${C}perCycleValue`, { value: increaseAmount })}
                    </span>
                    <span>{t(`${C}range3`)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={0.5}
                    value={increaseAmount}
                    onChange={(e) => setIncreaseAmount(parseFloat(e.target.value))}
                    className="enroll-range"
                    style={{ "--range-pct": increaseRangePct } as CSSProperties}
                  />
                </div>
                <div className="mt-2 flex gap-2">
                  {[1, 2, 3].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setIncreaseAmount(opt)}
                      className={cn("chip flex-1", increaseAmount === opt && "chip-active")}
                    >
                      {opt}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="auto-increase-config-card p-4">
            <div className="flex gap-3">
              <div className="icon-box-target flex items-center justify-center text-base leading-none">
                <span aria-hidden>🎯</span>
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {t(`${C}stopLimit`)}
                </span>
                <p className="mt-0.5 text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
                  {t(`${C}stopLimitDesc`)}
                </p>
                <div className="mt-4">
                  <div className="mb-1.5 flex items-center justify-between text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
                    <span>{t(`${C}range10`)}</span>
                    <span className="text-base font-bold tabular-nums text-accent-chart5-lg">{maxContribution}%</span>
                    <span>{t(`${C}range15`)}</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={15}
                    step={1}
                    value={maxContribution}
                    onChange={(e) => setMaxContribution(parseInt(e.target.value, 10))}
                    className="enroll-range enroll-range--secondary-accent"
                    style={{ "--range-pct": maxRangePct } as CSSProperties}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5 px-0 py-2.5 sm:px-0">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-foreground-secondary"
              aria-hidden
            >
              <Info className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </span>
            <div className="min-w-0 flex-1 space-y-2 text-[0.78rem] text-foreground-secondary [overflow-wrap:anywhere]">
              <p className="m-0">{t(`${C}infoP1`)}</p>
              <p className="m-0 font-medium text-foreground">
                {currentPercent >= maxContribution ? (
                  t(`${C}atMax`)
                ) : increaseAmount <= 0 ? (
                  t(`${C}chooseIncrease`)
                ) : (
                  t(`${C}growthYears`, {
                    count: yearsToMax,
                    from: currentPercent,
                    to: maxContribution,
                  })
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-12 min-w-0 lg:col-span-4">
          <AutoIncreaseInsights
            currentPercent={currentPercent}
            increasePerCycle={increaseAmount}
            maxContribution={maxContribution}
            incrementCycle={incrementCycle}
            salary={salary}
            riskLevel={data.riskLevel}
            currentSavings={data.currentSavings}
            retirementAge={data.retirementAge}
            currentAge={data.currentAge}
          />
        </div>
      </div>
    </div>
  );
}
