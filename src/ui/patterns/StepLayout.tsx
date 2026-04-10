import { type ReactNode } from "react";
import { cn } from "@/core/lib/utils";
import { StaggerItem, StaggerRoot } from "@/ui/animations/Stagger";
import { motionStagger } from "@/ui/animations/motionTokens";

interface StepLayoutProps {
  title: string;
  description?: string;
  stepNumber?: number;
  totalSteps?: number;
  children: ReactNode;
  className?: string;
  /** Additional content below description (e.g. badges, metadata) */
  headerExtra?: ReactNode;
}

/**
 * Enrollment / transaction step shell with staggered header + content motion.
 * Pair with a parent {@link AnimatePresence} for route or step changes.
 */
export function StepLayout({
  title,
  description,
  stepNumber,
  totalSteps,
  children,
  className,
  headerExtra,
}: StepLayoutProps) {
  return (
    <StaggerRoot className={cn("w-full space-y-xl", className)} stagger={motionStagger.normal}>
      <StaggerItem className="space-y-xs">
        {stepNumber != null && totalSteps != null && (
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Step {stepNumber} of {totalSteps}
          </p>
        )}
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground md:text-base">{description}</p>}
        {headerExtra}
      </StaggerItem>

      <StaggerItem className="space-y-lg">{children}</StaggerItem>
    </StaggerRoot>
  );
}
