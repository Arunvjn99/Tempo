import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface RolloverStepConfirmProps {
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
}

export function RolloverStepConfirm({ totalSteps, onNext, onBack, nextDisabled }: RolloverStepConfirmProps) {
  return (
    <StepLayout
      title="Confirm rollover"
      description="Submit your rollover request."
      stepNumber={6}
      totalSteps={totalSteps}
    >
      <FormSection variant="highlight">
        <p className="text-sm text-primary">
          Processing times depend on your prior provider. This is a demo flow only.
        </p>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit" />
    </StepLayout>
  );
}
