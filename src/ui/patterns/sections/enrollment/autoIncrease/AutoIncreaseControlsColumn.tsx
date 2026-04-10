import { Calendar, Info, Target } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import { CYCLE_OPTIONS } from "@/features/enrollment/store/constants/autoIncreaseSetupConstants";
import { formatPercent } from "@/features/enrollment/store/derived";
import type { IncrementCycle } from "@/features/enrollment/store/types";

export interface AutoIncreaseControlsColumnProps {
  incrementCycle: IncrementCycle;
  autoIncreaseAmount: number;
  autoIncreaseMax: number;
  contributionPercent: number;
  amtPct: number;
  maxPct: number;
  onUpdateEnrollment: (patch: {
    incrementCycle?: IncrementCycle;
    autoIncreaseAmount?: number;
    autoIncreaseMax?: number;
  }) => void;
}

export function AutoIncreaseControlsColumn({
  incrementCycle,
  autoIncreaseAmount,
  autoIncreaseMax,
  contributionPercent,
  amtPct,
  maxPct,
  onUpdateEnrollment,
}: AutoIncreaseControlsColumnProps) {
  return (
    <div className="space-y-4 lg:col-span-3">
      <div className="rounded-2xl border-2 border-primary/30 bg-card px-4 py-3 shadow-sm">
        <h3 className="mb-2.5 text-[0.9rem] font-bold text-foreground">Increment Cycle</h3>
        <div className="grid grid-cols-3 gap-3">
          {CYCLE_OPTIONS.map((opt) => {
            const selected = incrementCycle === opt.value;
            return (
              <Button
                key={opt.value}
                type="button"
                variant="custom"
                size="custom"
                onClick={() => onUpdateEnrollment({ incrementCycle: opt.value })}
                className={cn(
                  "flex flex-col gap-2 rounded-xl border-2 p-3 text-left transition-all",
                  selected ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-4 w-4 shrink-0 rounded-full border-2",
                      selected ? "border-primary bg-primary" : "border-border bg-background",
                    )}
                    aria-hidden
                  />
                  <p className="text-[0.85rem] font-semibold text-foreground">{opt.label}</p>
                </div>
                <p className="ml-6 text-[0.7rem] text-muted-foreground">{opt.sub}</p>
              </Button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/5">
            <Calendar className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <label className="text-[0.85rem] font-medium text-foreground">
              How much do you want to increase per cycle?
            </label>
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[0.65rem] text-muted-foreground">0%</span>
                <span className="text-[0.9rem] font-bold text-primary tabular-nums">
                  {formatPercent(autoIncreaseAmount, 1)} per cycle
                </span>
                <span className="text-[0.65rem] text-muted-foreground">5%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.5}
                value={autoIncreaseAmount}
                onChange={(e) => onUpdateEnrollment({ autoIncreaseAmount: parseFloat(e.target.value) })}
                className="w-full cursor-pointer appearance-none rounded-full"
                style={{
                  height: "8px",
                  background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${amtPct}%, hsl(var(--border)) ${amtPct}%, hsl(var(--border)) 100%)`,
                }}
              />
            </div>
            <div className="mt-2 flex gap-2">
              {[1, 2, 3].map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => onUpdateEnrollment({ autoIncreaseAmount: v })}
                  className={cn(
                    "flex-1 rounded-lg py-1.5 text-[0.75rem] font-medium transition-all",
                    autoIncreaseAmount === v
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80",
                  )}
                >
                  {v}%
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <label className="text-[0.9rem] font-medium text-foreground">
              Stop increasing when contributions reach
            </label>
            <p className="mt-0.5 text-[0.78rem] text-muted-foreground">
              Your contribution rate will not exceed this percentage.
            </p>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[0.7rem] text-muted-foreground">{contributionPercent + 1}%</span>
                <span className="text-[1rem] font-bold text-foreground tabular-nums">{autoIncreaseMax}%</span>
                <span className="text-[0.7rem] text-muted-foreground">25%</span>
              </div>
              <input
                type="range"
                min={contributionPercent + 1}
                max={25}
                step={1}
                value={autoIncreaseMax}
                onChange={(e) => onUpdateEnrollment({ autoIncreaseMax: parseInt(e.target.value) })}
                className="w-full cursor-pointer appearance-none rounded-full"
                style={{
                  height: "8px",
                  background: `linear-gradient(to right, hsl(var(--foreground)) 0%, hsl(var(--foreground)) ${maxPct}%, hsl(var(--border)) ${maxPct}%, hsl(var(--border)) 100%)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 px-1">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-[0.78rem] text-muted-foreground">
          Automatic increases apply once per year. Your contribution will rise by the selected percentage each year
          until it reaches your maximum. You can change or disable this at any time.
        </p>
      </div>
    </div>
  );
}
