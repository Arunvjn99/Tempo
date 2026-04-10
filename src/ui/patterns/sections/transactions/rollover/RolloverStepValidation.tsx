import type { RolloverData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout } from "@/ui/patterns";

export interface RolloverStepValidationProps {
  totalSteps: number;
  r: RolloverData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateRollover: (patch: Partial<RolloverData>) => void;
}

export function RolloverStepValidation({
  totalSteps,
  r,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateRollover,
}: RolloverStepValidationProps) {
  return (
    <StepLayout
      title="Account validation"
      description="Verify details with the custodian before continuing."
      stepNumber={2}
      totalSteps={totalSteps}
    >
      <FormSection title="Validation">
        <p className="mb-md text-sm text-muted-foreground">
          Run a mock validation against the account information you entered.
        </p>
        <div className="flex flex-wrap gap-sm">
          <Button
            type="button"
            variant="custom"
            size="custom"
            className="rounded-button bg-primary px-md py-sm text-sm font-semibold text-primary-foreground hover:opacity-90"
            onClick={() => updateRollover({ accountValidated: true, validationError: "" })}
          >
            Validate account
          </Button>
          <Button
            type="button"
            variant="custom"
            size="custom"
            className="rounded-button border border-border bg-surface px-md py-sm text-sm font-medium text-foreground hover:bg-muted"
            onClick={() =>
              updateRollover({
                accountValidated: false,
                validationError: "Account number could not be verified.",
              })
            }
          >
            Simulate failure
          </Button>
        </div>
        {r.accountValidated === true && (
          <p className="mt-md text-sm font-medium text-success">Account verified.</p>
        )}
        {errors.validation && (
          <p className="mt-md text-xs text-danger" role="alert">
            {errors.validation}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
