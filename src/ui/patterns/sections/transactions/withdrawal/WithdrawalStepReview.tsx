import type { WithdrawalData } from "@/features/transactions/store/types";
import { WD_TYPES, PAY } from "@/features/transactions/store/constants/withdrawalFlowConstants";
import { ActionBar, ReviewCard, ReviewSection } from "@/ui/components";
import { StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";

export interface WithdrawalStepReviewProps {
  totalSteps: number;
  w: WithdrawalData;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  goToStep: (step: number) => void;
}

export function WithdrawalStepReview({
  totalSteps,
  w,
  onNext,
  onBack,
  nextDisabled,
  goToStep,
}: WithdrawalStepReviewProps) {
  return (
    <StepLayout
      title="Review withdrawal"
      description="Confirm amounts and delivery before submitting."
      stepNumber={6}
      totalSteps={totalSteps}
    >
      <ReviewSection title="Details">
        <ReviewCard
          label="Type"
          value={WD_TYPES.find((t) => t.id === w.withdrawalType)?.label ?? "—"}
          onEdit={() => goToStep(1)}
        />
        <ReviewCard label="Gross amount" value={formatCurrency(w.totalAmount)} onEdit={() => goToStep(2)} />
        <ReviewCard
          label="Net (after tax & penalty)"
          value={formatCurrency(w.netAmount, 2)}
          onEdit={() => goToStep(3)}
        />
        <ReviewCard
          label="Payment"
          value={PAY.find((p) => p.id === w.paymentMethod)?.label ?? "—"}
          subValue={
            w.paymentMethod === "ach"
              ? `Account ending ${w.bankAccountLast4 || "—"}`
              : w.mailingAddress
          }
          onEdit={() => goToStep(4)}
        />
      </ReviewSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit withdrawal" />
    </StepLayout>
  );
}
