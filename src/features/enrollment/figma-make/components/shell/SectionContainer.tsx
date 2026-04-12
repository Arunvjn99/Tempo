import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type SectionContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** `page`: max-width review-style; `wide`: contribution grid; `fluid`: vertical stack only */
  maxWidth?: "page" | "wide" | "fluid";
};

/**
 * Outer section wrapper — replaces repeated `space-y-*` / `max-w-*` / `mx-auto` clusters.
 */
export function SectionContainer({
  children,
  className,
  maxWidth = "fluid",
  ...rest
}: SectionContainerProps) {
  return (
    <div
      className={cn(
        maxWidth === "page" && "fm-section-stack mx-auto max-w-3xl",
        maxWidth === "wide" && "mx-auto max-w-6xl",
        maxWidth === "fluid" && "space-y-8",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
