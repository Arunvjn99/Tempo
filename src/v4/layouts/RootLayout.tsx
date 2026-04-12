import { Outlet } from "react-router-dom";
import { CoreAIModalProvider } from "@/core/context/CoreAIModalContext";
import { RouteErrorBoundary } from "@/ui/RouteErrorBoundary";

export function V4RootLayout() {
  return (
    <CoreAIModalProvider>
      <div className="min-h-screen min-h-[100dvh] opacity-100 bg-[var(--surface-page)]">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </div>
    </CoreAIModalProvider>
  );
}
