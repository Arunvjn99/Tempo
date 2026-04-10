import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type PageLayoutProps = {
  children: ReactNode;
  className?: string;
  /** When true (default), wraps in `container-app` */
  contained?: boolean;
};

/**
 * Vertical page stack with tokenized gaps (`layout-page`).
 * Pair with `container-app` for max-width + horizontal padding.
 */
export function PageLayout({ children, className, contained = true }: PageLayoutProps) {
  return (
    <div className={cn(contained && "container-app", "layout-page", className)}>{children}</div>
  );
}
