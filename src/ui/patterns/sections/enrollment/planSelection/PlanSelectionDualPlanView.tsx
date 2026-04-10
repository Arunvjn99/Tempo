import { useState } from "react";
import { Check, Sparkles, ArrowRight, MessageCircle, Info } from "lucide-react";
import { cn } from "@/core/lib/utils";
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
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-foreground sm:text-2xl">Choose Your Retirement Plan</h1>
        <p className="mt-1 text-[0.9rem] text-muted-foreground">
          Select the retirement plan that fits your tax strategy.
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-2.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <p className="text-[0.8rem] text-muted-foreground">
          Your employer matches contributions up to <strong className="text-foreground">6%</strong> of your salary
          — that&apos;s free money toward your retirement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectPlan("traditional")}
          onKeyDown={(e) => e.key === "Enter" && onSelectPlan("traditional")}
          className={cn(
            "flex cursor-pointer flex-col rounded-2xl border p-5 text-left shadow-sm transition-all",
            selectedPlan === "traditional"
              ? "border-2 border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md"
              : "border-border bg-card hover:border-primary/30 hover:shadow-md",
          )}
        >
          <div className="relative mb-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[0.7rem] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Most Common Choice
            </span>
          </div>

          <h3 className="text-lg font-semibold text-foreground">{planCopy.traditional.label}</h3>
          <p className="mt-1 text-[0.85rem] text-muted-foreground">{planCopy.traditional.short}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {planCopy.traditional.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContinueWithPlan("traditional");
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-[0.9rem] font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Continue with Traditional 401(k) <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectPlan("roth")}
          onKeyDown={(e) => e.key === "Enter" && onSelectPlan("roth")}
          className={cn(
            "flex cursor-pointer flex-col rounded-2xl border p-5 text-left shadow-sm transition-all",
            selectedPlan === "roth"
              ? "border-2 border-primary bg-primary/5 ring-2 ring-primary/30 shadow-md"
              : "border-border bg-card hover:border-primary/30 hover:shadow-md",
          )}
        >
          <h3 className="text-lg font-semibold text-foreground">{planCopy.roth.label}</h3>
          <p className="mt-1 text-[0.85rem] text-muted-foreground">{planCopy.roth.short}</p>

          <ul className="mt-4 flex-1 space-y-2">
            {planCopy.roth.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 text-[0.85rem] text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContinueWithPlan("roth");
            }}
            className={cn(
              "mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[0.9rem] font-semibold transition-all active:scale-[0.98]",
              selectedPlan === "roth"
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border-2 border-primary bg-card text-primary hover:bg-primary/5",
            )}
          >
            Choose Roth 401(k) <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      <p className="text-center text-[0.8rem] text-muted-foreground">
        You can change this plan later from your account settings.
      </p>

      <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" aria-hidden />
            <span className="text-[0.875rem] font-medium text-foreground">Not sure which to pick?</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAsk((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-purple-600 px-3 py-1.5 text-[0.8rem] font-medium text-white transition-all hover:bg-purple-700"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden />
              Ask AI
            </button>
            <button
              type="button"
              onClick={() => setShowCompare((o) => !o)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[0.8rem] font-medium text-foreground transition-all hover:bg-muted"
            >
              Compare Plans
            </button>
          </div>
        </div>

        {showAsk ? (
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-[0.85rem] dark:border-purple-900/30 dark:bg-purple-900/10">
            <p className="font-semibold text-foreground">Our recommendation for you:</p>
            <p className="mt-1 text-muted-foreground">
              Based on your profile, a <strong className="text-foreground">Traditional 401(k)</strong> may provide
              the most immediate tax benefit while you are in a higher earning phase. Consider Roth if you expect
              significantly higher income in retirement.
            </p>
          </div>
        ) : null}

        {showCompare ? (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-[0.8rem]">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">Feature</th>
                  <th className="px-3 py-2 text-left font-medium text-foreground">Traditional</th>
                  <th className="px-3 py-2 text-left font-medium text-foreground">Roth</th>
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={cn("border-b border-border last:border-0", i % 2 === 0 ? "bg-card" : "bg-muted/20")}
                  >
                    <td className="px-3 py-2 text-muted-foreground">{row.feature}</td>
                    <td className="px-3 py-2 text-foreground">{row.traditional}</td>
                    <td className="px-3 py-2 text-foreground">{row.roth}</td>
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
