// ─────────────────────────────────────────────
// AutoIncreaseSetupPage — Configure rate, cap, cycle (Figma rebuild)
// ─────────────────────────────────────────────

import { useMemo } from "react";
import { useEnrollmentStore, useEnrollmentDerived } from "../store";
import { validateStep } from "../store/validation";
import { EnrollmentActionRow } from "@/ui/patterns/enrollment-router";
import { AutoIncreaseControlsColumn } from "@/ui/patterns/sections/enrollment/autoIncrease/AutoIncreaseControlsColumn";
import { AutoIncreaseImpactAside } from "@/ui/patterns/sections/enrollment/autoIncrease/AutoIncreaseImpactAside";
import { AutoIncreaseSetupHeader } from "@/ui/patterns/sections/enrollment/autoIncrease/AutoIncreaseSetupHeader";

export function AutoIncreaseSetupPage() {
  const enrollment = useEnrollmentStore((s) => s.enrollment);
  const personalization = useEnrollmentStore((s) => s.personalization);
  const updateEnrollment = useEnrollmentStore((s) => s.updateEnrollment);
  const nextStep = useEnrollmentStore((s) => s.nextStep);
  const prevStep = useEnrollmentStore((s) => s.prevStep);
  const derived = useEnrollmentDerived();

  const validation = validateStep("auto-increase-setup", enrollment, personalization);

  const {
    autoIncreaseAmount,
    autoIncreaseMax,
    incrementCycle,
    contributionPercent,
    salary,
  } = enrollment;

  const currentMonthly = Math.round((salary * contributionPercent) / 100 / 12);

  const schedule = useMemo(() => {
    if (autoIncreaseAmount === 0 || contributionPercent >= autoIncreaseMax) return [];
    const rows: { year: number; pct: number; annual: number; date: string }[] = [];
    let pct = contributionPercent;
    let yr = 0;
    const getDate = (offset: number) => {
      const today = new Date();
      let d: Date;
      if (incrementCycle === "calendar") d = new Date(today.getFullYear() + offset, 0, 1);
      else if (incrementCycle === "plan") d = new Date(today.getFullYear() + offset, 3, 1);
      else d = new Date(today.getFullYear() + offset, 7, 15);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };
    const yearsToMax = Math.ceil((autoIncreaseMax - contributionPercent) / autoIncreaseAmount);
    while (pct <= autoIncreaseMax && yr <= yearsToMax && yr <= 10) {
      rows.push({
        year: yr,
        pct: Math.round(pct * 10) / 10,
        annual: Math.round((salary * pct) / 100),
        date: getDate(yr),
      });
      if (pct < autoIncreaseMax) pct = Math.min(pct + autoIncreaseAmount, autoIncreaseMax);
      yr++;
    }
    return rows;
  }, [contributionPercent, autoIncreaseAmount, autoIncreaseMax, salary, incrementCycle]);

  const yearsToMax =
    autoIncreaseAmount === 0 || contributionPercent >= autoIncreaseMax
      ? 0
      : Math.ceil((autoIncreaseMax - contributionPercent) / autoIncreaseAmount);

  const hasDiff = derived.projectedBalance > derived.projectedBalanceNoAI;

  const amtPct = ((autoIncreaseAmount - 0) / (5 - 0)) * 100;
  const maxPct = ((autoIncreaseMax - (contributionPercent + 1)) / (25 - (contributionPercent + 1))) * 100;

  return (
    <div className="space-y-5">
      <AutoIncreaseSetupHeader
        contributionPercent={contributionPercent}
        autoIncreaseMax={autoIncreaseMax}
        currentMonthly={currentMonthly}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5 lg:items-start">
        <AutoIncreaseControlsColumn
          incrementCycle={incrementCycle}
          autoIncreaseAmount={autoIncreaseAmount}
          autoIncreaseMax={autoIncreaseMax}
          contributionPercent={contributionPercent}
          amtPct={amtPct}
          maxPct={maxPct}
          onUpdateEnrollment={updateEnrollment}
        />

        <AutoIncreaseImpactAside
          contributionPercent={contributionPercent}
          autoIncreaseMax={autoIncreaseMax}
          autoIncreaseAmount={autoIncreaseAmount}
          yearsToMax={yearsToMax}
          hasDiff={hasDiff}
          projectedBalance={derived.projectedBalance}
          projectedBalanceNoAI={derived.projectedBalanceNoAI}
          schedule={schedule}
        />
      </div>

      <EnrollmentActionRow
        onBack={prevStep}
        onNext={nextStep}
        nextDisabled={!validation.valid}
        nextLabel="Save & Continue"
      />
    </div>
  );
}
