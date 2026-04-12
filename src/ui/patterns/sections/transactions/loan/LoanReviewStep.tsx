import { ActionBar, CardReviewSection, ReviewCard } from "@/ui/components";
import { StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";
import { DISBURSE, FREQ, LOAN_TYPES, REPAY } from "./loanConstants";
import type { LoanStepCommonProps, LoanStoreSlice } from "./loanStepTypes";

interface LoanReviewStepProps extends LoanStepCommonProps {
  store: LoanStoreSlice;
}

export function LoanReviewStep({ totalSteps, onNext, onBack, nextDisabled, store }: LoanReviewStepProps) {
  const { loan, goToStep } = store;
  return (
    <StepLayout
      title="Review loan"
      description="Verify details before you submit."
      stepNumber={6}
      totalSteps={totalSteps}
    >
      <CardReviewSection title="Summary">
        <ReviewCard label="Amount" value={formatCurrency(loan.amount)} onEdit={() => goToStep(1)} />
        <ReviewCard label="Term" value={`${loan.term} years`} onEdit={() => goToStep(1)} />
        <ReviewCard
          label="Type & reason"
          value={LOAN_TYPES.find((t) => t.id === loan.loanType)?.label ?? loan.loanType}
          subValue={loan.reason}
          onEdit={() => goToStep(2)}
        />
        <ReviewCard
          label="Disbursement"
          value={DISBURSE.find((d) => d.id === loan.disbursementMethod)?.label ?? ""}
          onEdit={() => goToStep(2)}
        />
        <ReviewCard
          label="Repayment"
          value={`${FREQ.find((f) => f.id === loan.repaymentFrequency)?.label} · ${REPAY.find((r) => r.id === loan.repaymentMethod)?.label}`}
          onEdit={() => goToStep(2)}
        />
        <ReviewCard
          label="Monthly payment"
          value={formatCurrency(loan.monthlyPayment, 2)}
          onEdit={() => goToStep(1)}
        />
      </CardReviewSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit loan" />
    </StepLayout>
  );
}
