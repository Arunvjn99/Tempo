import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/core/lib/utils";

export interface WizardFormSectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Step heading (Figma h2 scale). */
  headline?: ReactNode;
  /** Supporting line under headline. */
  description?: ReactNode;
  /** Vertical gap between stacked blocks (default 16px). */
  gap?: "tight" | "normal" | "relaxed";
  as?: "section" | "div";
}

const gapMap = {
  tight: "gap-sm",
  normal: "gap-md",
  relaxed: "gap-lg",
} as const;

/**
 * Vertical stack for a wizard step: optional headline + subtitle + children.
 * Spacing uses theme scale (sm/md/lg). Distinct from {@link FormSection} in `@/ui/patterns`.
 */
export function WizardFormSection({
  children,
  headline,
  description,
  gap = "normal",
  className,
  as: Tag = "section",
  ...props
}: WizardFormSectionProps) {
  return (
    <Tag
      className={cn("flex w-full min-w-0 flex-col items-stretch", gapMap[gap], className)}
      {...props}
    >
      {(headline != null || description != null) && (
        <header className="flex w-full flex-col gap-xs text-center sm:text-left">
          {headline != null && (
            <h2 className="text-xl font-bold leading-7 tracking-tight text-primary">
              {headline}
            </h2>
          )}
          {description != null && (
            <p className="text-enroll-lead leading-6 text-secondary">{description}</p>
          )}
        </header>
      )}
      {children}
    </Tag>
  );
}
