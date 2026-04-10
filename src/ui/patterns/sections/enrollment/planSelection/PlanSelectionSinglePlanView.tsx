import { ArrowRight, Info, Landmark } from "lucide-react";
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
    <div className="flex min-h-[60vh] items-center justify-center py-4">
      <div className="w-full max-w-md space-y-5 rounded-3xl border border-border bg-card p-6 text-center shadow-lg sm:p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Landmark className="h-7 w-7 text-primary" aria-hidden />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            Your employer offers a {copy.label} retirement plan
          </h2>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted-foreground">{copy.singleBlurb}</p>
        </div>

        <div className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-left dark:border-green-900/30 dark:bg-green-900/10">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-green-600 dark:text-green-400" aria-hidden />
          <p className="text-[0.8rem] text-green-700 dark:text-green-400">
            Your employer matches contributions up to 6%.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onConfirm(plan)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-[0.9rem] font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Continue to Contributions <ArrowRight className="h-4 w-4" aria-hidden />
        </button>

        <p className="text-[0.75rem] text-muted-foreground">
          You can change this plan later from your account settings.
        </p>
      </div>
    </div>
  );
}
