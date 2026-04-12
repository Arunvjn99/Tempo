import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/features/enrollment/store/derived";

export interface AutoIncreaseSetupHeaderProps {
  contributionPercent: number;
  autoIncreaseMax: number;
  currentMonthly: number;
}

export function AutoIncreaseSetupHeader({
  contributionPercent,
  autoIncreaseMax,
  currentMonthly,
}: AutoIncreaseSetupHeaderProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <h1 className="text-xl font-semibold text-primary sm:text-2xl">
              Configure your automatic increases
            </h1>
          </div>
          <p className="mt-1 text-[0.9rem] text-secondary">
            Your contribution will gradually increase over time.
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="flex items-start gap-6">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-brand">Current</p>
              <p className="text-[1.5rem] font-extrabold leading-none text-primary">{contributionPercent}%</p>
              <p className="mt-1 text-[0.7rem] text-secondary">{formatCurrency(currentMonthly)}/mo</p>
            </div>
            <div className="border-l border-primary/20 pl-6">
              <p className="text-[0.65rem] font-bold uppercase tracking-wide text-brand">Target Max</p>
              <p className="text-[1.5rem] font-extrabold leading-none text-primary">{autoIncreaseMax}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
