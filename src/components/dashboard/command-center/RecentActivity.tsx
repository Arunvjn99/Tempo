import { Check, Zap, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export type ActivityIconVariant = "primary" | "ai" | "muted";

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  variant?: ActivityIconVariant;
}

const variantRing: Record<ActivityIconVariant, string> = {
  primary: "bg-[var(--color-primary)] text-[var(--color-surface)]",
  ai: "bg-[var(--color-on-tertiary-container)] text-[var(--color-surface)]",
  muted: "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]",
};

export interface RecentActivityProps {
  title?: string;
  items: ActivityItem[];
  className?: string;
}

export function RecentActivity({ title = "Recent Activity", items, className }: RecentActivityProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] p-8 shadow-[var(--color-shadow-elevated)]",
        "bg-[var(--bg-secondary)]",
        className,
      )}
    >
      <h3
        className="mb-8 text-lg font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
      >
        {title}
      </h3>
      <div className="relative space-y-8 before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-0.5 before:bg-[var(--color-surface-container)] before:content-['']">
        {items.map((item) => {
          const Icon = item.icon ?? Check;
          const v = item.variant ?? "primary";
          return (
            <div key={item.id} className="relative flex items-start gap-6">
              <div
                className={cn(
                  "z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-4 ring-[var(--bg-secondary)]",
                  variantRing[v],
                )}
              >
                <Icon className="h-3 w-3" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">{item.title}</p>
                <p className="text-xs text-[var(--text-muted)]">{item.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
