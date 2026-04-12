import { useReducedMotion } from "framer-motion";
import { cn } from "@/core/lib/utils";

export type FloatingObjectsProps = {
  className?: string;
  /** `compact` fits command palette / tight layouts; `default` for hero-scale scenes. */
  variant?: "default" | "compact";
};

/**
 * Lightweight decorative “3D-ready” layer — CSS-only floating shapes until a real WebGL/Three scene mounts.
 * Swap this subtree for a `<Canvas>` later without changing call sites.
 */
export function FloatingObjects({ className, variant = "default" }: FloatingObjectsProps) {
  const reduce = useReducedMotion();
  const isCompact = variant === "compact";

  if (reduce) {
    return (
      <div
        className={cn("pointer-events-none absolute inset-0 overflow-hidden bg-background ring-1 ring-border/25", className)}
        aria-hidden
      />
    );
  }

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className={cn(
          "absolute animate-float rounded-full bg-primary/20 blur-2xl",
          isCompact ? "left-1/4 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2" : "left-[12%] top-[18%] size-32 md:size-40",
        )}
      />
      <div
        className={cn(
          "absolute animate-float-delayed rounded-full bg-primary/15 blur-xl [animation-delay:1.2s]",
          isCompact ? "right-1/4 top-1/3 size-12" : "right-[10%] top-[22%] size-24 md:size-32",
        )}
      />
      <div
        className={cn(
          "absolute animate-float rounded-2xl bg-surface-card shadow-sm ring-1 ring-border/60 shadow-lg ring-1 ring-border/50 [animation-delay:0.5s] [transform-style:preserve-3d]",
          isCompact ? "bottom-1 left-1/2 size-10 -translate-x-1/2" : "bottom-[14%] left-[20%] h-16 w-20 md:h-20 md:w-24",
        )}
        style={{ animationDuration: "7s" }}
      />
      <div
        className={cn(
          "absolute animate-float rounded-full border border-primary/25 bg-gradient-to-br from-primary/30 to-transparent [animation-delay:2s]",
          isCompact ? "right-1/3 top-1/2 size-8" : "right-[22%] bottom-[20%] size-14 md:size-16",
        )}
        style={{ animationDuration: "5.5s" }}
      />
    </div>
  );
}
