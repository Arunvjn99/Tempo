import { Minus, Plus, Sparkles } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { formatCurrency } from "@/features/enrollment/store/derived";
import { QUICK_OPTIONS } from "@/features/enrollment/store/constants/contributionPageConstants";

export interface ContributionSavingsLeftPanelProps {
  monthlyPaycheck: number;
  contributionPercent: number;
  percentInput: string;
  dollarInput: string;
  onPercentInputChange: (value: string) => void;
  onDollarInputChange: (value: string) => void;
  adjustPercent: (delta: number) => void;
  applyPercent: (p: number) => void;
  proTipAdd: number;
}

export function ContributionSavingsLeftPanel({
  monthlyPaycheck,
  contributionPercent,
  percentInput,
  dollarInput,
  onPercentInputChange,
  onDollarInputChange,
  adjustPercent,
  applyPercent,
  proTipAdd,
}: ContributionSavingsLeftPanelProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-lg">
      <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <p className="text-center text-[0.75rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Monthly Paycheck
        </p>
        <p className="mt-1 text-center text-[1.75rem] font-black text-foreground">{formatCurrency(monthlyPaycheck)}</p>
      </div>

      <div className="text-center">
        <p className="mb-3 text-[0.75rem] font-semibold uppercase tracking-wider text-muted-foreground">
          Your Contribution
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => adjustPercent(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 transition-colors hover:bg-primary/20"
            aria-label="Decrease percentage"
          >
            <Minus className="h-5 w-5 text-primary" aria-hidden />
          </button>
          <span className="text-[4rem] font-black leading-none text-primary" style={{ letterSpacing: "-0.02em" }}>
            {contributionPercent}%
          </span>
          <button
            type="button"
            onClick={() => adjustPercent(1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 transition-colors hover:bg-primary/20"
            aria-label="Increase percentage"
          >
            <Plus className="h-5 w-5 text-primary" aria-hidden />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Percentage
          </label>
          <input
            type="number"
            min={1}
            max={25}
            step={0.5}
            value={percentInput}
            onChange={(e) => onPercentInputChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
            Annual ($)
          </label>
          <input
            type="number"
            value={dollarInput}
            onChange={(e) => onDollarInputChange(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_OPTIONS.map((q) => (
            <button
              key={q.value}
              type="button"
              onClick={() => applyPercent(q.value)}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-[0.75rem] font-semibold transition-colors",
                contributionPercent === q.value
                  ? "border border-primary bg-primary/10 text-primary"
                  : "border border-border bg-muted text-foreground hover:border-primary/40 hover:bg-primary/5",
              )}
            >
              {q.icon ? `${q.icon} ` : ""}
              {q.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 flex justify-between text-[0.7rem] text-muted-foreground">
          <span>1%</span>
          <span className="font-medium text-foreground">{contributionPercent}%</span>
          <span>25%</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-200"
            style={{ width: `${((contributionPercent - 1) / 24) * 100}%` }}
          />
        </div>
        <input
          type="range"
          min={1}
          max={25}
          step={1}
          value={contributionPercent}
          onChange={(e) => applyPercent(Number(e.target.value))}
          className="relative mt-1 w-full cursor-pointer opacity-0"
          style={{ height: "8px", marginTop: "-8px" }}
        />
      </div>

      <div className="rounded-xl border border-purple-200/40 bg-gradient-to-br from-purple-50/60 to-purple-100/20 p-3.5 dark:border-purple-800/30 dark:from-purple-950/20 dark:to-purple-900/10">
        <div className="flex items-start gap-2.5">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-purple-500" aria-hidden />
          <p className="text-[0.8rem] text-muted-foreground">
            <span className="font-semibold text-foreground">Pro Tip: </span>
            Increasing just 1% could add ~{formatCurrency(proTipAdd * 12)} more per year to your retirement.
          </p>
        </div>
      </div>
    </div>
  );
}
