import { Sparkles, Minus, Plus } from "lucide-react";
import { EnrollmentCard } from "../shell";

export type QuickOption = { label: string; value: number; icon: string | null };

export type ContributionInputProps = {
  monthlyPaycheck: number;
  percent: number;
  salary: number;
  percentInput: string;
  dollarInput: string;
  onePercentImpact: number;
  quickOptions: QuickOption[];
  adjustPercent: (delta: number) => void;
  handlePercentInputChange: (value: string) => void;
  handleDollarInputChange: (value: string) => void;
  handleQuickOption: (value: number) => void;
  updateData: (updates: { contributionPercent: number }) => void;
  setPercentInput: (v: string) => void;
  setDollarInput: (v: string) => void;
};

/**
 * Left column — paycheck, contribution controls, quick select, slider, pro tip.
 */
export function ContributionInput({
  monthlyPaycheck,
  percent,
  salary,
  percentInput,
  dollarInput,
  onePercentImpact,
  quickOptions,
  adjustPercent,
  handlePercentInputChange,
  handleDollarInputChange,
  handleQuickOption,
  updateData,
  setPercentInput,
  setDollarInput,
}: ContributionInputProps) {
  return (
    <EnrollmentCard className="space-y-6 p-6">
      <div className="fm-inset-panel rounded-xl border border-[var(--color-info-border)] p-4 [background:var(--color-info-bg)]">
        <p className="text-center text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Monthly Paycheck
        </p>
        <p className="mt-1 text-center text-2xl font-bold text-[var(--text-primary)]">
          ${monthlyPaycheck.toLocaleString()}
        </p>
      </div>

      <div className="text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Your Contribution
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => adjustPercent(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))]"
            aria-label="Decrease percentage"
          >
            <Minus className="h-5 w-5 text-[var(--color-primary)]" />
          </button>
          <p className="text-6xl font-extrabold leading-none tracking-tight text-[var(--color-primary)]">
            {percent}%
          </p>
          <button
            type="button"
            onClick={() => adjustPercent(1)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_20%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] transition-colors hover:bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))]"
            aria-label="Increase percentage"
          >
            <Plus className="h-5 w-5 text-[var(--color-primary)]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Percentage
          </label>
          <div className="relative">
            <input
              type="number"
              min={1}
              max={25}
              step={0.5}
              value={percentInput}
              onChange={(e) => handlePercentInputChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-2.5 text-base font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-secondary)]">
              %
            </span>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
            Annual $
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--text-secondary)]">
              $
            </span>
            <input
              type="text"
              value={dollarInput}
              onChange={(e) => handleDollarInputChange(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-2.5 pl-7 pr-3 text-base font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
          Quick Select
        </p>
        <div className="flex flex-wrap gap-2">
          {quickOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => handleQuickOption(opt.value)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                percent === opt.value
                  ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] "
                  : "border border-[var(--border-default)] bg-[var(--surface-section)] text-[var(--text-primary)] hover:scale-105 hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-section))]"
              }`}
            >
              {opt.label} {opt.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="px-1">
        <input
          type="range"
          min={1}
          max={25}
          value={percent}
          onChange={(e) => {
            const newValue = Number(e.target.value);
            updateData({ contributionPercent: newValue });
            setPercentInput(String(newValue));
            setDollarInput(String(Math.round((salary * newValue) / 100)));
          }}
          className="h-2.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
          style={{
            background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${((percent - 1) / 24) * 100}%, var(--surface-section) ${((percent - 1) / 24) * 100}%, var(--surface-section) 100%)`,
          }}
        />
        <div className="mt-2 flex justify-between text-xs text-[var(--text-secondary)]">
          <span>1%</span>
          <span>25%</span>
        </div>
      </div>

      <div className="fm-inset-panel rounded-xl border border-[var(--color-info-border)] p-3.5 [background:var(--color-info-bg)]">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
          <div>
            <p className="mb-1 text-xs font-bold text-[var(--text-primary)]">Pro Tip</p>
            <p className="text-xs leading-normal text-[var(--text-secondary)]">
              Increasing just 1% could add ~${onePercentImpact.toLocaleString()} to your retirement
            </p>
          </div>
        </div>
      </div>
    </EnrollmentCard>
  );
}
