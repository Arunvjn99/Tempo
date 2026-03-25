import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AllocationRow {
  label: string;
  percent: number;
  /** CSS color for bar fill — use var(...) */
  barColorVar: string;
}

export interface PortfolioAllocationProps {
  title?: string;
  rows: AllocationRow[];
  onDetailsClick?: () => void;
  detailsLabel?: string;
  className?: string;
}

export function PortfolioAllocation({
  title = "Portfolio Allocation",
  rows,
  onDetailsClick,
  detailsLabel = "Details",
  className,
}: PortfolioAllocationProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] border border-[var(--border-subtle)] p-8 shadow-[var(--color-shadow-elevated)]",
        "bg-[var(--bg-secondary)]",
        className,
      )}
    >
      <div className="mb-8 flex items-center justify-between">
        <h3
          className="text-lg font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={onDetailsClick}
          className="flex items-center gap-1 text-sm font-bold text-[var(--color-primary)] transition-opacity hover:opacity-80"
        >
          {detailsLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      <div className="space-y-6">
        {rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-[var(--text-muted)]">{row.label}</span>
              <span className="font-bold text-[var(--text-primary)]">{row.percent}%</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-container)]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${row.percent}%`, background: row.barColorVar }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
