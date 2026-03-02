import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { EnrollmentHeaderWithStepper } from "../components/enrollment/EnrollmentHeaderWithStepper";
import { EnrollmentProvider } from "../enrollment/context/EnrollmentContext";
import { ChoosePlan } from "../pages/enrollment/ChoosePlan";
import { Contribution } from "../pages/enrollment/Contribution";
import { FutureContributions } from "../pages/enrollment/FutureContributions";
import { EnrollmentInvestmentsGuard } from "../components/enrollment/EnrollmentInvestmentsGuard";
import { EnrollmentInvestmentsContent } from "../components/enrollment/EnrollmentInvestmentsContent";
import { EnrollmentReviewContent } from "../components/enrollment/EnrollmentReviewContent";

const ENROLLMENT_STEP_PATHS = [
  "/enrollment/choose-plan",
  "/enrollment/contribution",
  "/enrollment/future-contributions",
  "/enrollment/investments",
  "/enrollment/review",
] as const;

function pathToStep(pathname: string): number {
  const normalized = pathname.replace(/\/$/, "") || "/";
  const i = ENROLLMENT_STEP_PATHS.indexOf(normalized as (typeof ENROLLMENT_STEP_PATHS)[number]);
  return i >= 0 ? i : 0;
}

function useIsEnrollmentStepPath(): boolean {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/$/, "") || "/";
  return ENROLLMENT_STEP_PATHS.some((p) => normalized === p || normalized.startsWith(p + "/"));
}

/** Render the correct enrollment step by pathname so navigation always shows the right page (works around Outlet not updating in some cases). */
function EnrollmentStepContent() {
  const { pathname } = useLocation();
  const normalized = pathname.replace(/\/$/, "") || "/";
  switch (normalized) {
    case "/enrollment/choose-plan":
      return <ChoosePlan />;
    case "/enrollment/contribution":
      return <Contribution />;
    case "/enrollment/future-contributions":
      return <FutureContributions />;
    case "/enrollment/investments":
      return (
        <EnrollmentInvestmentsGuard>
          <EnrollmentInvestmentsContent />
        </EnrollmentInvestmentsGuard>
      );
    case "/enrollment/review":
      return <EnrollmentReviewContent />;
    default:
      return <Outlet />;
  }
}

function EnrollmentStepLayout() {
  const location = useLocation();
  const isStep = useIsEnrollmentStepPath();
  const pathname = location.pathname;
  const step = pathToStep(pathname);

  if (isStep) {
    return (
      <DashboardLayout
        header={<DashboardHeader />}
        subHeader={<EnrollmentHeaderWithStepper activeStep={step} />}
        transparentBackground
      >
        <div key={pathname}>
          <EnrollmentStepContent />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <div key={pathname}>
      <Outlet />
    </div>
  );
}

/**
 * EnrollmentLayout - Wraps enrollment routes with EnrollmentProvider.
 * For step routes (choose-plan, contribution, future-contributions, investments, review),
 * wraps with DashboardLayout using the global DashboardHeader + enrollment stepper bar.
 * Seeds draft when available.
 *
 * Key by pathname so that when the URL changes (e.g. Contribution → Future Contributions),
 * the step layout remounts and always shows the correct page without requiring a reload.
 */
export const EnrollmentLayout = () => {
  const { pathname } = useLocation();
  return (
    <EnrollmentProvider>
      <EnrollmentStepLayout key={pathname} />
    </EnrollmentProvider>
  );
};
