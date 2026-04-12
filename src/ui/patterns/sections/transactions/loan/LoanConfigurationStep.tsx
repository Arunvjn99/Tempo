import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FieldGroup, FormSection, StepLayout } from "@/ui/patterns";
import { transactionChoiceButtonClass } from "../transactionChoiceStyles";
import { DISBURSE, FREQ, LOAN_TYPES, REPAY } from "./loanConstants";
import type { LoanStepCommonProps, LoanStoreSlice } from "./loanStepTypes";

interface LoanConfigurationStepProps extends LoanStepCommonProps {
  errors: Record<string, string>;
  store: LoanStoreSlice;
}

export function LoanConfigurationStep({
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  store,
}: LoanConfigurationStepProps) {
  const { loan, updateLoan } = store;
  return (
    <StepLayout
      title="Loan configuration"
      description="Select loan type, purpose, and how funds move."
      stepNumber={3}
      totalSteps={totalSteps}
    >
      <FormSection title="Loan type">
        <div className="grid gap-sm sm:grid-cols-3">
          {LOAN_TYPES.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(loan.loanType === t.id)}
              onClick={() => updateLoan({ loanType: t.id })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </FormSection>
      <FormSection title="Disbursement">
        <div className="grid gap-sm sm:grid-cols-2">
          {DISBURSE.map((d) => (
            <Button
              key={d.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(loan.disbursementMethod === d.id)}
              onClick={() => updateLoan({ disbursementMethod: d.id })}
            >
              {d.label}
            </Button>
          ))}
        </div>
      </FormSection>
      <FormSection title="Repayment">
        <div className="mb-md grid gap-sm sm:grid-cols-3">
          {FREQ.map((f) => (
            <Button
              key={f.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(loan.repaymentFrequency === f.id)}
              onClick={() => updateLoan({ repaymentFrequency: f.id })}
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="grid gap-sm sm:grid-cols-3">
          {REPAY.map((r) => (
            <Button
              key={r.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(loan.repaymentMethod === r.id)}
              onClick={() => updateLoan({ repaymentMethod: r.id })}
            >
              {r.label}
            </Button>
          ))}
        </div>
      </FormSection>
      <FieldGroup label="Reason for loan" required error={errors.reason}>
        <textarea
          value={loan.reason}
          onChange={(e) => updateLoan({ reason: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-default bg-background px-md py-sm text-sm text-primary placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Brief description"
        />
      </FieldGroup>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
