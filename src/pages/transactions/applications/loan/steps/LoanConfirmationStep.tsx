import { useTranslation } from "react-i18next";
import { CheckCircle } from "lucide-react";
import type { TransactionStepProps } from "../../../../../components/transactions/TransactionApplication";

/**
 * Final step after loan submit: success message + Back to Transactions.
 * Shown when currentStep === 3 in the 4-step loan flow.
 */
export function LoanConfirmationStep({ readOnly }: TransactionStepProps) {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      style={{ color: "var(--color-text)" }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full mb-6"
        style={{
          background: "var(--color-success-light)",
          color: "var(--color-success)",
        }}
      >
        <CheckCircle className="h-10 w-10" aria-hidden />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {t("transactions.loanFlow.requestSubmitted")}
      </h3>
      <p
        className="text-sm max-w-md"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {t("transactions.loanFlow.requestSubmittedDetail")}
      </p>
    </div>
  );
}
