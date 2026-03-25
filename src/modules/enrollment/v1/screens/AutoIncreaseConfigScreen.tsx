import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { ArrowRight, Calendar, Info, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveAutoIncreasePreference } from "@/services/enrollmentService";
import { useEnrollmentStore } from "../store/useEnrollmentStore";
import type { IncrementCycle } from "../store/useEnrollmentStore";
import { ENROLLMENT_STEPS } from "../flow/steps";
import { isEnrollmentStepValid } from "../flow/stepValidation";
import { AutoIncreaseInsights } from "../components/AutoIncreaseInsights";

const AUTO_INCREASE_STEP_INDEX = ENROLLMENT_STEPS.indexOf("autoIncrease");

/**
 * V1 Auto Increase setup — 8/4 grid (Figma `auto-increase-setup`), insights rail + timeline.
 */
export function AutoIncreaseConfigScreen() {
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

  const handleSaveAutoIncrease = () => {
    if (!valid || increaseAmount <= 0) return;
    const r = saveAutoIncreasePreference({
      enabled: true,
      skipped: false,
      autoIncreaseDraft: {
        enabled: true,
        annualIncreasePct: increaseAmount,
        stopAtPct: maxContribution,
      },
    });
    if (!r.ok && import.meta.env.DEV) console.warn("[AutoIncreaseConfig] save preference:", r.error);
  };

  const cycleOptions = (
    [
      { id: "calendar" as const, title: "Calendar Year", sub: "Every Jan 1st" },
      { id: "participant" as const, title: "Participant Date", sub: "On enrollment date" },
      { id: "plan" as const, title: "Plan Year", sub: "Every April 1" },
    ] satisfies { id: IncrementCycle; title: string; sub: string }[]
  ).map((opt) => (
    <label
      key={opt.id}
      className={cn(
        "flex cursor-pointer flex-col gap-2 rounded-xl border-2 p-3 transition-colors",
        incrementCycle === opt.id ? "border-[var(--primary)]" : "border-[var(--border-subtle)] hover:opacity-90",
      )}
      style={
        incrementCycle === opt.id
          ? { background: "color-mix(in srgb, var(--primary) 8%, var(--bg-primary))" }
          : { background: "var(--bg-primary)" }
      }
    >
      <div className="flex items-center gap-2">
        <input
          type="radio"
          name="increment-cycle-config"
          checked={incrementCycle === opt.id}
          onChange={() => setIncrementCycle(opt.id)}
          className="h-4 w-4"
          style={{ accentColor: "var(--primary)" }}
        />
        <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {opt.title}
        </p>
      </div>
      <p className="ml-6 text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
        {opt.sub}
      </p>
    </label>
  ));

  const saveButton = (
    <button
      type="button"
      onClick={handleSaveAutoIncrease}
      disabled={!valid || increaseAmount <= 0}
      className="btn-enroll-success flex w-full items-center justify-center gap-2 py-3.5 text-base font-semibold disabled:pointer-events-none disabled:opacity-45"
    >
      Save Auto Increase
      <ArrowRight className="h-4 w-4" aria-hidden />
    </button>
  );

  return (
    <div className="enrollment-flow-popup enrollment-flow-popup--flat enrollment-flow-popup--config-wide">
      <div className="enrollment-flow-popup__card">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2.5">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h1 className="text-xl font-semibold md:text-2xl" style={{ color: "var(--text-primary)" }}>
                Configure your automatic increases
              </h1>
            </div>
            <p className="text-sm md:text-base" style={{ color: "var(--text-muted)" }}>
              Your contribution will gradually increase over time.
            </p>
          </div>
          <div
            className="auto-increase-config-card flex shrink-0 flex-wrap gap-6 px-4 py-3"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <div>
              <p
                className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                Current
              </p>
              <p className="text-2xl font-extrabold leading-none" style={{ color: "var(--text-primary)" }}>
                {currentPercent}%
              </p>
              <p className="mt-1 text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
                ${currentMonthlyContribution.toLocaleString()}/mo
              </p>
            </div>
            <div className="min-h-[2.5rem] border-l pl-6" style={{ borderColor: "var(--border-subtle)" }}>
              <p
                className="mb-0.5 text-[0.65rem] font-bold uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                Target max
              </p>
              <p className="text-2xl font-extrabold leading-none" style={{ color: "var(--text-primary)" }}>
                {maxContribution}%
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-4 lg:col-span-8">
            <div className="auto-increase-config-card p-4">
              <h3 className="mb-2.5 text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                Increment cycle
              </h3>
              <div className="grid gap-3 sm:grid-cols-3">{cycleOptions}</div>
            </div>

            <div className="auto-increase-config-card p-4">
              <div className="flex gap-3">
                <div className="icon-box-soft">
                  <Calendar className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Increase per cycle
                  </span>
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-[0.65rem]" style={{ color: "var(--text-muted)" }}>
                      <span>0%</span>
                      <span className="text-sm font-bold tabular-nums" style={{ color: "var(--primary)" }}>
                        {increaseAmount}% per cycle
                      </span>
                      <span>3%</span>
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
                <div className="icon-box-target">
                  <Target className="h-4 w-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    Stop limit
                  </span>
                  <p className="mt-0.5 text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
                    Stop increasing when contributions reach — your rate will not exceed{" "}
                    <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {maxContribution}%
                    </span>
                    .
                  </p>
                  <div className="mt-4">
                    <div className="mb-1.5 flex items-center justify-between text-[0.7rem]" style={{ color: "var(--text-muted)" }}>
                      <span>10%</span>
                      <span className="text-base font-bold tabular-nums text-accent-chart5-lg">{maxContribution}%</span>
                      <span>15%</span>
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

            <div className="flex items-start gap-2.5 rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-secondary)" }}>
              <Info className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "var(--text-muted)" }} aria-hidden />
              <div className="min-w-0 space-y-2 text-[0.78rem]" style={{ color: "var(--text-muted)" }}>
                <p>
                  Automatic increases apply once per year. Your contribution will rise by the selected percentage each
                  year until it reaches your maximum. You can change or disable automatic increases at any time.
                </p>
                <p className="font-medium" style={{ color: "var(--text-primary)" }}>
                  {currentPercent >= maxContribution ? (
                    <>Your contribution rate is already at or above your selected maximum.</>
                  ) : increaseAmount <= 0 ? (
                    <>Choose an increase per cycle above 0% to see how your rate grows.</>
                  ) : (
                    <>
                      Your contribution will grow from {currentPercent}% to {maxContribution}% over approximately{" "}
                      {yearsToMax} {yearsToMax === 1 ? "year" : "years"}.
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="hidden lg:block">{saveButton}</div>
          </div>

          <div className="col-span-12 lg:col-span-4">
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

        <div className="mt-4 lg:hidden">{saveButton}</div>

        <p className="mt-4 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Use <strong style={{ color: "var(--text-primary)" }}>Next</strong> below to continue when your settings are
          valid.
        </p>
      </div>
    </div>
  );
}
