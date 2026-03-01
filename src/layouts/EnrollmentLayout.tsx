import { Outlet, useLocation } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { EnrollmentHeaderWithStepper } from "../components/enrollment/EnrollmentHeaderWithStepper";
import { EnrollmentProvider } from "../enrollment/context/EnrollmentContext";

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
        <div>
          <Outlet />
        </div>
      </DashboardLayout>
    );
  }
  return (
    <div>
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
 * AUDIT: No <Navigate>, no navigate(), no useEffect redirect, no step-order logic.
 * Layout is visual wrapper only; step guards live in step pages.
 */
export const EnrollmentLayout = () => {
  return (
    <EnrollmentProvider>
      <EnrollmentStepLayout />
    </EnrollmentProvider>
  );
};
