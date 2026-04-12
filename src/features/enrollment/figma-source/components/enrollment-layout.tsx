import "../styles/figma-make-enrollment.css";
import { useEffect, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { FigmaScope } from "@/ui/figma/FigmaScope";
import { useEnrollmentStore } from "../../store";
import type { EnrollmentStepId } from "../../store/types";
import { useEnrollmentFlowSubPath } from "../enrollmentFlowNav";
import { EnrollmentProvider } from "./enrollment-context";

const steps = [
  { label: "Plan", path: "/plan" },
  { label: "Contribution", path: "/contribution" },
  { label: "Source", path: "/contribution-source" },
  { label: "Auto Increase", path: "/auto-increase" },
  { label: "Investment", path: "/investment" },
  { label: "Readiness", path: "/readiness" },
  { label: "Review", path: "/review" },
];

/** Match Figma Make main segments; supports branch routes like `auto-increase-setup`. */
function mainStepNumberFromPath(sub: string): number {
  const p = sub.replace(/\/$/, "") || "";
  const segments = steps.map((s) => s.path.replace(/^\//, ""));
  let idx = segments.indexOf(p);
  if (idx === -1) {
    idx = segments.findIndex((seg) => p.startsWith(`${seg}-`));
  }
  return idx >= 0 ? idx + 1 : 1;
}

/** Keep Zustand `currentStep` aligned when Figma screens use `navigate()` without `nextStep()`. */
function enrollmentStepIdFromPath(sub: string): EnrollmentStepId {
  const p = sub.replace(/\/$/, "") || "";
  if (!p || p === "wizard") return "wizard";
  if (p === "success") return "success";
  if (p === "contribution-source") return "contribution-source";
  if (p === "contribution") return "contribution";
  if (p === "auto-increase-setup") return "auto-increase-setup";
  if (p === "auto-increase-skip") return "auto-increase-skip";
  if (p.startsWith("auto-increase")) return "auto-increase";
  if (p === "plan") return "plan";
  if (p === "investment") return "investment";
  if (p === "readiness") return "readiness";
  if (p === "review") return "review";
  return "wizard";
}

function EnrollmentLayoutInner({ children }: { children?: ReactNode }) {
  const sub = useEnrollmentFlowSubPath();
  const isSuccess = sub === "success";
  const isWizard = sub === "" || sub === "wizard";
  const showStepper = !isSuccess && !isWizard;
  const currentStep = mainStepNumberFromPath(sub);

  useEffect(() => {
    const id = enrollmentStepIdFromPath(sub);
    const cur = useEnrollmentStore.getState().currentStep;
    if (cur !== id) {
      useEnrollmentStore.setState({ currentStep: id });
    }
  }, [sub]);

  return (
    <FigmaScope className="enrollment-figma-flow flex min-h-0 min-h-full flex-1 flex-col bg-[var(--surface-page)]">
      {/* Wizard Banner (when on wizard) */}
      {isWizard && (
        <div className="bg-[linear-gradient(90deg,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary)_88%,var(--text-primary))_100%)] px-4 py-3 text-center">
          <p className="text-sm font-medium text-[var(--primary-foreground)]">
            Let's personalize your retirement plan in a few quick steps
          </p>
        </div>
      )}

      {/* Progress Stepper (enrollment flow only) */}
      {showStepper && (
        <div className="border-b border-[var(--border-default)] bg-[var(--surface-card)]  px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <p className="mb-2 text-[var(--text-secondary)] text-xs">
              Step {currentStep} of 7
            </p>
            <div className="flex items-center gap-1">
              {steps.map((step, i) => {
                const stepNum = i + 1;
                const isCompleted = stepNum < currentStep;
                const isCurrent = stepNum === currentStep;
                return (
                  <div key={step.label} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-center">
                      <div
                        className={`h-1.5 w-full rounded-full transition-colors ${
                          isCompleted
                            ? "bg-[var(--color-primary)]"
                            : isCurrent
                            ? "bg-[color:var(--color-primary)]"
                            : "bg-[var(--surface-section)]"
                        }`}
                      />
                    </div>
                    <span
                      className={`hidden md:block transition-colors text-xs ${
                        isCurrent
                          ? "font-semibold text-[color:var(--color-primary)]"
                          : isCompleted
                            ? "font-normal text-[var(--text-primary)]"
                            : "font-normal text-[var(--text-secondary)]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content — `children` when embedded without nested routes (e.g. dashboard modal). */}
      <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full">
        {children ?? <Outlet />}
      </main>
    </FigmaScope>
  );
}

export function EnrollmentLayout({ children }: { children?: ReactNode }) {
  return (
    <EnrollmentProvider>
      <EnrollmentLayoutInner>{children}</EnrollmentLayoutInner>
    </EnrollmentProvider>
  );
}
