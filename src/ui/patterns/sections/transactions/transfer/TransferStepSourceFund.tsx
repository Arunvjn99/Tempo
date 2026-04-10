import type { TransferData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface TransferStepSourceFundProps {
  totalSteps: number;
  t: TransferData;
  errors: Record<string, string>;
  mockFunds: readonly { id: string; name: string }[];
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateTransfer: (patch: Partial<TransferData>) => void;
}

export function TransferStepSourceFund({
  totalSteps,
  t,
  errors,
  mockFunds,
  onNext,
  onBack,
  nextDisabled,
  updateTransfer,
}: TransferStepSourceFundProps) {
  return (
    <StepLayout
      title="Source fund"
      description="Select the fund to move assets from."
      stepNumber={2}
      totalSteps={totalSteps}
    >
      <FormSection>
        <div className="grid gap-sm sm:grid-cols-2">
          {mockFunds.map((f) => (
            <Button
              key={f.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(t.sourceFundId === f.id)}
              onClick={() => updateTransfer({ sourceFundId: f.id, sourceFundName: f.name })}
            >
              {f.name}
            </Button>
          ))}
        </div>
        {errors.sourceFund && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.sourceFund}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
