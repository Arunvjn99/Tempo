import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { isValidVersion } from "@/core/version";
import { ProtectedRoute } from "@/ui/auth/ProtectedRoute";
import { V4RootLayout } from "@/v4/layouts/RootLayout";
import { AuthLayoutRoute } from "@/v4/layouts/AuthLayoutRoute";
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

/** TEMP (debug): single surface — RetireWise pre-enrollment sandbox (replaces legacy workspace dashboard). */
const PreEnrollmentSandbox = lazy(() =>
  import("@/features/enrollment/pages/PreEnrollmentSandbox").then((m) => ({ default: m.PreEnrollmentSandbox })),
);

function RouteSuspenseFallback() {
  return (
    <div
      className="flex min-h-[50vh] w-full items-center justify-center text-muted-foreground"
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

/** Legacy workspace URLs → canonical pre-enrollment surface. */
function RedirectToPreEnrollmentHome() {
  return <Navigate to="/dashboard" replace />;
}

export const v4Router = createBrowserRouter([
  {
    element: <V4RootLayout />,
    children: [
      { index: true, element: <Navigate to="/v1/login" replace /> },
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
      /**
       * TEMP (debug): one protected route — full-screen PreEnrollmentSandbox only (no V4AppShell).
       * Legacy workspace routes redirect here until the new UI ships broadly.
       */
      {
        element: (
          <ProtectedRoute>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: (
              <SuspensePage>
                <PreEnrollmentSandbox />
              </SuspensePage>
            ),
          },
          { path: "plans", element: <RedirectToPreEnrollmentHome /> },
          { path: "profile", element: <RedirectToPreEnrollmentHome /> },
          { path: "profile/*", element: <RedirectToPreEnrollmentHome /> },
          { path: "investments", element: <RedirectToPreEnrollmentHome /> },
          { path: "investments/*", element: <RedirectToPreEnrollmentHome /> },
          { path: "transactions", element: <RedirectToPreEnrollmentHome /> },
          { path: "transactions/*", element: <RedirectToPreEnrollmentHome /> },
          { path: "enrollment", element: <RedirectToPreEnrollmentHome /> },
          { path: "enrollment/*", element: <RedirectToPreEnrollmentHome /> },
          { path: "pre-enrollment", element: <RedirectToPreEnrollmentHome /> },
          { path: "pre-enrollment/sandbox", element: <RedirectToPreEnrollmentHome /> },
          { path: "settings", element: <RedirectToPreEnrollmentHome /> },
        ],
      },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
