import type { ReactNode } from "react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, useLocation, useParams } from "react-router-dom";
import { isValidVersion } from "@/core/version";
import { ProtectedRoute } from "@/ui/auth/ProtectedRoute";
import { V4RootLayout } from "@/v4/layouts/RootLayout";
import { AuthLayoutRoute } from "@/v4/layouts/AuthLayoutRoute";
import { V4AppShell } from "@/v4/layouts/AppShell";
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
const PlaceholderPage = lazy(() =>
  import("@/v4/pages/PlaceholderPage").then((m) => ({ default: m.PlaceholderPage })),
);
const TransactionRouter = lazy(() =>
  import("@/features/transactions/pages/TransactionRouter").then((m) => ({ default: m.TransactionRouter })),
);

/** Heavy / feature routes — code-split for smaller initial bundle. */
const DashboardPage = lazy(() =>
  import("@/features/workspace/pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const ProfilePage = lazy(() =>
  import("@/features/workspace/pages/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const InvestmentsPage = lazy(() =>
  import("@/features/workspace/pages/InvestmentsPage").then((m) => ({ default: m.InvestmentsPage })),
);
const TransactionHubPage = lazy(() =>
  import("@/features/transactions/pages/TransactionHubPage").then((m) => ({ default: m.TransactionHubPage })),
);
const TransactionFlowPage = lazy(() =>
  import("@/features/transactions/pages/TransactionFlowPage").then((m) => ({ default: m.TransactionFlowPage })),
);
const EnrollmentRouter = lazy(() =>
  import("@/features/enrollment/pages/EnrollmentRouter").then((m) => ({ default: m.EnrollmentRouter })),
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
                <DashboardPage />
              </SuspensePage>
            ),
          },
          {
            path: "plans",
            element: (
              <SuspensePage>
                <PlaceholderPage titleKey="header.nav.plans" defaultTitle="Plans" />
              </SuspensePage>
            ),
          },
          {
            path: "profile",
            element: (
              <SuspensePage>
                <ProfilePage />
              </SuspensePage>
            ),
          },
          {
            path: "investments",
            element: (
              <SuspensePage>
                <InvestmentsPage />
              </SuspensePage>
            ),
          },
          {
            path: "transactions",
            element: (
              <SuspensePage>
                <TransactionRouter />
              </SuspensePage>
            ),
            children: [
              {
                index: true,
                element: (
                  <SuspensePage>
                    <TransactionHubPage />
                  </SuspensePage>
                ),
              },
              {
                path: ":txType",
                element: (
                  <SuspensePage>
                    <TransactionFlowPage />
                  </SuspensePage>
                ),
              },
            ],
          },
          {
            path: "enrollment",
            element: (
              <SuspensePage>
                <EnrollmentRouter />
              </SuspensePage>
            ),
          },
          {
            path: "settings",
            element: (
              <SuspensePage>
                <PlaceholderPage titleKey="header.nav.settings" defaultTitle="Settings" />
              </SuspensePage>
            ),
          },
        ],
      },
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
