import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DashboardLayout } from "../../layouts/DashboardLayout";
import { DashboardHeader } from "../dashboard/DashboardHeader";
import { EnrollmentStepper } from "../enrollment/EnrollmentStepper";
import { LoanFlowStepper } from "./LoanFlowStepper";
import { TransactionFlowLayout } from "./TransactionFlowLayout";
import { TransactionFlowFooter } from "./TransactionFlowFooter";
import { transactionStore } from "../../data/transactionStore";
import { loadDraftSnapshot, saveDraftSnapshot, clearDraftSnapshot } from "../../lib/transactionDraftPersistence";
import type { TransactionType, Transaction } from "../../types/transactions";

/**
 * Step definition for transaction application flows
 */
export interface TransactionStepDefinition {
  stepId: string;
  label: string;
  component: React.ComponentType<TransactionStepProps>;
  validate?: (data: any) => boolean | Promise<boolean>;
}

/**
 * Props passed to each step component
 */
export interface TransactionStepProps {
  currentStep: number;
  totalSteps: number;
  transaction: Transaction;
  initialData?: any;
  onDataChange?: (data: any) => void;
  readOnly?: boolean;
}

/**
 * Props for TransactionApplication component
 */
export interface TransactionApplicationProps {
  transactionType: TransactionType;
  steps: TransactionStepDefinition[];
  initialData?: any;
  /** If provided, called on submit. If it returns/resolves, component navigates to /transactions. Pass onSuccess for custom navigation with state. */
  onSubmit?: (transaction: Transaction, data: any) => void | Promise<void>;
  /** If provided, called instead of default navigate("/transactions"). Use to pass success state. */
  onSuccessNavigate?: (transaction: Transaction, data: any) => void;
  readOnly?: boolean;
}

/**
 * Generic transaction application component that handles:
 * - Stepper rendering
 * - Current step index management
 * - Next / Back / Save & Exit behavior
 * - Final submit handling
 */
export const TransactionApplication = ({
  transactionType,
  steps,
  initialData,
  onSubmit,
  onSuccessNavigate,
  readOnly: propReadOnly,
}: TransactionApplicationProps) => {
  const { t } = useTranslation();
  const { transactionId } = useParams<{ transactionId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<any>(initialData || {});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  // Restore draft from sessionStorage when entering with a draft transaction
  useEffect(() => {
    if (!transactionId || draftRestored) return;
    const transaction = transactionStore.getTransaction(transactionId);
    if (!transaction || transaction.status !== "draft") return;
    const snapshot = loadDraftSnapshot(transactionId);
    if (snapshot && snapshot.transactionType === transaction.type) {
      setStepData((prev: any) => ({ ...prev, ...snapshot.stepData }));
      setCurrentStep(Math.min(snapshot.currentStep, steps.length - 1));
    }
    setDraftRestored(true);
  }, [transactionId, steps.length, draftRestored]);

  // Persist draft when step or data changes (draft only)
  useEffect(() => {
    if (!transactionId || !draftRestored) return;
    const transaction = transactionStore.getTransaction(transactionId);
    if (!transaction || transaction.status !== "draft") return;
    saveDraftSnapshot({
      transactionId,
      transactionType: transaction.type,
      currentStep,
      stepData,
      savedAt: new Date().toISOString(),
    });
  }, [transactionId, currentStep, stepData, draftRestored]);

  // Persist on page unload
  useEffect(() => {
    const onBeforeUnload = () => {
      const transaction = transactionId ? transactionStore.getTransaction(transactionId) : null;
      if (transaction?.status === "draft" && transactionId) {
        saveDraftSnapshot({
          transactionId,
          transactionType: transaction.type,
          currentStep,
          stepData,
          savedAt: new Date().toISOString(),
        });
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [transactionId, currentStep, stepData]);

  // If no transactionId, create a draft and redirect
  if (!transactionId) {
    const draft = transactionStore.createDraft(transactionType);
    navigate(`/transactions/${transactionType}/${draft.id}`, { replace: true });
    return null;
  }

  const transaction = transactionStore.getTransaction(transactionId);

  if (!transaction) {
    return (
      <DashboardLayout header={<DashboardHeader />}>
        <div className="transaction-application">
          <p>{t("transactions.transactionNotFound")}</p>
        </div>
      </DashboardLayout>
    );
  }

  // Determine read-only mode based on transaction status
  // Draft: editable (readOnly = false)
  // Active: read-only navigation only (readOnly = true)
  // Completed: fully read-only (readOnly = true)
  const readOnly = propReadOnly !== undefined 
    ? propReadOnly 
    : transaction.status !== "draft";

  const totalSteps = steps.length;
  const isLoanFourStep = transactionType === "loan" && totalSteps === 4;
  const isConfirmationStep = isLoanFourStep && currentStep === totalSteps - 1;
  const isSubmitStep = isLoanFourStep && currentStep === totalSteps - 2;
  const isLastStep = isLoanFourStep ? isSubmitStep : currentStep === totalSteps - 1;
  const currentStepDefinition = steps[currentStep];
  const CurrentStepComponent = currentStepDefinition.component;

  const handleNext = async () => {
    if (readOnly) {
      if (isConfirmationStep) {
        navigate("/transactions");
        return;
      }
      if (!isLastStep && !isConfirmationStep) {
        setCurrentStep(currentStep + 1);
      }
      return;
    }

    if (isConfirmationStep) {
      if (onSuccessNavigate) {
        onSuccessNavigate(transaction, stepData);
      } else {
        navigate("/transactions");
      }
      return;
    }

    if (isSubmitStep || isLastStep) {
      if (currentStepDefinition.validate) {
        const isValid = await currentStepDefinition.validate(stepData);
        if (!isValid) {
          setValidationError(t("transactions.validationConfirmTerms"));
          return;
        }
      }
      setValidationError(null);
      if (onSubmit) {
        await onSubmit(transaction, stepData);
      } else {
        console.log("Submit transaction", { transaction, stepData });
      }
      clearDraftSnapshot(transaction.id);
      if (isSubmitStep) {
        setCurrentStep(currentStep + 1);
      } else {
        if (onSuccessNavigate) {
          onSuccessNavigate(transaction, stepData);
        } else {
          navigate("/transactions");
        }
      }
      return;
    }

    if (currentStepDefinition.validate) {
      const isValid = await currentStepDefinition.validate(stepData);
      if (!isValid) {
        setValidationError(t("transactions.validationCompleteRequired"));
        return;
      }
    }
    setValidationError(null);
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveAndExit = () => {
    // Transaction is already saved as draft
    navigate("/transactions");
  };

  const handleDataChange = (data: any) => {
    if (readOnly) {
      // Prevent data changes in read-only mode
      return;
    }
    setStepData((prev: any) => ({ ...prev, ...data }));
  };

  // Build step labels for the stepper (translate keys)
  const stepLabels = steps.map((step) => t(step.label));

  const title = getTransactionTypeLabel(transactionType, t);
  const subtitle = t("transactions.stepOf", { current: currentStep + 1, total: totalSteps });

  const primaryLabel = isConfirmationStep
    ? t("transactions.loanFlow.backToTransactions")
    : isSubmitStep
      ? t("transactions.submit")
      : currentStep === 1 && isLoanFourStep
        ? t("transactions.loanFlow.continueToReview")
        : readOnly
          ? t("transactions.backToTransactions")
          : isLastStep
            ? t("transactions.submit")
            : t("transactions.next");

  return (
    <DashboardLayout header={<DashboardHeader />} transparentBackground>
      <TransactionFlowLayout
        title={isLoanFourStep ? t("transactions.loanFlow.retirementHub") : `${title} ${t("transactions.application")}`}
        subtitle={isConfirmationStep ? undefined : subtitle}
        onBack={() => navigate("/transactions")}
      >
        <div className="mb-8">
          {isLoanFourStep ? (
            <LoanFlowStepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          ) : (
            <EnrollmentStepper
              currentStep={currentStep}
              totalSteps={totalSteps}
              stepLabels={stepLabels}
            />
          )}
        </div>

        <div className="space-y-6 min-h-[400px]">
          {readOnly && (
            <div
              className="p-4 rounded-[var(--radius-lg)] border"
              style={{
                background: "var(--color-background-secondary)",
                borderColor: "var(--color-border)",
              }}
            >
              <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                {transaction.status === "completed" ? t("transactions.viewOnly") : t("transactions.readOnly")}
              </span>
              {transaction.status === "active" && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.processedMessage")}
                </p>
              )}
              {transaction.status === "completed" && (
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  {t("transactions.completedMessage")}
                </p>
              )}
            </div>
          )}
          <CurrentStepComponent
            currentStep={currentStep}
            totalSteps={totalSteps}
            transaction={transaction}
            initialData={stepData}
            onDataChange={handleDataChange}
            readOnly={readOnly}
          />
        </div>

        <TransactionFlowFooter
          currentStep={currentStep}
          totalSteps={totalSteps}
          primaryLabel={primaryLabel}
          primaryDisabled={false}
          onPrimary={readOnly ? () => navigate("/transactions") : handleNext}
          onBack={handleBack}
          onSaveAndExit={handleSaveAndExit}
          summaryText={validationError ?? undefined}
          summaryError={!!validationError}
          hideSaveAndExit={isConfirmationStep}
        />

        {isLoanFourStep && (
          <>
            <p
              className="text-center text-[11px] mt-8 max-w-2xl mx-auto"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {t("transactions.loanFlow.disclaimer")}
            </p>
            <footer
              className="mt-8 pt-6 border-t flex flex-wrap items-center justify-between gap-4"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <span className="text-xs">{t("transactions.loanFlow.copyright")}</span>
              <div className="flex gap-6">
                <a href="/security" className="text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>{t("transactions.loanFlow.security")}</a>
                <a href="/support" className="text-xs hover:underline" style={{ color: "var(--color-text-secondary)" }}>{t("transactions.loanFlow.support")}</a>
              </div>
            </footer>
          </>
        )}
      </TransactionFlowLayout>
    </DashboardLayout>
  );
};

const getTransactionTypeLabel = (type: TransactionType, t: (key: string) => string): string => {
  switch (type) {
    case "loan":
      return t("transactions.loanApplication");
    case "withdrawal":
      return t("transactions.withdrawalApplication");
    case "distribution":
      return t("transactions.distributionApplication");
    case "rollover":
      return t("transactions.rolloverApplication");
    case "transfer":
      return t("transactions.transferApplication");
    case "rebalance":
      return t("transactions.rebalanceApplication");
    default:
      return t("transactions.application");
  }
};
