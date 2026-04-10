import { Outlet } from "react-router-dom";
import { CoreAIModalProvider } from "@/core/context/CoreAIModalContext";
import { RouteErrorBoundary } from "@/ui/RouteErrorBoundary";
import { SplashScreen } from "@/ui/SplashScreen";

export function V4RootLayout() {
  return (
    <CoreAIModalProvider>
      <SplashScreen />
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </CoreAIModalProvider>
  );
}
