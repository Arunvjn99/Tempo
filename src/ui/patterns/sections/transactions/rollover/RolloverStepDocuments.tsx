import type { RolloverData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface RolloverStepDocumentsProps {
  totalSteps: number;
  r: RolloverData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateRollover: (patch: Partial<RolloverData>) => void;
}

export function RolloverStepDocuments({
  totalSteps,
  r,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateRollover,
}: RolloverStepDocumentsProps) {
  return (
    <StepLayout
      title="Documents"
      description="Rollovers require certain paperwork on file."
      stepNumber={3}
      totalSteps={totalSteps}
    >
      <FormSection title="Checklist">
        <label className="flex cursor-pointer items-start gap-md">
          <input
            type="checkbox"
            checked={r.documentsComplete}
            onChange={(e) =>
              updateRollover({
                documentsComplete: e.target.checked,
                documentsUploaded: e.target.checked ? ["rollover-form.pdf", "statement.pdf"] : [],
              })
            }
            className="mt-0.5 h-4 w-4 rounded border-default text-brand focus:ring-primary"
          />
          <span className="text-sm text-primary">
            I confirm rollover documents are complete and uploaded.
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
