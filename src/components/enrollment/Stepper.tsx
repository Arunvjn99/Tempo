import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { DesktopStepper } from "./DesktopStepper";
import { MobileStepper } from "./MobileStepper";

const MD_BREAKPOINT = 768;

export interface StepperProps {
  currentStepIndex: number;
  steps: readonly string[];
  onStepClick?: (index: number) => void;
  dense?: boolean;
  className?: string;
  /** Layout: horizontal (desktop rail) vs vertical (mobile summary). Omitted → derived from viewport. */
  variant?: "horizontal" | "vertical";
  /** Desktop stepper visual style (Figma wizard vs default); passed only to DesktopStepper. */
  desktopStepVariant?: "default" | "wizard";
}

export function Stepper({
  currentStepIndex,
  steps,
  onStepClick,
  dense = false,
  className,
  variant,
  desktopStepVariant = "default",
}: StepperProps) {
  const { t } = useTranslation();
  const safeSteps = steps ?? [];
  const n = safeSteps.length;
  const safeIndex = n <= 0 ? 0 : Math.min(Math.max(currentStepIndex, 0), n - 1);
  const stepOfLabel =
    n > 0
      ? t("enrollment.stepperStepOf", { current: safeIndex + 1, total: n })
      : "";

  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= MD_BREAKPOINT : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(`(min-width: ${MD_BREAKPOINT}px)`);
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const resolvedVariant = variant ?? (isDesktop ? "horizontal" : "vertical");

  if (n === 0) return null;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={safeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={n}
      aria-label={stepOfLabel}
    >
      {resolvedVariant === "horizontal" ? (
        <div className="w-full">
          <DesktopStepper
            currentStepIndex={currentStepIndex}
            steps={safeSteps}
            onStepClick={onStepClick}
            dense={dense}
            variant={desktopStepVariant}
          />
        </div>
      ) : (
        <div className="w-full">
          <MobileStepper
            currentStepIndex={currentStepIndex}
            steps={safeSteps}
            progressLabel={stepOfLabel}
          />
        </div>
      )}
    </div>
  );
}
