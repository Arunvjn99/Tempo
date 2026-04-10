import type { TransferData } from "@/features/transactions/store/types";
import { ActionBar } from "@/ui/components";
import { Button } from "@/ui/components/Button";
import { FormSection, StepLayout } from "@/ui/patterns";
import { formatPercent } from "@/features/transactions/services/format";

export interface TransferStepImpactPreviewProps {
  totalSteps: number;
  t: TransferData;
  mockFunds: readonly { id: string; name: string }[];
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  onCalculateImpact: () => void;
}

export function TransferStepImpactPreview({
  totalSteps,
  t,
  mockFunds,
  onNext,
  onBack,
  nextDisabled,
  onCalculateImpact,
}: TransferStepImpactPreviewProps) {
  return (
    <StepLayout
      title="Impact preview"
      description="Estimate how holdings may shift after this transfer."
      stepNumber={5}
      totalSteps={totalSteps}
    >
      <FormSection title="Projection">
        {!t.impactCalculated ? (
          <p className="text-sm text-muted-foreground">
            Calculate a mock allocation preview based on your selections.
          </p>
        ) : (
          <ul className="space-y-sm">
            {mockFunds.map((f) => (
              <li
                key={f.id}
                className="flex justify-between rounded-md border border-border bg-surface px-md py-sm text-sm"
              >
                <span className="text-foreground">{f.name}</span>
                <span className="font-medium text-primary">
                  {formatPercent(t.projectedNewAllocation[f.id] ?? 0, 1)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </FormSection>
      <ActionBar
        onNext={onNext}
        onBack={onBack}
        nextDisabled={nextDisabled}
        center={
          !t.impactCalculated ? (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={onCalculateImpact}
              className="rounded-button border border-border bg-card px-md py-sm text-sm font-medium text-foreground hover:bg-muted"
            >
              Calculate impact
            </Button>
          ) : undefined
        }
      />
    </StepLayout>
  );
}
