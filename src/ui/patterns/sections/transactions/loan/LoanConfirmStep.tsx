import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import type { LoanStepCommonProps } from "./loanStepTypes";

export function LoanConfirmStep({ totalSteps, onNext, onBack, nextDisabled }: LoanStepCommonProps) {
  return (
    <StepLayout
      title="Confirm submission"
      description="Submit your loan request to the plan administrator."
      stepNumber={7}
      totalSteps={totalSteps}
    >
      <FormSection variant="highlight">
        <p className="text-sm text-primary">
          By continuing, you authorize processing of this loan according to plan rules and the summary on the
          previous step.
        </p>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit" />
    </StepLayout>
  );
}
