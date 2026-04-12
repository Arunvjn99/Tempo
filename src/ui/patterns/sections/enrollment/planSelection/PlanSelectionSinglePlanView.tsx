import { ArrowRight, Info, Landmark } from "lucide-react";
import { Button } from "@/ui/components/Button";
import type { PlanType } from "@/features/enrollment/store/types";

export interface PlanSelectionCopyEntry {
  label: string;
  short: string;
  benefits: string[];
  singleBlurb: string;
}

export function PlanSelectionSinglePlanView({
  plan,
  copy,
  onConfirm,
}: {
  plan: PlanType;
  copy: PlanSelectionCopyEntry;
  onConfirm: (plan: PlanType) => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-4 md:py-6">
      <div className="card-standard w-full max-w-md space-y-5 p-6 text-center sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Landmark className="h-7 w-7 text-brand" aria-hidden />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-primary sm:text-xl">
            Your employer offers a {copy.label} retirement plan
          </h2>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-secondary">{copy.singleBlurb}</p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]/50 bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]/90 p-3 text-left dark:border-[color-mix(in_srgb,var(--color-success)_35%,var(--border-default))] dark:bg-[color-mix(in_srgb,var(--color-success)_18%,var(--surface-page))]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)] dark:text-[color-mix(in_srgb,var(--color-success)_75%,var(--surface-card))]" aria-hidden />
          <p className="text-[0.8rem] text-[color-mix(in_srgb,var(--color-success)_55%,var(--text-primary))] dark:text-[color-mix(in_srgb,var(--color-success)_75%,var(--surface-card))]">
            Your employer matches contributions up to 6%.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={() => onConfirm(plan)}
          className="w-full gap-2"
        >
          Continue to Contributions <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>

        <p className="text-[0.75rem] text-secondary">
          You can change this plan later from your account settings.
        </p>
      </div>
    </div>
  );
}
