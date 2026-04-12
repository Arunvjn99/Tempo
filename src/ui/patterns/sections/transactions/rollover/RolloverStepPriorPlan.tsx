import type { RolloverData } from "@/features/transactions/store/types";
import { ROLLOVER_TYPES } from "@/features/transactions/store/constants/rolloverFlowConstants";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FieldGroup, FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface RolloverStepPriorPlanProps {
  totalSteps: number;
  r: RolloverData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateRollover: (patch: Partial<RolloverData>) => void;
}

export function RolloverStepPriorPlan({
  totalSteps,
  r,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateRollover,
}: RolloverStepPriorPlanProps) {
  return (
    <StepLayout
      title="Prior plan details"
      description="Tell us about the account you are rolling over."
      stepNumber={1}
      totalSteps={totalSteps}
    >
      <FormSection>
        <div className="grid gap-md">
          <FieldGroup label="Previous employer" required error={errors.previousEmployer}>
            <input
              value={r.previousEmployer}
              onChange={(e) => updateRollover({ previousEmployer: e.target.value })}
              className="w-full rounded-md border border-default bg-background px-md py-sm text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
          <FieldGroup label="Plan administrator" required error={errors.planAdministrator}>
            <input
              value={r.planAdministrator}
              onChange={(e) => updateRollover({ planAdministrator: e.target.value })}
              className="w-full rounded-md border border-default bg-background px-md py-sm text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
          <FieldGroup label="Account number" required error={errors.accountNumber}>
            <input
              value={r.accountNumber}
              onChange={(e) => updateRollover({ accountNumber: e.target.value })}
              className="w-full rounded-md border border-default bg-background px-md py-sm text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
          <FieldGroup label="Estimated rollover amount" required error={errors.estimatedAmount}>
            <input
              type="number"
              min={1}
              step={100}
              value={r.estimatedAmount || ""}
              onChange={(e) => updateRollover({ estimatedAmount: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-md border border-default bg-background px-md py-sm text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </FieldGroup>
        </div>
        <p className="mt-md text-sm text-secondary">Account type</p>
        <div className="mt-sm grid gap-sm sm:grid-cols-3">
          {ROLLOVER_TYPES.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(r.rolloverType === t.id)}
              onClick={() => updateRollover({ rolloverType: t.id })}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
