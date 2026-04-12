import type { HTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

export type GlassCardProps = HTMLAttributes<HTMLDivElement>;

/** Solid card surface — tokens only (no blur / alpha backgrounds). */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
