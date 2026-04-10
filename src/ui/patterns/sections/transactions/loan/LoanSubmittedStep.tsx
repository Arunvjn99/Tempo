import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import type { LoanStepCommonProps } from "./loanStepTypes";

interface LoanSubmittedStepProps extends LoanStepCommonProps {
  step: number;
  completedAt: string;
  onFinish: () => void;
}

export function LoanSubmittedStep({
  step,
  totalSteps,
  completedAt,
  onFinish,
}: LoanSubmittedStepProps) {
  return (
    <StepLayout
      title="Loan request submitted"
      description="We received your request. You will receive a confirmation email shortly."
      stepNumber={step + 1}
      totalSteps={totalSteps}
    >
      <FormSection variant="highlight">
        <p className="text-sm text-foreground">Reference time: {new Date(completedAt).toLocaleString()}</p>
      </FormSection>
      <ActionBar onNext={onFinish} hideBack nextLabel="Back to transactions" />
    </StepLayout>
  );
}
