import type { RolloverData } from "@/features/transactions/store/types";
import { ALLOCATION_OPTIONS, ROLLOVER_TYPES } from "@/features/transactions/store/constants/rolloverFlowConstants";
import { ActionBar, CardReviewSection, ReviewCard } from "@/ui/components";
import { StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";

export interface RolloverStepReviewProps {
  totalSteps: number;
  r: RolloverData;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  goToStep: (step: number) => void;
}

export function RolloverStepReview({
  totalSteps,
  r,
  onNext,
  onBack,
  nextDisabled,
  goToStep,
}: RolloverStepReviewProps) {
  return (
    <StepLayout
      title="Review rollover"
      description="Confirm prior plan details and allocation."
      stepNumber={5}
      totalSteps={totalSteps}
    >
      <CardReviewSection title="Summary">
        <ReviewCard label="Employer" value={r.previousEmployer} onEdit={() => goToStep(0)} />
        <ReviewCard label="Administrator" value={r.planAdministrator} onEdit={() => goToStep(0)} />
        <ReviewCard label="Account" value={r.accountNumber} onEdit={() => goToStep(0)} />
        <ReviewCard
          label="Estimated amount"
          value={formatCurrency(r.estimatedAmount)}
          onEdit={() => goToStep(0)}
        />
        <ReviewCard
          label="Type"
          value={ROLLOVER_TYPES.find((t) => t.id === r.rolloverType)?.label ?? ""}
          onEdit={() => goToStep(0)}
        />
        <ReviewCard
          label="Allocation"
          value={ALLOCATION_OPTIONS.find((a) => a.id === r.allocationMethod)?.label ?? ""}
          onEdit={() => goToStep(3)}
        />
      </CardReviewSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit rollover" />
    </StepLayout>
  );
}
