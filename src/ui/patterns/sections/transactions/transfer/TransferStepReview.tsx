import type { TransferData } from "@/features/transactions/store/types";
import { TRANSFER_TYPES } from "@/features/transactions/store/constants/transferFlowConstants";
import { ActionBar, ReviewCard, ReviewSection } from "@/ui/components";
import { StepLayout } from "@/ui/patterns";
import { formatCurrency, formatPercent } from "@/features/transactions/services/format";

export interface TransferStepReviewProps {
  totalSteps: number;
  t: TransferData;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  goToStep: (step: number) => void;
}

export function TransferStepReview({
  totalSteps,
  t,
  onNext,
  onBack,
  nextDisabled,
  goToStep,
}: TransferStepReviewProps) {
  return (
    <StepLayout
      title="Review transfer"
      description="Confirm funds and amounts."
      stepNumber={6}
      totalSteps={totalSteps}
    >
      <ReviewSection title="Summary">
        <ReviewCard
          label="Type"
          value={TRANSFER_TYPES.find((x) => x.id === t.transferType)?.label ?? "—"}
          onEdit={() => goToStep(0)}
        />
        <ReviewCard label="From" value={t.sourceFundName || "—"} onEdit={() => goToStep(1)} />
        <ReviewCard
          label="Amount"
          value={t.mode === "dollar" ? formatCurrency(t.amount) : formatPercent(t.percentage)}
          onEdit={() => goToStep(2)}
        />
        <ReviewCard label="To" value={t.destinationFundName || "—"} onEdit={() => goToStep(3)} />
      </ReviewSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit transfer" />
    </StepLayout>
  );
}
