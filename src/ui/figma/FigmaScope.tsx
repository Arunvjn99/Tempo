import type { HTMLAttributes, ReactNode } from "react";
import { useTheme } from "@/core/context/ThemeContext";
import { cn } from "@/core/lib/utils";

/** Isolates Figma Make flows: pins CSS variables under `.figma-scope` (see `core/theme/figma-scope.css`). */
export function FigmaScope({ className, children, ...rest }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const { theme: effectiveMode } = useTheme();
  return (
    <div
      className={cn("figma-scope", className)}
      {...rest}
      data-theme={effectiveMode}
    >
      {children}
    </div>
  );
}
