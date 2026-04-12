import { useState } from "react";
import { Check, Sparkles, ArrowRight, MessageCircle, Info } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import { SelectableCard } from "@/ui/components/enrollment/SelectableCard";
import type { PlanType } from "@/features/enrollment/store/types";
import type { PlanSelectionCopyEntry } from "./PlanSelectionSinglePlanView";

export function PlanSelectionDualPlanView({
  planCopy,
  compareRows,
  selectedPlan,
  onSelectPlan,
  onContinueWithPlan,
}: {
  planCopy: Record<"traditional" | "roth", PlanSelectionCopyEntry>;
  compareRows: { feature: string; traditional: string; roth: string }[];
  selectedPlan: PlanType | null;
  onSelectPlan: (plan: PlanType) => void;
  onContinueWithPlan: (plan: PlanType) => void;
}) {
  const [showCompare, setShowCompare] = useState(false);
  const [showAsk, setShowAsk] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold text-primary sm:text-2xl">Choose Your Retirement Plan</h1>
        <p className="text-[0.9rem] text-secondary">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.06] px-4 py-2.5 dark:border-primary/30 dark:bg-primary/10">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
        <p className="text-[0.8rem] text-secondary">
          Your employer matches contributions up to <strong className="text-primary">6%</strong> of your salary
          — that&apos;s free money toward your retirement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
        <SelectableCard
          selected={selectedPlan === "traditional"}
          onClick={() => onSelectPlan("traditional")}
          className="h-full p-5"
        >
          <div className="relative mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))] px-2.5 py-0.5 text-[0.7rem] font-semibold text-[color-mix(in_srgb,var(--color-warning)_70%,var(--text-primary))] dark:bg-[color-mix(in_srgb,var(--color-warning)_22%,var(--surface-page))] dark:text-[color-mix(in_srgb,var(--color-warning)_85%,var(--surface-card))]">
              Most Common Choice
            </span>
          </div>

          <h3 className="text-lg font-semibold text-primary">{planCopy.traditional.label}</h3>
          <p className="mt-1 text-[0.85rem] text-secondary">{planCopy.traditional.short}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {planCopy.traditional.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-primary">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              onContinueWithPlan("traditional");
            }}
            className="mt-5 w-full gap-2"
          >
            Continue with Traditional 401(k) <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </SelectableCard>

        <SelectableCard
          selected={selectedPlan === "roth"}
          onClick={() => onSelectPlan("roth")}
          className="h-full p-5"
        >
          <h3 className="text-lg font-semibold text-primary">{planCopy.roth.label}</h3>
          <p className="mt-1 text-[0.85rem] text-secondary">{planCopy.roth.short}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {planCopy.roth.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-primary">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <Button
            type="button"
            variant={selectedPlan === "roth" ? "primary" : "secondary"}
            size="lg"
            onClick={(e) => {
              e.stopPropagation();
              onContinueWithPlan("roth");
            }}
            className={cn(
              "mt-5 w-full gap-2",
              selectedPlan !== "roth" && "border border-primary text-brand hover:bg-primary/5",
            )}
          >
            Choose Roth 401(k) <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </SelectableCard>
      </div>

      <p className="text-center text-[0.8rem] text-secondary">
        You can change this plan later from your account settings.
      </p>

      <div className="space-y-4 rounded-xl border border-default/60 bg-surface-soft p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
            <span className="text-[0.875rem] font-medium text-primary">Not sure which to pick?</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={() => setShowAsk((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-3 py-1.5 text-[0.8rem] font-medium text-primary-foreground transition-all hover:bg-[color-mix(in_srgb,var(--color-accent)_88%,var(--text-primary))]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Ask AI
            </Button>
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={() => setShowCompare((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-default/60 bg-surface-card px-3 py-1.5 text-[0.8rem] font-medium text-primary transition-all hover:bg-primary/5"
            >
              Compare Plans
            </Button>
          </div>
        </div>

        {showAsk ? (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-accent)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))] p-4 text-[0.85rem] dark:border-[color-mix(in_srgb,var(--color-accent)_35%,var(--border-default))] dark:bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--surface-page))]">
            <p className="font-semibold text-primary">Our recommendation for you:</p>
            <p className="mt-1 text-secondary">
              Based on your profile, a <strong className="text-primary">Traditional 401(k)</strong> may provide
              the most immediate tax benefit while you are in a higher earning phase. Consider Roth if you expect
              significantly higher income in retirement.
            </p>
          </div>
        ) : null}

        {showCompare ? (
          <div className="overflow-hidden rounded-lg border border-default/50 bg-surface-card">
            <table className="w-full text-[0.8rem]">
              <thead>
                <tr className="border-b border-default/50 bg-surface-soft">
                  <th className="px-3 py-2 text-left font-medium text-secondary">Feature</th>
                  <th className="px-3 py-2 text-left font-medium text-primary">Traditional</th>
                  <th className="px-3 py-2 text-left font-medium text-primary">Roth</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn(
                      "border-b border-default/40 last:border-0",
                      i % 2 === 0 ? "bg-surface-card" : "bg-surface-soft/70",
                    )}
                  >
                    <td className="px-3 py-2 text-secondary">{row.feature}</td>
                    <td className="px-3 py-2 text-primary">{row.traditional}</td>
                    <td className="px-3 py-2 text-primary">{row.roth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
