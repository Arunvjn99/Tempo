// ─────────────────────────────────────────────
// Withdrawal transaction flow — all steps
// ─────────────────────────────────────────────

import { useTransactionStore } from "../store";
import { WithdrawalStepConfirm } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepConfirm";
import { WithdrawalStepEligibility } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepEligibility";
import { WithdrawalStepPaymentMethod } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepPaymentMethod";
import { WithdrawalStepReview } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepReview";
import { WithdrawalStepSourcesAmounts } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepSourcesAmounts";
import { WithdrawalStepSubmitted } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepSubmitted";
import { WithdrawalStepTaxFees } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepTaxFees";
import { WithdrawalStepWithdrawalType } from "@/ui/patterns/sections/transactions/withdrawal/WithdrawalStepWithdrawalType";

interface WithdrawalPagesProps {
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

export function WithdrawalPages({
  step,
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  isLastStep,
  completedAt,
  onFinish,
}: WithdrawalPagesProps) {
  const w = useTransactionStore((s) => s.withdrawalData);
  const updateWithdrawal = useTransactionStore((s) => s.updateWithdrawal);
  const goToStep = useTransactionStore((s) => s.goToStep);

  if (completedAt && isLastStep) {
    return (
      <WithdrawalStepSubmitted
        step={step}
        totalSteps={totalSteps}
        completedAt={completedAt}
        onFinish={onFinish}
      />
    );
  }

  switch (step) {
    case 0:
      return (
        <WithdrawalStepEligibility
          totalSteps={totalSteps}
          w={w}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateWithdrawal={updateWithdrawal}
        />
      );
    case 1:
      return (
        <WithdrawalStepWithdrawalType
          totalSteps={totalSteps}
          w={w}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateWithdrawal={updateWithdrawal}
        />
      );
    case 2:
      return (
        <WithdrawalStepSourcesAmounts
          totalSteps={totalSteps}
          w={w}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateWithdrawal={updateWithdrawal}
        />
      );
    case 3:
      return (
        <WithdrawalStepTaxFees
          totalSteps={totalSteps}
          w={w}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateWithdrawal={updateWithdrawal}
        />
      );
    case 4:
      return (
        <WithdrawalStepPaymentMethod
          totalSteps={totalSteps}
          w={w}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateWithdrawal={updateWithdrawal}
        />
      );
    case 5:
      return (
        <WithdrawalStepReview
          totalSteps={totalSteps}
          w={w}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          goToStep={goToStep}
        />
      );
    case 6:
      return <WithdrawalStepConfirm totalSteps={totalSteps} onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />;
    default:
      return null;
  }
}
