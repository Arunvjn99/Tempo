import type { WithdrawalData } from "@/features/transactions/store/types";
import { WD_TYPES } from "@/features/transactions/store/constants/withdrawalFlowConstants";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface WithdrawalStepWithdrawalTypeProps {
  totalSteps: number;
  w: WithdrawalData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
}

export function WithdrawalStepWithdrawalType({
  totalSteps,
  w,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateWithdrawal,
}: WithdrawalStepWithdrawalTypeProps) {
  return (
    <StepLayout
      title="Withdrawal type"
      description="Choose the distribution type that applies."
      stepNumber={2}
      totalSteps={totalSteps}
    >
      <FormSection>
        <div className="grid gap-sm sm:grid-cols-2">
          {WD_TYPES.map((t) => (
            <Button
              key={t.id}
              type="button"
              variant="custom"
              size="custom"
              className={transactionChoiceButtonClass(w.withdrawalType === t.id)}
              onClick={() => updateWithdrawal({ withdrawalType: t.id })}
            >
              <span className="block font-semibold">{t.label}</span>
              <span className="mt-xs block text-xs font-normal text-muted-foreground">{t.hint}</span>
            </Button>
          ))}
        </div>
        {errors.withdrawalType && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.withdrawalType}
          </p>
        )}
      </FormSection>
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
