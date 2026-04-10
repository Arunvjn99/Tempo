import type { WithdrawalData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { FieldGroup, FormSection, StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";

export interface WithdrawalStepSourcesAmountsProps {
  totalSteps: number;
  w: WithdrawalData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
}

export function WithdrawalStepSourcesAmounts({
  totalSteps,
  w,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateWithdrawal,
}: WithdrawalStepSourcesAmountsProps) {
  return (
    <StepLayout
      title="Sources & amounts"
      description="Enter how much to take from each source. Total cannot exceed available balances."
      stepNumber={3}
      totalSteps={totalSteps}
    >
      <FormSection title="Available balances">
        <dl className="mb-lg grid gap-xs text-xs text-muted-foreground sm:grid-cols-2">
          <div>Pre-tax: {formatCurrency(w.availableSources.preTax)}</div>
          <div>Roth: {formatCurrency(w.availableSources.roth)}</div>
          <div>Employer: {formatCurrency(w.availableSources.employer)}</div>
          <div>After-tax: {formatCurrency(w.availableSources.afterTax)}</div>
        </dl>
        {(
          [
            ["preTax", "Pre-tax", w.availableSources.preTax],
            ["roth", "Roth", w.availableSources.roth],
            ["employer", "Employer", w.availableSources.employer],
            ["afterTax", "After-tax", w.availableSources.afterTax],
          ] as const
        ).map(([key, label, max]) => (
          <FieldGroup key={key} label={label} error={errors[key]}>
            <input
              type="number"
              min={0}
              max={max}
              step={100}
              value={w.selectedSources[key]}
              onChange={(e) => {
                const v = parseFloat(e.target.value) || 0;
                updateWithdrawal({
                  selectedSources: { ...w.selectedSources, [key]: v },
                });
              }}
              className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
        ))}
        {errors.sources && (
          <p className="text-xs text-danger" role="alert">
            {errors.sources}
          </p>
        )}
        <p className="text-sm font-medium text-foreground">
          Total withdrawal: {formatCurrency(w.totalAmount)}
        </p>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
