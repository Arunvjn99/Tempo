import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface WithdrawalStepConfirmProps {
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
}

export function WithdrawalStepConfirm({
  totalSteps,
  onNext,
  onBack,
  nextDisabled,
}: WithdrawalStepConfirmProps) {
  return (
    <StepLayout
      title="Confirm withdrawal"
      description="Submit this request to your plan."
      stepNumber={7}
      totalSteps={totalSteps}
    >
      <FormSection variant="highlight">
        <p className="text-sm text-primary">
          Distributions may be taxable. This is a demonstration flow only.
        </p>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit" />
    </StepLayout>
  );
}
