import type { ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export type SplitLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
  className?: string;
  /** When true (default), wraps in `container-app` */
  contained?: boolean;
  classNameSidebar?: string;
  classNameMain?: string;
};

/**
 * Main + sidebar: single column on small screens, two columns from `lg` (`layout-split`).
 * Sidebar uses `max-w-sidebar`-sized track; both regions are `min-w-0` for overflow safety.
 */
export function SplitLayout({
  sidebar,
  children,
  className,
  contained = true,
  classNameSidebar,
  classNameMain,
}: SplitLayoutProps) {
  return (
    <div className={cn(contained && "container-app", "layout-split", className)}>
      <aside className={cn("min-w-0", classNameSidebar)}>{sidebar}</aside>
      <div className={cn("min-w-0", classNameMain)}>{children}</div>
    </div>
  );
}
