import { StepProgress } from "@/ui/components";

export interface TransactionFlowProgressSectionProps {
  stepLabels: string[];
  currentStep: number;
}

export function TransactionFlowProgressSection({ stepLabels, currentStep }: TransactionFlowProgressSectionProps) {
  return (
    <div className="mb-2xl">
      <StepProgress steps={stepLabels.map((label) => ({ label }))} currentStep={currentStep} />
    </div>
  );
}
