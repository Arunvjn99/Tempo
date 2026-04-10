import { TransactionFlowSubmittedStep } from "../TransactionFlowSubmittedStep";

export interface RolloverStepSubmittedProps {
  step: number;
  totalSteps: number;
  completedAt: string;
  onFinish: () => void;
}

export function RolloverStepSubmitted({ step, totalSteps, completedAt, onFinish }: RolloverStepSubmittedProps) {
  return (
    <TransactionFlowSubmittedStep
      title="Rollover submitted"
      description="Your rollover instructions were received."
      stepNumber={step + 1}
      totalSteps={totalSteps}
      completedAt={completedAt}
      onFinish={onFinish}
    />
  );
}
