import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface TransferStepConfirmProps {
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
}

export function TransferStepConfirm({ totalSteps, onNext, onBack, nextDisabled }: TransferStepConfirmProps) {
  return (
    <StepLayout
      title="Confirm transfer"
      description="Submit this exchange request."
      stepNumber={7}
      totalSteps={totalSteps}
    >
      <FormSection variant="highlight">
        <p className="text-sm text-primary">Trades typically process within 1–2 business days.</p>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} nextLabel="Submit" />
    </StepLayout>
  );
}
