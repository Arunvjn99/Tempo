import type { WithdrawalData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface WithdrawalStepEligibilityProps {
  totalSteps: number;
  w: WithdrawalData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
}

export function WithdrawalStepEligibility({
  totalSteps,
  w,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateWithdrawal,
}: WithdrawalStepEligibilityProps) {
  return (
    <StepLayout
      title="Withdrawal eligibility"
      description="Confirm you may request a distribution."
      stepNumber={1}
      totalSteps={totalSteps}
    >
      <FormSection title="Status">
        <div className="flex flex-wrap gap-sm">
          <button
            type="button"
            className={transactionChoiceButtonClass(w.isEligible === true)}
            onClick={() => updateWithdrawal({ isEligible: true, eligibilityReason: "" })}
          >
            Eligible
          </button>
          <button
            type="button"
            className={transactionChoiceButtonClass(w.isEligible === false)}
            onClick={() =>
              updateWithdrawal({
                isEligible: false,
                eligibilityReason: "Withdrawals are restricted for this account.",
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
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
