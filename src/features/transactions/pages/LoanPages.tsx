// Loan transaction flow — delegates each step to `sections/transactions/loan`.

import { useTransactionStore } from "../store";
import type { LoanPagesProps } from "@/ui/patterns/sections/transactions/loan/loanStepTypes";
import { LoanSubmittedStep } from "@/ui/patterns/sections/transactions/loan/LoanSubmittedStep";
import { LoanEligibilityStep } from "@/ui/patterns/sections/transactions/loan/LoanEligibilityStep";
import { LoanSimulatorStep } from "@/ui/patterns/sections/transactions/loan/LoanSimulatorStep";
import { LoanConfigurationStep } from "@/ui/patterns/sections/transactions/loan/LoanConfigurationStep";
import { LoanFeesStep } from "@/ui/patterns/sections/transactions/loan/LoanFeesStep";
import { LoanDocumentsStep } from "@/ui/patterns/sections/transactions/loan/LoanDocumentsStep";
import { LoanReviewStep } from "@/ui/patterns/sections/transactions/loan/LoanReviewStep";
import { LoanConfirmStep } from "@/ui/patterns/sections/transactions/loan/LoanConfirmStep";

export type { LoanPagesProps };

export function LoanPages({
  step,
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  isLastStep,
  completedAt,
  onFinish,
}: LoanPagesProps) {
  const loan = useTransactionStore((s) => s.loanData);
  const updateLoan = useTransactionStore((s) => s.updateLoan);
  const goToStep = useTransactionStore((s) => s.goToStep);
  const store = { loan, updateLoan, goToStep };
  const common = { totalSteps, onNext, onBack, nextDisabled };

  if (completedAt && isLastStep) {
    return (
      <LoanSubmittedStep
        {...common}
        step={step}
        completedAt={completedAt}
        onFinish={onFinish}
      />
    );
  }

  switch (step) {
    case 0:
      return <LoanEligibilityStep {...common} errors={errors} store={store} />;
    case 1:
      return <LoanSimulatorStep {...common} errors={errors} store={store} />;
    case 2:
      return <LoanConfigurationStep {...common} errors={errors} store={store} />;
    case 3:
      return <LoanFeesStep {...common} />;
    case 4:
      return <LoanDocumentsStep {...common} errors={errors} store={store} />;
    case 5:
      return <LoanReviewStep {...common} store={store} />;
    case 6:
      return <LoanConfirmStep {...common} />;
    default:
      return null;
  }
}
