// ─────────────────────────────────────────────
// Fund transfer flow — all steps
// ─────────────────────────────────────────────

import { useTransactionStore } from "../store";
import { MOCK_FUNDS } from "../store/constants/mockFunds";
import type { TransferMode } from "../store/types";
import { TransferStepAmount } from "@/ui/patterns/sections/transactions/transfer/TransferStepAmount";
import { TransferStepConfirm } from "@/ui/patterns/sections/transactions/transfer/TransferStepConfirm";
import { TransferStepDestinationFund } from "@/ui/patterns/sections/transactions/transfer/TransferStepDestinationFund";
import { TransferStepImpactPreview } from "@/ui/patterns/sections/transactions/transfer/TransferStepImpactPreview";
import { TransferStepReview } from "@/ui/patterns/sections/transactions/transfer/TransferStepReview";
import { TransferStepSourceFund } from "@/ui/patterns/sections/transactions/transfer/TransferStepSourceFund";
import { TransferStepSubmitted } from "@/ui/patterns/sections/transactions/transfer/TransferStepSubmitted";
import { TransferStepTransferType } from "@/ui/patterns/sections/transactions/transfer/TransferStepTransferType";

function computeMockImpact(
  sourceId: string,
  destId: string,
  mode: TransferMode,
  amount: number,
  percentage: number,
): Record<string, number> {
  const base: Record<string, number> = {};
  MOCK_FUNDS.forEach((f) => {
    base[f.id] = f.id === sourceId ? 22 : f.id === destId ? 28 : 12.5;
  });
  const delta = mode === "dollar" ? Math.min(amount / 1000, 5) : percentage / 20;
  const out = { ...base };
  if (sourceId) out[sourceId] = Math.max(0, (out[sourceId] ?? 0) - delta);
  if (destId) out[destId] = Math.min(100, (out[destId] ?? 0) + delta);
  return out;
}

interface TransferPagesProps {
  step: number;
  totalSteps: number;
  errors: Record<string, string>;
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  isLastStep: boolean;
  completedAt: string | null;
  onFinish: () => void;
}

export function TransferPages({
  step,
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  isLastStep,
  completedAt,
  onFinish,
}: TransferPagesProps) {
  const t = useTransactionStore((s) => s.transferData);
  const updateTransfer = useTransactionStore((s) => s.updateTransfer);
  const goToStep = useTransactionStore((s) => s.goToStep);

  const runImpact = () => {
    updateTransfer({
      impactCalculated: true,
      projectedNewAllocation: computeMockImpact(
        t.sourceFundId,
        t.destinationFundId,
        t.mode,
        t.amount,
        t.percentage,
      ),
    });
  };

  if (completedAt && isLastStep) {
    return (
      <TransferStepSubmitted step={step} totalSteps={totalSteps} completedAt={completedAt} onFinish={onFinish} />
    );
  }

  switch (step) {
    case 0:
      return (
        <TransferStepTransferType
          totalSteps={totalSteps}
          t={t}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateTransfer={updateTransfer}
        />
      );
    case 1:
      return (
        <TransferStepSourceFund
          totalSteps={totalSteps}
          t={t}
          errors={errors}
          mockFunds={MOCK_FUNDS}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateTransfer={updateTransfer}
        />
      );
    case 2:
      return (
        <TransferStepAmount
          totalSteps={totalSteps}
          t={t}
          errors={errors}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateTransfer={updateTransfer}
        />
      );
    case 3:
      return (
        <TransferStepDestinationFund
          totalSteps={totalSteps}
          t={t}
          errors={errors}
          mockFunds={MOCK_FUNDS}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          updateTransfer={updateTransfer}
        />
      );
    case 4:
      return (
        <TransferStepImpactPreview
          totalSteps={totalSteps}
          t={t}
          mockFunds={MOCK_FUNDS}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          onCalculateImpact={runImpact}
        />
      );
    case 5:
      return (
        <TransferStepReview
          totalSteps={totalSteps}
          t={t}
          onNext={onNext}
          onBack={onBack}
          nextDisabled={nextDisabled}
          goToStep={goToStep}
        />
      );
    case 6:
      return <TransferStepConfirm totalSteps={totalSteps} onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />;
    default:
      return null;
  }
}
