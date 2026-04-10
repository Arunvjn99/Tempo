import type { TransferData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface TransferStepDestinationFundProps {
  totalSteps: number;
  t: TransferData;
  errors: Record<string, string>;
  mockFunds: readonly { id: string; name: string }[];
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateTransfer: (patch: Partial<TransferData>) => void;
}

export function TransferStepDestinationFund({
  totalSteps,
  t,
  errors,
  mockFunds,
  onNext,
  onBack,
  nextDisabled,
  updateTransfer,
}: TransferStepDestinationFundProps) {
  return (
    <StepLayout
      title="Destination fund"
      description="Pick a different fund to receive the transfer."
      stepNumber={4}
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
              className={transactionChoiceButtonClass(t.destinationFundId === f.id)}
              onClick={() => updateTransfer({ destinationFundId: f.id, destinationFundName: f.name })}
            >
              {f.name}
            </Button>
          ))}
        </div>
        {errors.destinationFund && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.destinationFund}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
