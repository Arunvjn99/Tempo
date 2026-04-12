import { Component, type ErrorInfo, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { TEMP_BYPASS_DASHBOARD_REDIRECTS, TEMP_DEFAULT_APP_ROUTE } from "@/core/tempRoutingBypass";
import { Button } from "@/ui/components/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Class-based error boundary to catch render and commit-phase errors
 * (e.g. DOM removeChild when portals and key-based remounts conflict).
 * Uses theme tokens so temporary override and company branding apply.
 */
export class RouteErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("RouteErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4">
          <div className="w-full max-w-md rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-lg)]">
            <h1 className="text-xl font-semibold text-[var(--brand-primary)]">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              An unexpected error occurred. Please try again or go back to the dashboard.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={TEMP_BYPASS_DASHBOARD_REDIRECTS ? TEMP_DEFAULT_APP_ROUTE : "/dashboard"}
                className="rounded-lg px-4 py-2 text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {TEMP_BYPASS_DASHBOARD_REDIRECTS ? "Go to enrollment" : "Go to Dashboard"}
              </Link>
              {TEMP_BYPASS_DASHBOARD_REDIRECTS ? (
                <Link
                  to="/dashboard"
                  className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--brand-primary)]"
                >
                  Dashboard
                </Link>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-[var(--brand-primary)]"
              >
                Reload page
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
