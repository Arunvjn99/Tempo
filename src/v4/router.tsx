import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { isValidVersion } from "@/core/version";
import { ProtectedRoute } from "@/ui/auth/ProtectedRoute";
import { V4RootLayout } from "@/v4/layouts/RootLayout";
import { V4AppShell } from "@/v4/layouts/AppShell";
import { AuthLayoutRoute } from "@/v4/layouts/AuthLayoutRoute";
import { TEMP_BYPASS_DASHBOARD_REDIRECTS, TEMP_DEFAULT_APP_ROUTE } from "@/core/tempRoutingBypass";
import {
  FigmaEnrollmentLayout,
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
} from "@/features/enrollment/figma-make/lazyScreens";
import { transactionsFigmaRouteChildren } from "@/features/transactions/figmaRoutes";
import { FigmaTransactionsOutlet } from "@/features/transactions/FigmaTransactionsOutlet";
import { TransactionsFull } from "@/features/transactions/pages/TransactionsFull";
import { FigmaScope } from "@/ui/figma/FigmaScope";
import { EnrollmentThemeScope } from "@/features/enrollment/EnrollmentThemeScope";
/** Auth + shared pages — async chunks to keep the entry bundle small. */
const Login = lazy(() =>
  import("@/v4/pages/auth/Login").then((m) => ({ default: m.Login })),
);
const VerifyCode = lazy(() =>
  import("@/v4/pages/auth/VerifyCode").then((m) => ({ default: m.VerifyCode })),
);
const Signup = lazy(() =>
  import("@/v4/pages/auth/Signup").then((m) => ({ default: m.Signup })),
);
const ForgotPassword = lazy(() =>
  import("@/v4/pages/auth/ForgotPassword").then((m) => ({ default: m.ForgotPassword })),
);
const ForgotPasswordVerify = lazy(() =>
  import("@/v4/pages/auth/ForgotPasswordVerify").then((m) => ({ default: m.ForgotPasswordVerify })),
);
const ResetPassword = lazy(() =>
  import("@/v4/pages/auth/ResetPassword").then((m) => ({ default: m.ResetPassword })),
);
const HelpCenter = lazy(() =>
  import("@/v4/pages/auth/HelpCenter").then((m) => ({ default: m.HelpCenter })),
);

const PreEnrollmentDashboard = lazy(() =>
  import("@/features/enrollment/pages/PreEnrollmentDashboard").then((m) => ({
    default: m.PreEnrollmentDashboard,
  })),
);
const PlanSelectionPage = lazy(() =>
  import("@/features/enrollment/pages/PlanSelectionPage").then((m) => ({
    default: m.PlanSelectionPage,
  })),
);

function RouteSuspenseFallback() {
  return (
    <div
      className="flex min-h-[50vh] w-full items-center justify-center text-secondary"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
        <span className="text-sm font-medium">Loading…</span>
      </div>
    </div>
  );
}

function SuspensePage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<RouteSuspenseFallback />}>{children}</Suspense>;
}

function ValidatedVersionRoute({ children }: { children: ReactNode }) {
  const { version } = useParams();
  const { pathname, search } = useLocation();
  if (!isValidVersion(version ?? "")) {
    const to = pathname.replace(/^\/[^/]+/, "/v1");
    return <Navigate to={`${to}${search}`} replace />;
  }
  return <>{children}</>;
}

function RedirectToV1Login() {
  const { search } = useLocation();
  return <Navigate to={`/v1/login${search}`} replace />;
}

function RedirectToV1Verify() {
  const { search } = useLocation();
  return <Navigate to={`/v1/verify${search}`} replace />;
}

/** Legacy workspace URLs — TEMP: send to enrollment entry instead of dashboard when bypass is on. */
function RedirectToPreEnrollmentHome() {
  return (
    <Navigate to={TEMP_BYPASS_DASHBOARD_REDIRECTS ? TEMP_DEFAULT_APP_ROUTE : "/dashboard"} replace />
  );
}

/** Last-resort route: TEMP does not auto-redirect to dashboard (avoids stealing /enrollment/*). */
function TempUnknownRouteFallback() {
  if (TEMP_BYPASS_DASHBOARD_REDIRECTS) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center text-secondary">
        <p className="text-sm">No route matched (temporary build).</p>
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <a className="text-brand underline" href={TEMP_DEFAULT_APP_ROUTE}>
            Enrollment
          </a>
          <a className="text-brand underline" href="/dashboard">
            Dashboard
          </a>
          <a className="text-brand underline" href="/v1/login">
            Login
          </a>
        </div>
      </div>
    );
  }
  return <Navigate to="/dashboard" replace />;
}

export const v4Router = createBrowserRouter([
  {
    element: <V4RootLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "login", element: <RedirectToV1Login /> },
      { path: "verify", element: <RedirectToV1Verify /> },
      {
        element: <AuthLayoutRoute />,
        children: [
          {
            path: ":version/login",
            element: (
              <ValidatedVersionRoute>
                <SuspensePage>
                  <Login />
                </SuspensePage>
              </ValidatedVersionRoute>
            ),
          },
          {
            path: ":version/verify",
            element: (
              <ValidatedVersionRoute>
                <SuspensePage>
                  <VerifyCode />
                </SuspensePage>
              </ValidatedVersionRoute>
            ),
          },
          {
            path: "signup",
            element: (
              <SuspensePage>
                <Signup />
              </SuspensePage>
            ),
          },
        ],
      },
      {
        path: "forgot",
        element: (
          <SuspensePage>
            <ForgotPassword />
          </SuspensePage>
        ),
      },
      {
        path: "forgot/verify",
        element: (
          <SuspensePage>
            <ForgotPasswordVerify />
          </SuspensePage>
        ),
      },
      {
        path: "reset",
        element: (
          <SuspensePage>
            <ResetPassword />
          </SuspensePage>
        ),
      },
      {
        path: "help",
        element: (
          <SuspensePage>
            <HelpCenter />
          </SuspensePage>
        ),
      },
      {
        element: (
          <ProtectedRoute>
            <V4AppShell />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <SuspensePage>
                <PreEnrollmentDashboard />
              </SuspensePage>
            ),
          },
          {
            path: "enrollment",
            element: (
              <SuspensePage>
                <EnrollmentThemeScope>
                  <FigmaEnrollmentLayout />
                </EnrollmentThemeScope>
              </SuspensePage>
            ),
            children: [
              {
                index: true,
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "wizard",
                element: <Navigate to="/dashboard" replace />,
              },
              {
                path: "plan",
                element: (
                  <SuspensePage>
                    <FigmaPlanSelection />
                  </SuspensePage>
                ),
              },
              {
                path: "contribution",
                element: (
                  <SuspensePage>
                    <FigmaContributionSetup />
                  </SuspensePage>
                ),
              },
              {
                path: "contribution-source",
                element: (
                  <SuspensePage>
                    <FigmaContributionSource />
                  </SuspensePage>
                ),
              },
              {
                path: "auto-increase",
                element: (
                  <SuspensePage>
                    <FigmaAutoIncrease />
                  </SuspensePage>
                ),
              },
              {
                path: "auto-increase-setup",
                element: (
                  <SuspensePage>
                    <FigmaAutoIncreaseSetup />
                  </SuspensePage>
                ),
              },
              {
                path: "auto-increase-skip",
                element: (
                  <SuspensePage>
                    <FigmaAutoIncreaseSkip />
                  </SuspensePage>
                ),
              },
              {
                path: "investment",
                element: (
                  <SuspensePage>
                    <FigmaInvestmentStrategy />
                  </SuspensePage>
                ),
              },
              {
                path: "readiness",
                element: (
                  <SuspensePage>
                    <FigmaRetirementReadiness />
                  </SuspensePage>
                ),
              },
              {
                path: "review",
                element: (
                  <SuspensePage>
                    <FigmaReview />
                  </SuspensePage>
                ),
              },
              {
                path: "success",
                element: (
                  <SuspensePage>
                    <FigmaSuccess />
                  </SuspensePage>
                ),
              },
            ],
          },
          {
            path: "plans",
            element: (
              <SuspensePage>
                <PlanSelectionPage />
              </SuspensePage>
            ),
          },
          { path: "profile", element: <RedirectToPreEnrollmentHome /> },
          { path: "profile/*", element: <RedirectToPreEnrollmentHome /> },
          { path: "investments", element: <RedirectToPreEnrollmentHome /> },
          { path: "investments/*", element: <RedirectToPreEnrollmentHome /> },
          {
            path: "transactions-test",
            element: (
              <SuspensePage>
                <FigmaScope className="min-h-0 min-h-full flex-1 flex flex-col">
                  <TransactionsFull />
                </FigmaScope>
              </SuspensePage>
            ),
          },
          {
            path: "transactions",
            element: <FigmaTransactionsOutlet />,
            children: transactionsFigmaRouteChildren,
          },
          { path: "pre-enrollment", element: <RedirectToPreEnrollmentHome /> },
          { path: "pre-enrollment/sandbox", element: <RedirectToPreEnrollmentHome /> },
          { path: "settings", element: <RedirectToPreEnrollmentHome /> },
        ],
      },
      { path: "*", element: <TempUnknownRouteFallback /> },
    ],
  },
]);
