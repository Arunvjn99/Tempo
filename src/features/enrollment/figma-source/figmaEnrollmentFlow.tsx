import { createPortal } from "react-dom";
import { Suspense, useCallback, useMemo, useState, type ReactElement } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { EnrollmentLayout } from "./components/enrollment-layout";
import {
  FigmaPersonalizationWizard,
  FigmaPlanSelection,
  FigmaContributionSetup,
  FigmaContributionSource,
  FigmaAutoIncrease,
  FigmaAutoIncreaseSetup,
  FigmaAutoIncreaseSkip,
  FigmaInvestmentStrategy,
  FigmaRetirementReadiness,
  FigmaReview,
  FigmaSuccess,
} from "./lazyScreens";
import { EnrollmentFlowNavProvider } from "./enrollmentFlowNav";

const routeSuspenseFallback = (
  <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--text-secondary)]">
    Loading…
  </div>
);

function withSuspense(el: ReactElement) {
  return <Suspense fallback={routeSuspenseFallback}>{el}</Suspense>;
}

/** Strip `/enrollment/` prefix; empty or `wizard` → wizard home. */
function toEnrollmentSubPath(to: string): string {
  const s = to.replace(/^\/enrollment\/?/, "").replace(/\/$/, "") || "";
  if (!s || s === "wizard") return "";
  return s;
}

function ModalEnrollmentScreen({ subPath }: { subPath: string }) {
  const s = subPath === "" || subPath === "wizard" ? "wizard" : subPath;
  switch (s) {
    case "wizard":
      return withSuspense(<FigmaPersonalizationWizard />);
    case "plan":
      return withSuspense(<FigmaPlanSelection />);
    case "contribution":
      return withSuspense(<FigmaContributionSetup />);
    case "contribution-source":
      return withSuspense(<FigmaContributionSource />);
    case "auto-increase":
      return withSuspense(<FigmaAutoIncrease />);
    case "auto-increase-setup":
      return withSuspense(<FigmaAutoIncreaseSetup />);
    case "auto-increase-skip":
      return withSuspense(<FigmaAutoIncreaseSkip />);
    case "investment":
      return withSuspense(<FigmaInvestmentStrategy />);
    case "readiness":
      return withSuspense(<FigmaRetirementReadiness />);
    case "review":
      return withSuspense(<FigmaReview />);
    case "success":
      return withSuspense(<FigmaSuccess />);
    default:
      return withSuspense(<FigmaPersonalizationWizard />);
  }
}

export type FigmaEnrollmentFlowProps = {
  onClose: () => void;
  /** After personalization wizard navigates to plan — close overlay and continue on main router. */
  onComplete: () => void;
};

/**
 * Full-screen overlay: **no nested `<Router>`** — uses {@link EnrollmentFlowNavProvider}
 * so Figma screens keep calling `navigate(ep(...))` via `useEnrollmentFlowNavigate`.
 */
export function FigmaEnrollmentFlow({ onClose, onComplete }: FigmaEnrollmentFlowProps) {
  const [subPath, setSubPath] = useState("");
  const rrNavigate = useNavigate();

  const navigateImpl = useCallback(
    (to: string | number, _opts?: unknown) => {
      if (typeof to === "number") {
        rrNavigate(to);
        return;
      }
      if (to === "/dashboard" || to.startsWith("/dashboard")) {
        onClose();
        rrNavigate(to);
        return;
      }
      if (!to.startsWith("/enrollment")) {
        rrNavigate(to);
        return;
      }
      const next = toEnrollmentSubPath(to);
      if (next === "plan") {
        onComplete();
        return;
      }
      setSubPath(next);
    },
    [onClose, onComplete, rrNavigate],
  );

  const navValue = useMemo(
    () => ({
      enrollmentSubPath: subPath,
      navigate: navigateImpl as NavigateFunction,
    }),
    [subPath, navigateImpl],
  );

  return createPortal(
    <div
      className="fixed inset-0 z-[10050] flex flex-col bg-[var(--surface-page)]"
      role="dialog"
      aria-modal="true"
      aria-label="Enrollment"
    >
      <div className="flex shrink-0 items-center justify-end gap-2 border-b border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-2">
        <button
          type="button"
          className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          onClick={onClose}
        >
          Close
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <EnrollmentFlowNavProvider value={navValue}>
          <EnrollmentLayout>
            <ModalEnrollmentScreen subPath={subPath} />
          </EnrollmentLayout>
        </EnrollmentFlowNavProvider>
      </div>
    </div>,
    document.body,
  );
}
