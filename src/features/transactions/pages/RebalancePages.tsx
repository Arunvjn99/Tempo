// ─────────────────────────────────────────────
// Rebalance flow — all steps
// ─────────────────────────────────────────────

import { useMemo } from "react";
import { useTransactionStore } from "../store";
import {
  ActionBar,
  AllocationEditor,
  ReviewCard,
  ReviewSection,
  type AllocationSlice,
} from "@/ui/components";
import { FormSection, StepLayout } from "@/ui/patterns";
import { formatCurrency, formatPercent } from "../services/format";
import { cn } from "@/core/lib/utils";

const SEGMENT_BG = [
  "bg-primary",
  "bg-success",
  "bg-warning",
  "bg-secondary",
] as const;

interface RebalancePagesProps {
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

export function RebalancePages({
  step,
  totalSteps,
  errors,
  onNext,
  onBack,
  nextDisabled,
  isLastStep,
  completedAt,
  onFinish,
}: RebalancePagesProps) {
  const rebalance = useTransactionStore((s) => s.rebalanceData);
  const updateRebalance = useTransactionStore((s) => s.updateRebalance);
  const goToStep = useTransactionStore((s) => s.goToStep);

  const targetSlices: AllocationSlice[] = useMemo(
    () =>
      rebalance.funds.map((f, i) => ({
        key: f.id,
        label: `${f.name} (${f.ticker})`,
        color: `var(--chart-${(i % 5) + 1})`,
        value: f.targetAllocation,
      })),
    [rebalance.funds],
  );

  if (completedAt && isLastStep) {
    return (
      <StepLayout
        title="Rebalance scheduled"
        description="Your trade instructions were recorded."
        stepNumber={step + 1}
        totalSteps={totalSteps}
      >
        <FormSection variant="highlight">
          <p className="text-sm text-foreground">{new Date(completedAt).toLocaleString()}</p>
        </FormSection>
        <ActionBar onNext={onFinish} hideBack nextLabel="Back to transactions" />
      </StepLayout>
    );
  }

  switch (step) {
    case 0:
      return (
        <StepLayout
          title="Current allocation"
          description="How your account is invested today."
          stepNumber={1}
          totalSteps={totalSteps}
        >
          <FormSection title="Overview">
            <ul className="space-y-sm">
              {rebalance.funds.map((f, i) => (
                <li
                  key={f.id}
                  className="flex items-center justify-between rounded-md border border-border bg-card px-md py-sm text-sm"
                >
                  <span className="flex items-center gap-sm">
                    <span
                      className={cn("h-3 w-3 shrink-0 rounded-full", SEGMENT_BG[i % SEGMENT_BG.length])}
                      aria-hidden
                    />
                    <span className="text-foreground">{f.name}</span>
                  </span>
                  <span className="font-medium text-primary">{formatPercent(f.currentAllocation)}</span>
                </li>
              ))}
            </ul>
          </FormSection>
          <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
        </StepLayout>
      );

    case 1:
      return (
        <StepLayout
          title="Adjust targets"
          description="Set target percentages. Allocations must total 100%."
          stepNumber={2}
          totalSteps={totalSteps}
        >
          <FormSection title="Target allocation">
            <AllocationEditor
              slices={targetSlices}
              onChange={(slices) => {
                const map = Object.fromEntries(slices.map((s) => [s.key, s.value]));
                updateRebalance({
                  funds: rebalance.funds.map((f) => ({
                    ...f,
                    targetAllocation: map[f.id] ?? f.targetAllocation,
                  })),
                });
              }}
              error={errors.allocations}
            />
          </FormSection>
          <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
        </StepLayout>
      );

    case 2:
      return (
        <StepLayout
          title="Trade preview"
          description="Estimated buys and sells to reach your targets."
          stepNumber={3}
          totalSteps={totalSteps}
        >
          <FormSection title="Proposed trades">
            {rebalance.trades.length === 0 ? (
              <p className="text-sm text-muted-foreground">No trades needed — already aligned with targets.</p>
            ) : (
              <ul className="space-y-sm">
                {rebalance.trades.map((tr) => (
                  <li
                    key={tr.fundId}
                    className="flex flex-wrap items-center justify-between gap-sm rounded-md border border-border bg-surface px-md py-sm text-sm"
                  >
                    <span className="font-medium text-foreground">{tr.fundName}</span>
                    <span
                      className={cn(
                        "rounded-full px-sm py-xs text-xs font-semibold",
                        tr.action === "buy"
                          ? "bg-success/15 text-success"
                          : "bg-danger/15 text-danger",
                      )}
                    >
                      {tr.action === "buy" ? "Buy" : "Sell"} {formatCurrency(tr.amount)}
                    </span>
                    <span className="w-full text-xs text-muted-foreground sm:w-auto">
                      {formatPercent(tr.fromPct)} → {formatPercent(tr.toPct)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </FormSection>
          <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
        </StepLayout>
      );

    case 3:
      return (
        <StepLayout
          title="Review rebalance"
          description="Confirm trades and submit."
          stepNumber={4}
          totalSteps={totalSteps}
        >
          <ReviewSection title="Targets">
            {rebalance.funds.map((f) => (
              <ReviewCard
                key={f.id}
                label={f.name}
                value={formatPercent(f.targetAllocation)}
                subValue={`Balance ${formatCurrency(f.currentBalance)}`}
                onEdit={() => goToStep(1)}
              />
            ))}
          </ReviewSection>
          <FormSection variant="muted">
            <p className="text-sm text-muted-foreground">
              {rebalance.trades.length} trade{rebalance.trades.length === 1 ? "" : "s"} will be generated
              if you continue.
            </p>
          </FormSection>
          <ActionBar
            onNext={onNext}
            onBack={onBack}
            nextDisabled={nextDisabled}
            nextLabel="Submit rebalance"
          />
        </StepLayout>
      );

    default:
      return null;
  }
}
