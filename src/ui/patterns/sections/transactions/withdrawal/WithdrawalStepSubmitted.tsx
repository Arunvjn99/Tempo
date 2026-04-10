import { TransactionFlowSubmittedStep } from "../TransactionFlowSubmittedStep";

export interface WithdrawalStepSubmittedProps {
  step: number;
  totalSteps: number;
  completedAt: string;
  onFinish: () => void;
}

export function WithdrawalStepSubmitted({
  step,
  totalSteps,
  completedAt,
  onFinish,
}: WithdrawalStepSubmittedProps) {
  return (
    <TransactionFlowSubmittedStep
      title="Withdrawal submitted"
      description="Your request has been recorded."
      stepNumber={step + 1}
      totalSteps={totalSteps}
      completedAt={completedAt}
      onFinish={onFinish}
      completedAtPrefix="Submitted at "
    />
  );
}
