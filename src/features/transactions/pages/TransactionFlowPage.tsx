// ─────────────────────────────────────────────
// TransactionFlowPage — step runner for :txType
// ─────────────────────────────────────────────

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "@/ui/animations";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useTransactionStore } from "../store";
import { getStepsForType } from "../store/steps";
import type { TransactionType } from "../store/types";
import { LoanPages } from "./LoanPages";
import { WithdrawalPages } from "./WithdrawalPages";
import { TransferPages } from "./TransferPages";
import { RolloverPages } from "./RolloverPages";
import { RebalancePages } from "./RebalancePages";
import { TransactionFlowProgressSection } from "@/ui/patterns";
import { LazyFloatingObjects } from "@/ui/3d";

const ALLOWED: TransactionType[] = ["loan", "withdrawal", "transfer", "rollover", "rebalance"];

function isTransactionType(s: string): s is TransactionType {
  return ALLOWED.includes(s as TransactionType);
}

export function TransactionFlowPage() {
  const { txType } = useParams<{ txType: string }>();
  const navigate = useNavigate();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const activeType = useTransactionStore((s) => s.activeType);
  const activeStep = useTransactionStore((s) => s.activeStep);
  const completedAt = useTransactionStore((s) => s.completedAt);
  const startFlow = useTransactionStore((s) => s.startFlow);
  const nextStep = useTransactionStore((s) => s.nextStep);
  const prevStep = useTransactionStore((s) => s.prevStep);
  const validate = useTransactionStore((s) => s.validate);
  const totalStepsFn = useTransactionStore((s) => s.totalSteps);
  const stepValid = useTransactionStore((s) => s.validate().valid);
  const completeFlow = useTransactionStore((s) => s.completeFlow);
  const resetFlow = useTransactionStore((s) => s.resetFlow);

  useEffect(() => {
    if (!txType || !isTransactionType(txType)) return;
    if (activeType !== txType) {
      startFlow(txType);
    }
  }, [txType, activeType, startFlow]);

  useEffect(() => {
    setFieldErrors({});
  }, [activeStep, txType]);

  const handleFinish = useCallback(() => {
    resetFlow();
    navigate("/transactions");
  }, [navigate, resetFlow]);

  const handleNext = useCallback(() => {
    const v = validate();
    if (!v.valid) {
      setFieldErrors(v.errors);
      return;
    }
    setFieldErrors({});

    const total = totalStepsFn();
    const lastIndex = total - 1;
    const atEnd = activeStep >= lastIndex;

    if (atEnd && !completedAt) {
      completeFlow();
      return;
    }
    if (!atEnd) {
      nextStep();
    }
  }, [activeStep, completedAt, completeFlow, nextStep, totalStepsFn, validate]);

  const handleBack = useCallback(() => {
    if (activeStep <= 0) {
      resetFlow();
      navigate("/transactions");
    } else {
      prevStep();
    }
  }, [activeStep, navigate, prevStep, resetFlow]);

  if (!txType || !isTransactionType(txType)) {
    return <Navigate to="/transactions" replace />;
  }

  if (activeType !== txType) {
    return (
      <div className="flex flex-col items-center gap-4 py-2xl text-center" aria-live="polite">
        <div className="relative h-24 w-full max-w-xs overflow-hidden rounded-2xl border border-border/60 bg-muted/20">
          <LazyFloatingObjects variant="compact" />
        </div>
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const totalSteps = totalStepsFn();
  const stepMeta = getStepsForType(txType);
  const isLastStep = activeStep >= totalSteps - 1;
  const nextDisabled = !stepValid && !(completedAt && isLastStep);

  const common = {
    step: activeStep,
    totalSteps,
    errors: fieldErrors,
    onNext: handleNext,
    onBack: handleBack,
    nextDisabled,
    isLastStep,
    completedAt,
    onFinish: handleFinish,
  };

  return (
    <div className="w-full">
      <TransactionFlowProgressSection
        stepLabels={stepMeta.map((s) => s.label)}
        currentStep={activeStep}
      />

      <AnimatePresence mode="wait">
        {txType === "loan" && <LoanPages key={`loan-${activeStep}`} {...common} />}
        {txType === "withdrawal" && <WithdrawalPages key={`wd-${activeStep}`} {...common} />}
        {txType === "transfer" && <TransferPages key={`tr-${activeStep}`} {...common} />}
        {txType === "rollover" && <RolloverPages key={`ro-${activeStep}`} {...common} />}
        {txType === "rebalance" && <RebalancePages key={`rb-${activeStep}`} {...common} />}
      </AnimatePresence>
    </div>
  );
}
