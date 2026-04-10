import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type CardGridLayoutProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Responsive card grid: 1 → 2 → 3 → 4 columns with tokenized gaps (`layout-card-grid`).
 */
export function CardGridLayout({ children, className }: CardGridLayoutProps) {
  return <div className={cn("layout-card-grid", className)}>{children}</div>;
}
