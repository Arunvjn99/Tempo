// ─────────────────────────────────────────────
// StepHeading — Figma title + subtitle scale
// ─────────────────────────────────────────────

import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";

interface StepHeadingProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

export function StepHeading({
  title,
  description,
  align = "left",
  className,
  children,
}: StepHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-1",
        align === "center" && "text-center",
        className,
      )}
    >
      <h2 className="text-lg font-semibold leading-snug text-foreground sm:text-xl">{title}</h2>
      {description && (
        <p className="text-[0.85rem] leading-relaxed text-muted-foreground">{description}</p>
      )}
      {children}
    </div>
  );
}
