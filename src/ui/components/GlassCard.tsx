import type { HTMLAttributes } from "react";
import { cn } from "@/core/lib/utils";

export type GlassCardProps = HTMLAttributes<HTMLDivElement>;

/**
 * Frosted glass surface — blur + border + shadow tokens from RetireWise reference.
 */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.04)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
