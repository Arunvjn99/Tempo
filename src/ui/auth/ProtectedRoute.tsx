import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/context/AuthContext";
import { useOtp } from "@/core/globalStores/otpStore";
import { useDemoUser } from "@/core/hooks/useDemoUser";
import { getRoutingVersion, withVersion } from "@/core/version";
import { ScenarioFlowGuard } from "@/core/engine/flowGuard";

/**
 * TEMP (debug only): set `VITE_DEBUG_BYPASS_AUTH=true` in `.env.local` to open protected routes
 * without session/OTP while developing pre-enrollment UI. Does not change sign-in/sign-up logic.
 */
function isTemporaryProtectedAuthBypass(): boolean {
  return (
    import.meta.env.DEV &&
    String(import.meta.env.VITE_DEBUG_BYPASS_AUTH ?? "").toLowerCase() === "true"
  );
}

/**
 * TEMP (dev/QA only): skip auth and render protected routes without session.
 * Keep `false` so unauthenticated users are sent to login (no auto-redirect to dashboard).
 */
const TEMP_PROTECTED_ROUTES_ALLOW_ALL = false;

/**
 * Requires BOTH a Supabase session AND OTP verification — OR an active demo persona.
 *  - demo user active → render children (no auth needed)
 *  - loading → render nothing (avoids flash)
 *  - no user → redirect to `/login` (which forwards to versioned login)
 *  - user but OTP not verified → redirect to versioned verify?mode=login
 *  - user + OTP verified → render children
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (TEMP_PROTECTED_ROUTES_ALLOW_ALL) {
    return <>{children}</>;
  }

  const { user, loading } = useAuth();
  const { isOtpVerified } = useOtp();
  const demoUser = useDemoUser();
  const location = useLocation();
  const version = getRoutingVersion(location.pathname);
  const verifyLoginPath = `${withVersion(version, "/verify")}?mode=login`;

  if (isTemporaryProtectedAuthBypass()) {
    return <ScenarioFlowGuard>{children}</ScenarioFlowGuard>;
  }

  if (demoUser) return <ScenarioFlowGuard>{children}</ScenarioFlowGuard>;

  if (loading) {
    return (
      <div
        className="flex min-h-screen min-h-[100dvh] items-center justify-center bg-background"
        aria-busy="true"
        aria-label="Loading"
      >
        <div
          className="h-9 w-9 animate-spin rounded-full border-2 border-primary border-t-transparent"
          aria-hidden
        />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!isOtpVerified) return <Navigate to={verifyLoginPath} replace />;

  return <>{children}</>;
}
