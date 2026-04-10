import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/context/AuthContext";
import { useOtp } from "@/core/globalStores/otpStore";
import { useDemoUser } from "@/core/hooks/useDemoUser";
import { getRoutingVersion, withVersion } from "@/core/version";
import { ScenarioFlowGuard } from "@/core/engine/flowGuard";

/**
 * Requires BOTH a Supabase session AND OTP verification — OR an active demo persona.
 *  - demo user active → render children (no auth needed)
 *  - loading → render nothing (avoids flash)
 *  - no user → redirect to versioned login
 *  - user but OTP not verified → redirect to versioned verify?mode=login
 *  - user + OTP verified → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const { isOtpVerified } = useOtp();
  const demoUser = useDemoUser();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname);
  const verifyLoginPath = `${withVersion(version, "/verify")}?mode=login`;

  if (demoUser) return <ScenarioFlowGuard>{children}</ScenarioFlowGuard>;

  if (loading) {
    return (
      <div
        className="min-h-screen min-h-[100dvh] bg-background"
        aria-busy="true"
        aria-label="Loading"
      >
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-muted/40" />
          <div className="mt-8 h-40 w-full animate-pulse rounded-2xl bg-muted/30" />
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to={withVersion(version, "/login")} replace />;
  if (!isOtpVerified) return <Navigate to={verifyLoginPath} replace />;

  return <>{children}</>;
}
