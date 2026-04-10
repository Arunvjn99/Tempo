import type { TransferData } from "@/features/transactions/store/types";
import { ActionBar, SliderInput } from "@/ui/components";
import { FieldGroup, FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface TransferStepAmountProps {
  totalSteps: number;
  t: TransferData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateTransfer: (patch: Partial<TransferData>) => void;
}

export function TransferStepAmount({
  totalSteps,
  t,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateTransfer,
}: TransferStepAmountProps) {
  return (
    <StepLayout
      title="Amount"
      description="Specify dollars or a percentage of the source fund."
      stepNumber={3}
      totalSteps={totalSteps}
    >
      <FormSection title="Mode">
        <div className="mb-md flex flex-wrap gap-sm">
          <button
            type="button"
            className={transactionChoiceButtonClass(t.mode === "dollar")}
            onClick={() => updateTransfer({ mode: "dollar" })}
          >
            Dollar amount
          </button>
          <button
            type="button"
            className={transactionChoiceButtonClass(t.mode === "percent")}
            onClick={() => updateTransfer({ mode: "percent" })}
          >
            Percentage
          </button>
        </div>
        {t.mode === "dollar" ? (
          <FieldGroup label="Amount (USD)" error={errors.amount}>
            <input
              type="number"
              min={1}
              step={100}
              value={t.amount || ""}
              onChange={(e) => updateTransfer({ amount: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
        ) : (
          <FieldGroup label="Percentage of source" error={errors.percentage}>
            <SliderInput
              label="Percent to transfer"
              value={t.percentage}
              onChange={(v) => updateTransfer({ percentage: v })}
              min={1}
              max={100}
              step={1}
              unit="%"
            />
          </FieldGroup>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
