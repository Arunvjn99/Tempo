import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

/** Reserved slot for future 3D canvas / model wrappers. */
export function Scene3DPlaceholder({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[120px] items-center justify-center rounded-card border border-dashed border-border bg-muted/30 text-sm text-muted-foreground",
        className,
      )}
    >
      {children ?? "3D content"}
    </div>
  );
}
