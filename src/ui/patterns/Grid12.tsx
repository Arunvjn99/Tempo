import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type Grid12Props = {
  children: ReactNode;
  className?: string;
  /** When true (default), wraps in `container-app` */
  contained?: boolean;
};

/**
 * 12-column grid from `md` up; single column below (`layout-grid-12`).
 * Children should use responsive `col-span-*` (e.g. `md:col-span-6`, `md:col-span-12`).
 */
export function Grid12({ children, className, contained = true }: Grid12Props) {
  return (
    <div className={cn(contained && "container-app", "layout-grid-12", className)}>{children}</div>
  );
}
