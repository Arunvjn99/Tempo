import type { WithdrawalData } from "@/features/transactions/store/types";
import { ActionBar, SliderInput } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";

export interface WithdrawalStepTaxFeesProps {
  totalSteps: number;
  w: WithdrawalData;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
}

export function WithdrawalStepTaxFees({
  totalSteps,
  w,
  onNext,
  onBack,
  nextDisabled,
  updateWithdrawal,
}: WithdrawalStepTaxFeesProps) {
  return (
    <StepLayout
      title="Tax withholding & fees"
      description="Adjust withholding estimate. Net amount updates automatically."
      stepNumber={4}
      totalSteps={totalSteps}
    >
      <FormSection title="Withholding">
        <SliderInput
          label="Federal withholding estimate"
          value={Math.round(w.taxWithholding * 100)}
          onChange={(pct) => updateWithdrawal({ taxWithholding: pct / 100 })}
          min={0}
          max={45}
          step={1}
          unit="%"
        />
        <dl className="mt-lg space-y-sm text-sm">
          <div className="flex justify-between">
            <dt className="text-secondary">Gross amount</dt>
            <dd className="font-medium text-primary">{formatCurrency(w.totalAmount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-secondary">Estimated penalty</dt>
            <dd className="font-medium text-primary">{formatCurrency(w.penaltyAmount)}</dd>
          </div>
          <div className="flex justify-between border-t border-default pt-sm">
            <dt className="text-secondary">Estimated net to you</dt>
            <dd className="text-lg font-bold text-brand">{formatCurrency(w.netAmount, 2)}</dd>
          </div>
        </dl>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
