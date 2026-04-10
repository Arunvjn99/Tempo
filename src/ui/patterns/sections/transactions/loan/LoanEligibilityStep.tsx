import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import { transactionChoiceButtonClass } from "../transactionChoiceStyles";
import type { LoanStepCommonProps, LoanStoreSlice } from "./loanStepTypes";

interface LoanEligibilityStepProps extends LoanStepCommonProps {
  errors: Record<string, string>;
  store: LoanStoreSlice;
}

export function LoanEligibilityStep({
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  store,
}: LoanEligibilityStepProps) {
  const { loan, updateLoan } = store;
  return (
    <StepLayout
      title="Loan eligibility"
      description="Confirm whether you can proceed with a plan loan based on your account status."
      stepNumber={1}
      totalSteps={totalSteps}
    >
      <FormSection title="Eligibility check">
        <p className="mb-md text-sm text-muted-foreground">
          Run a quick check. You must be eligible before continuing.
        </p>
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            className={transactionChoiceButtonClass(loan.isEligible === true)}
            onClick={() => updateLoan({ isEligible: true, eligibilityReason: "" })}
          >
            I am eligible
          </button>
          <button
            type="button"
            className={transactionChoiceButtonClass(loan.isEligible === false)}
            onClick={() =>
              updateLoan({
                isEligible: false,
                eligibilityReason: "Account does not meet minimum vesting or balance rules.",
              })
            }
          >
            Not eligible
          </button>
        </div>
        {errors.eligibility && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.eligibility}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} hideBack={false} />
    </StepLayout>
  );
}
