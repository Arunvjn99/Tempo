import { ActionBar, SliderInput } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";
import type { LoanStepCommonProps, LoanStoreSlice } from "./loanStepTypes";

interface LoanSimulatorStepProps extends LoanStepCommonProps {
  errors: Record<string, string>;
  store: LoanStoreSlice;
}

export function LoanSimulatorStep({
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  store,
}: LoanSimulatorStepProps) {
  const { loan, updateLoan } = store;
  return (
    <StepLayout
      title="Loan simulator"
      description="Choose how much to borrow and for how long. Payments update automatically."
      stepNumber={2}
      totalSteps={totalSteps}
    >
      <FormSection title="Amount & term">
        <SliderInput
          label="Loan amount"
          value={loan.amount}
          onChange={(v) => updateLoan({ amount: v })}
          min={1_000}
          max={50_000}
          step={500}
          formatValue={(v) => formatCurrency(v)}
        />
        {errors.amount && (
          <p className="text-xs text-danger" role="alert">
            {errors.amount}
          </p>
        )}
        <SliderInput
          label="Term (years)"
          value={loan.term}
          onChange={(v) => updateLoan({ term: Math.round(v) })}
          min={1}
          max={5}
          step={1}
          unit=" yrs"
        />
        {errors.term && (
          <p className="text-xs text-danger" role="alert">
            {errors.term}
          </p>
        )}
      </FormSection>
      <FormSection title="Estimated repayment" variant="muted">
        <dl className="grid gap-sm text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Monthly payment</dt>
            <dd className="font-semibold text-foreground">{formatCurrency(loan.monthlyPayment, 2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total payback</dt>
            <dd className="font-semibold text-foreground">{formatCurrency(loan.totalPayback, 2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Total interest</dt>
            <dd className="font-semibold text-foreground">{formatCurrency(loan.totalInterest, 2)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Interest rate (annual)</dt>
            <dd className="font-semibold text-primary">{(loan.interestRate * 100).toFixed(1)}%</dd>
          </div>
        </dl>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
