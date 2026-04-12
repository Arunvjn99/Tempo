import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { FloatingObjects } from "./FloatingObjects";

export type HeroSceneProps = {
  className?: string;
  /** Optional overlay (e.g. future `<Canvas />` or HUD). */
  children?: ReactNode;
  /** When false, hides the default floating layer (e.g. if you inject a full canvas). */
  showFloatingLayer?: boolean;
};

/**
 * Hero-sized slot for a future Three.js / R3F scene. Ships with a gradient shell + {@link FloatingObjects}.
 */
export function HeroScene({ className, children, showFloatingLayer = true }: HeroSceneProps) {
  return (
    <div
      className={cn(
        "relative isolate h-full min-h-[160px] w-full overflow-hidden rounded-2xl border border-default/60 bg-gradient-to-br from-primary/[0.12] via-card to-background",
        className,
      )}
      data-3d-scene="hero"
      aria-hidden
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
      {showFloatingLayer ? <FloatingObjects /> : null}
      {children}
    </div>
  );
}
