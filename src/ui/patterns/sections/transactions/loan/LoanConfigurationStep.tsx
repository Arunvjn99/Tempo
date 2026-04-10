import { ActionBar } from "@/ui/components";
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
            <button
              key={t.id}
              type="button"
              className={transactionChoiceButtonClass(loan.loanType === t.id)}
              onClick={() => updateLoan({ loanType: t.id })}
            >
              {t.label}
            </button>
          ))}
        </div>
      </FormSection>
      <FormSection title="Disbursement">
        <div className="grid gap-sm sm:grid-cols-2">
          {DISBURSE.map((d) => (
            <button
              key={d.id}
              type="button"
              className={transactionChoiceButtonClass(loan.disbursementMethod === d.id)}
              onClick={() => updateLoan({ disbursementMethod: d.id })}
            >
              {d.label}
            </button>
          ))}
        </div>
      </FormSection>
      <FormSection title="Repayment">
        <div className="mb-md grid gap-sm sm:grid-cols-3">
          {FREQ.map((f) => (
            <button
              key={f.id}
              type="button"
              className={transactionChoiceButtonClass(loan.repaymentFrequency === f.id)}
              onClick={() => updateLoan({ repaymentFrequency: f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid gap-sm sm:grid-cols-3">
          {REPAY.map((r) => (
            <button
              key={r.id}
              type="button"
              className={transactionChoiceButtonClass(loan.repaymentMethod === r.id)}
              onClick={() => updateLoan({ repaymentMethod: r.id })}
            >
              {r.label}
            </button>
          ))}
        </div>
      </FormSection>
      <FieldGroup label="Reason for loan" required error={errors.reason}>
        <textarea
          value={loan.reason}
          onChange={(e) => updateLoan({ reason: e.target.value })}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          placeholder="Brief description"
        />
      </FieldGroup>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
