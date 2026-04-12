import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import type { LoanStepCommonProps, LoanStoreSlice } from "./loanStepTypes";

interface LoanDocumentsStepProps extends LoanStepCommonProps {
  errors: Record<string, string>;
  store: LoanStoreSlice;
}

export function LoanDocumentsStep({
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  store,
}: LoanDocumentsStepProps) {
  const { loan, updateLoan } = store;
  return (
    <StepLayout
      title="Documents"
      description="Confirm required documents are on file before submission."
      stepNumber={5}
      totalSteps={totalSteps}
    >
      <FormSection title="Required documents">
        <p className="mb-md text-sm text-secondary">
          In production, files upload here. For this flow, mark documents as complete to continue.
        </p>
        <label className="flex cursor-pointer items-start gap-md">
          <input
            type="checkbox"
            checked={loan.documentsComplete}
            onChange={(e) =>
              updateLoan({
                documentsComplete: e.target.checked,
                documentsUploaded: e.target.checked ? ["loan-agreement.pdf", "promissory-note.pdf"] : [],
              })
            }
            className="mt-0.5 h-4 w-4 rounded border-default text-brand focus:ring-primary"
          />
          <span className="text-sm text-primary">
            I confirm all required documents are uploaded and accurate.
          </span>
        </label>
        {errors.documents && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.documents}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
