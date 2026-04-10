import { TransactionFlowSubmittedStep } from "../TransactionFlowSubmittedStep";

export interface TransferStepSubmittedProps {
  step: number;
  totalSteps: number;
  completedAt: string;
  onFinish: () => void;
}

export function TransferStepSubmitted({ step, totalSteps, completedAt, onFinish }: TransferStepSubmittedProps) {
  return (
    <TransactionFlowSubmittedStep
      title="Transfer submitted"
      description="Your transfer request was recorded."
      stepNumber={step + 1}
      totalSteps={totalSteps}
      completedAt={completedAt}
      onFinish={onFinish}
    />
  );
}
