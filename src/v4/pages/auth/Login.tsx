import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CoreLogo } from "@/components/ui/CoreLogo";
import { AuthFormShell, AuthButton } from "@/ui/auth";
import { useAuth } from "@/core/context/AuthContext";
import { useOtp } from "@/core/globalStores/otpStore";
import { useNetwork } from "@/core/network/networkContext";
import { isSupabaseConfigured } from "@/services/authService";
import { demoNavigateTarget, type DemoScenarioId } from "@/core/data/demoScenarios";
import { getScenarioFlowStart } from "@/core/data/scenarioFlows";
import { useScenarioStore } from "@/core/globalStores/scenarioStore";
import { DEFAULT_VERSION, withVersion } from "@/core/version";
import { LoginExploreDemoSection, LoginFormSection } from "@/ui/patterns";

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { version: versionParam } = useParams<{ version: string }>();
  const version = versionParam ?? DEFAULT_VERSION;
  const [searchParams] = useSearchParams();
  const forceLogin = searchParams.get("force") === "true";
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const { isOtpVerified } = useOtp();
  const { status: networkStatus } = useNetwork();
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  const canAttemptLogin =
    networkStatus === "healthy" || networkStatus === "degraded";
  const supabaseReady = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sessionPanelError, setSessionPanelError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const showAlreadySignedInPanel = Boolean(user && isOtpVerified && !forceLogin);

  const handleLogin = async () => {
    setError(null);
    if (!supabaseReady) {
      setError("Supabase not configured. Use Explore Demo below or add .env — see README.");
      return;
    }
    if (!canAttemptLogin) {
      setError("Network unavailable. Please check your connection and try again.");
      return;
    }
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(`${withVersion(version, "/verify")}?mode=login`, { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = (id: DemoScenarioId) => {
    useScenarioStore.getState().setScenario(id);
    setShowDemoPanel(false);
    navigate(demoNavigateTarget(version, getScenarioFlowStart(id)));
  };

  const handleLogoutFromSessionPanel = async () => {
    setSessionPanelError(null);
    setLoggingOut(true);
    try {
      await signOut();
      navigate(`${withVersion(version, "/login")}`, { replace: true });
    } catch (err: unknown) {
      setSessionPanelError(err instanceof Error ? err.message : "Could not sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard", { replace: true });
  };

  if (authLoading) {
    return (
      <>
        <AuthFormShell
          headerSlot={<CoreLogo />}
          title={t("auth.login")}
          bodySlot={
            <p className="text-center text-sm text-secondary" role="status">
              {t("auth.loading", "Loading…")}
            </p>
          }
        />
        <LoginExploreDemoSection
          showPanel={showDemoPanel}
          onOpen={() => setShowDemoPanel(true)}
          onClose={() => setShowDemoPanel(false)}
          onSelectScenario={handleDemoLogin}
        />
      </>
    );
  }

  if (showAlreadySignedInPanel) {
    return (
      <>
        <AuthFormShell
          headerSlot={<CoreLogo />}
          title={t("auth.alreadySignedInTitle", "You're signed in")}
          bodySlot={
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm text-secondary">
                {t("auth.alreadySignedInBody", "You already have an active session.")}
              </p>
              {sessionPanelError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]"
                >
                  {sessionPanelError}
                </div>
              ) : null}
              <AuthButton type="button" variant="secondary" disabled={loggingOut} onClick={handleLogoutFromSessionPanel}>
                {loggingOut ? t("auth.signingOut", "Signing out…") : t("auth.logout", "Log out")}
              </AuthButton>
              <AuthButton type="button" onClick={handleGoToDashboard}>
                {t("auth.goToDashboard", "Go to dashboard")}
              </AuthButton>
              <p className="text-sm text-secondary">
                <Link
                  to={`${withVersion(version, "/login")}?force=true`}
                  className="text-[var(--color-primary)] underline-offset-2 hover:underline"
                >
                  {t("auth.signInAsAnother", "Sign in as another account")}
                </Link>
              </p>
            </div>
          }
        />
        <LoginExploreDemoSection
          showPanel={showDemoPanel}
          onOpen={() => setShowDemoPanel(true)}
          onClose={() => setShowDemoPanel(false)}
          onSelectScenario={handleDemoLogin}
        />
      </>
    );
  }

  return (
    <>
      <AuthFormShell
        headerSlot={<CoreLogo />}
        title={t("auth.login")}
        bodySlot={
          <>
            {forceLogin && user ? (
              <p className="mb-4 rounded-lg border border-default bg-background shadow-sm ring-1 ring-border/50 px-3 py-2 text-center text-xs text-secondary">
                {t(
                  "auth.forceLoginHint",
                  "You are forcing the sign-in form while a session exists. Signing in will replace the current session.",
                )}
              </p>
            ) : null}
            <LoginFormSection
              email={email}
              onEmailChange={setEmail}
              password={password}
              onPasswordChange={setPassword}
              error={error}
              submitting={submitting}
              supabaseReady={supabaseReady}
              canAttemptLogin={canAttemptLogin}
              showDegradedNetworkHint={networkStatus === "degraded"}
              onLogin={handleLogin}
              onForgotPassword={() => navigate("/forgot")}
              onHelpCenter={() => navigate("/help")}
            />
          </>
        }
      />

      <LoginExploreDemoSection
        showPanel={showDemoPanel}
        onOpen={() => setShowDemoPanel(true)}
        onClose={() => setShowDemoPanel(false)}
        onSelectScenario={handleDemoLogin}
      />
    </>
  );
};
