import { lazy, Suspense, type ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import type { FloatingObjectsProps } from "./FloatingObjects";
import type { HeroSceneProps } from "./HeroScene";

const HeroSceneModule = lazy(() => import("./HeroScene").then((m) => ({ default: m.HeroScene })));
const FloatingObjectsModule = lazy(() =>
  import("./FloatingObjects").then((m) => ({ default: m.FloatingObjects })),
);

function HeroSceneFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "min-h-[160px] w-full animate-pulse rounded-2xl border border-border/50 bg-muted/30",
        className,
      )}
      aria-hidden
    />
  );
}

function FloatingObjectsFallback({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex h-full min-h-[3.5rem] w-full items-center justify-center", className)}
      aria-hidden
    >
      <div className="size-10 animate-pulse rounded-full bg-primary/15" />
    </div>
  );
}

export type LazyHeroSceneProps = HeroSceneProps;

/** Lazy-loaded hero 3D shell — splits Three/R3F bundle when you add it inside {@link HeroScene}. */
export function LazyHeroScene({ className, ...props }: LazyHeroSceneProps) {
  return (
    <Suspense fallback={<HeroSceneFallback className={className} />}>
      <HeroSceneModule className={className} {...props} />
    </Suspense>
  );
}

export type LazyFloatingObjectsProps = FloatingObjectsProps;

/** Lazy-loaded floating layer for empty states and secondary surfaces. */
export function LazyFloatingObjects({ className, ...props }: LazyFloatingObjectsProps) {
  return (
    <Suspense fallback={<FloatingObjectsFallback className={className} />}>
      <FloatingObjectsModule className={className} {...props} />
    </Suspense>
  );
}

/** Convenience: wrap any future 3D subtree with Suspense + lightweight fallback. */
export function Suspense3D({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <Suspense fallback={fallback ?? <HeroSceneFallback />}>{children}</Suspense>;
}
