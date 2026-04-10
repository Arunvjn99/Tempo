import type { TransferData } from "@/features/transactions/store/types";
import { TRANSFER_TYPES } from "@/features/transactions/store/constants/transferFlowConstants";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface TransferStepTransferTypeProps {
  totalSteps: number;
  t: TransferData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateTransfer: (patch: Partial<TransferData>) => void;
}

export function TransferStepTransferType({
  totalSteps,
  t,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateTransfer,
}: TransferStepTransferTypeProps) {
  return (
    <StepLayout
      title="Transfer type"
      description="Choose what this transfer applies to."
      stepNumber={1}
      totalSteps={totalSteps}
    >
      <FormSection>
        <div className="grid gap-sm sm:grid-cols-2">
          {TRANSFER_TYPES.map((x) => (
            <Button
              key={x.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(t.transferType === x.id)}
              onClick={() => updateTransfer({ transferType: x.id })}
            >
              <span className="block text-sm font-semibold">{x.label}</span>
              <span className="mt-xs block text-xs text-muted-foreground">{x.sub}</span>
            </Button>
          ))}
        </div>
        {errors.transferType && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.transferType}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
