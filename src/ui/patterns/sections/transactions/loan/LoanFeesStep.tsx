import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import { formatCurrency } from "@/features/transactions/services/format";
import type { LoanStepCommonProps } from "./loanStepTypes";

export function LoanFeesStep({ totalSteps, onNext, onBack, nextDisabled }: LoanStepCommonProps) {
  return (
    <StepLayout
      title="Fees & disclosures"
      description="Review standard fees that apply to plan loans."
      stepNumber={4}
      totalSteps={totalSteps}
    >
      <FormSection title="Fee summary">
        <ul className="list-inside list-disc space-y-xs text-sm text-secondary">
          <li>Loan origination fee: {formatCurrency(50)} (one-time)</li>
          <li>Annual maintenance: {formatCurrency(25)}</li>
          <li>Missed payment may affect eligibility for future loans</li>
        </ul>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
