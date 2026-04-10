// ─────────────────────────────────────────────
// Rollover flow — all steps
// ─────────────────────────────────────────────

import { useMemo } from "react";
import { useTransactionStore } from "../store";
import { MOCK_FUNDS } from "../store/constants/mockFunds";
import type { AllocationSlice } from "@/ui/components";
import { RolloverStepAllocation } from "@/ui/patterns/sections/transactions/rollover/RolloverStepAllocation";
import { RolloverStepConfirm } from "@/ui/patterns/sections/transactions/rollover/RolloverStepConfirm";
import { RolloverStepDocuments } from "@/ui/patterns/sections/transactions/rollover/RolloverStepDocuments";
import { RolloverStepPriorPlan } from "@/ui/patterns/sections/transactions/rollover/RolloverStepPriorPlan";
import { RolloverStepReview } from "@/ui/patterns/sections/transactions/rollover/RolloverStepReview";
import { RolloverStepSubmitted } from "@/ui/patterns/sections/transactions/rollover/RolloverStepSubmitted";
import { RolloverStepValidation } from "@/ui/patterns/sections/transactions/rollover/RolloverStepValidation";

function defaultCustomSlices(data: Record<string, number>): AllocationSlice[] {
  const n = MOCK_FUNDS.length;
  const per = Math.floor(100 / n);
  return MOCK_FUNDS.map((f, i) => ({
    key: f.id,
    label: f.name,
    color: `var(--chart-${(i % 5) + 1})`,
    value: data[f.id] ?? (i === n - 1 ? 100 - per * (n - 1) : per),
  }));
}

interface RolloverPagesProps {
  step: number;
  totalSteps: number;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  isLastStep: boolean;
  completedAt: string | null;
  onFinish: () => void;
}

export function RolloverPages({
  step,
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  isLastStep,
  completedAt,
  onFinish,
}: RolloverPagesProps) {
  const r = useTransactionStore((s) => s.rolloverData);
  const updateRollover = useTransactionStore((s) => s.updateRollover);
  const goToStep = useTransactionStore((s) => s.goToStep);

  const customSlices = useMemo(
    () => defaultCustomSlices(r.customAllocations),
    [r.customAllocations],
  );

  if (completedAt && isLastStep) {
    return (
      <RolloverStepSubmitted step={step} totalSteps={totalSteps} completedAt={completedAt} onFinish={onFinish} />
    );
  }

  switch (step) {
    case 0:
      return (
        <RolloverStepPriorPlan
          totalSteps={totalSteps}
          r={r}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateRollover={updateRollover}
        />
      );
    case 1:
      return (
        <RolloverStepValidation
          totalSteps={totalSteps}
          r={r}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateRollover={updateRollover}
        />
      );
    case 2:
      return (
        <RolloverStepDocuments
          totalSteps={totalSteps}
          r={r}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateRollover={updateRollover}
        />
      );
    case 3:
      return (
        <RolloverStepAllocation
          totalSteps={totalSteps}
          r={r}
          errors={errors}
          customSlices={customSlices}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateRollover={updateRollover}
        />
      );
    case 4:
      return (
        <RolloverStepReview
          totalSteps={totalSteps}
          r={r}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          goToStep={goToStep}
        />
      );
    case 5:
      return <RolloverStepConfirm totalSteps={totalSteps} onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />;
    default:
      return null;
  }
}
