import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface TransactionFlowSubmittedStepProps {
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  completedAt: string;
  onFinish: () => void;
  /** e.g. "Submitted at " before the formatted date */
  completedAtPrefix?: string;
}

/** Shared “request recorded” step for withdrawal / transfer / rollover flows. */
export function TransactionFlowSubmittedStep({
  title,
  description,
  stepNumber,
  totalSteps,
  completedAt,
  onFinish,
  completedAtPrefix = "",
}: TransactionFlowSubmittedStepProps) {
  return (
    <StepLayout title={title} description={description} stepNumber={stepNumber} totalSteps={totalSteps}>
      <FormSection variant="highlight">
        <p className="text-sm text-foreground">
          {completedAtPrefix}
          {new Date(completedAt).toLocaleString()}
        </p>
      </FormSection>
      <ActionBar onNext={onFinish} hideBack nextLabel="Back to transactions" />
    </StepLayout>
  );
}
