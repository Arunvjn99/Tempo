import type { WithdrawalData } from "@/features/transactions/store/types";
import { PAY } from "@/features/transactions/store/constants/withdrawalFlowConstants";
import { ActionBar } from "@/ui/components";
import { FieldGroup, FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";

export interface WithdrawalStepPaymentMethodProps {
  totalSteps: number;
  w: WithdrawalData;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateWithdrawal: (patch: Partial<WithdrawalData>) => void;
}

export function WithdrawalStepPaymentMethod({
  totalSteps,
  w,
  errors,
  onNext,
  onBack,
  nextDisabled,
  updateWithdrawal,
}: WithdrawalStepPaymentMethodProps) {
  return (
    <StepLayout
      title="Payment method"
      description="Choose how you want to receive funds."
      stepNumber={5}
      totalSteps={totalSteps}
    >
      <FormSection title="Method">
        <div className="grid gap-sm sm:grid-cols-2">
          {PAY.map((p) => (
            <button
              key={p.id}
              type="button"
              className={transactionChoiceButtonClass(w.paymentMethod === p.id)}
              onClick={() => updateWithdrawal({ paymentMethod: p.id })}
            >
              {p.label}
            </button>
          ))}
        </div>
        {errors.paymentMethod && (
          <p className="mt-sm text-xs text-danger" role="alert">
            {errors.paymentMethod}
          </p>
        )}
      </FormSection>
      {w.paymentMethod === "ach" && (
        <FieldGroup label="Bank account (last 4 digits)" error={errors.bankAccount}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={w.bankAccountLast4}
            onChange={(e) => updateWithdrawal({ bankAccountLast4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
            className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="1234"
          />
        </FieldGroup>
      )}
      {w.paymentMethod === "check" && (
        <FieldGroup label="Mailing address" error={errors.mailingAddress}>
          <textarea
            value={w.mailingAddress}
            onChange={(e) => updateWithdrawal({ mailingAddress: e.target.value })}
            rows={3}
            className="w-full rounded-md border border-border bg-background px-md py-sm text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </FieldGroup>
      )}
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
