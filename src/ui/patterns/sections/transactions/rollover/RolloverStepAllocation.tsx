import type { RolloverData } from "@/features/transactions/store/types";
import { ALLOCATION_OPTIONS } from "@/features/transactions/store/constants/rolloverFlowConstants";
import { MOCK_FUNDS } from "@/features/transactions/store/constants/mockFunds";
import { AllocationEditor, ActionBar, type AllocationSlice } from "@/ui/components";
import { FormSection, StepLayout , transactionChoiceButtonClass } from "@/ui/patterns";
import { cn } from "@/core/lib/utils";

export interface RolloverStepAllocationProps {
  totalSteps: number;
  r: RolloverData;
  errors: Record<string, string>;
  customSlices: AllocationSlice[];
  onNext: () => void;
  onBack: () => void;
  nextDisabled: boolean;
  updateRollover: (patch: Partial<RolloverData>) => void;
}

export function RolloverStepAllocation({
  totalSteps,
  r,
  errors,
  customSlices,
  onNext,
  onBack,
  nextDisabled,
  updateRollover,
}: RolloverStepAllocationProps) {
  return (
    <StepLayout
      title="Investment allocation"
      description="Choose how incoming assets will be invested."
      stepNumber={4}
      totalSteps={totalSteps}
    >
      <FormSection title="Method">
        <div className="grid gap-sm">
          {ALLOCATION_OPTIONS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cn(transactionChoiceButtonClass(r.allocationMethod === a.id), "text-left")}
              onClick={() => {
                if (a.id === "custom") {
                  const n = MOCK_FUNDS.length;
                  const base = Math.floor(100 / n);
                  const customAllocations = Object.fromEntries(
                    MOCK_FUNDS.map((f, i) => [f.id, i === n - 1 ? 100 - base * (n - 1) : base]),
                  );
                  updateRollover({ allocationMethod: "custom", customAllocations });
                } else {
                  updateRollover({ allocationMethod: a.id });
                }
              }}
            >
              <span className="font-semibold">{a.label}</span>
              <span className="mt-xs block text-xs font-normal text-muted-foreground">{a.sub}</span>
            </button>
          ))}
        </div>
      </FormSection>
      {r.allocationMethod === "custom" && (
        <FormSection title="Custom allocation">
          <AllocationEditor
            slices={customSlices}
            onChange={(slices) => {
              const customAllocations: Record<string, number> = {};
              slices.forEach((s) => {
                customAllocations[s.key] = s.value;
              });
              updateRollover({ customAllocations });
            }}
            error={errors.allocations}
          />
        </FormSection>
      )}
      <ActionBar onNext={onNext} onBack={onBack} nextDisabled={nextDisabled} />
    </StepLayout>
  );
}
