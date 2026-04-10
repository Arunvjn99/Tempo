import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthFormShell } from "@/ui/auth";
import { Logo } from "@/ui/brand/Logo";
import { useAuth } from "@/core/context/AuthContext";
import { useOtp } from "@/core/globalStores/otpStore";
import { useNetwork } from "@/core/network/networkContext";
import { isSupabaseConfigured } from "@/services/authService";
import { fetchCompanyLogoUrlByDomain } from "@/services/companyLookup";
import { demoNavigateTarget, type DemoScenarioId } from "@/core/data/demoScenarios";
import { getScenarioFlowStart } from "@/core/data/scenarioFlows";
import { useScenarioStore } from "@/core/globalStores/scenarioStore";
import { DEFAULT_VERSION, withVersion } from "@/core/version";
import { LoginExploreDemoSection, LoginFormSection } from "@/ui/patterns";

const DOMAIN_LOOKUP_DEBOUNCE_MS = 500;

export const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { version: versionParam } = useParams<{ version: string }>();
  const version = versionParam ?? DEFAULT_VERSION;
  const { user, loading: authLoading, signIn } = useAuth();
  const { isOtpVerified } = useOtp();
  const { status: networkStatus } = useNetwork();
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  const canReachServer = networkStatus === "healthy";
  const supabaseReady = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detectedLogo, setDetectedLogo] = useState<string | null>(null);
  const domainLookupTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (user && isOtpVerified) {
      navigate("/dashboard", { replace: true });
    }
  }, [authLoading, user, isOtpVerified, navigate, version]);

  useEffect(() => {
    const domain = email.trim().split("@")[1];
    if (!domain) {
      setDetectedLogo(null);
      return;
    }
    if (domainLookupTimeoutRef.current) {
      clearTimeout(domainLookupTimeoutRef.current);
      domainLookupTimeoutRef.current = null;
    }
    domainLookupTimeoutRef.current = setTimeout(async () => {
      domainLookupTimeoutRef.current = null;
      try {
        const logoUrl = await fetchCompanyLogoUrlByDomain(domain);
        setDetectedLogo(logoUrl);
      } catch (err) {
        if (import.meta.env.DEV) console.error("[Login] domain logo lookup failed:", err);
        setDetectedLogo(null);
      }
    }, DOMAIN_LOOKUP_DEBOUNCE_MS);
    return () => {
      if (domainLookupTimeoutRef.current) {
        clearTimeout(domainLookupTimeoutRef.current);
      }
    };
  }, [email]);

  const handleLogin = async () => {
    setError(null);
    if (!supabaseReady) {
      setError("Supabase not configured. Use Explore Demo below or add .env — see README.");
      return;
    }
    if (!canReachServer) return;
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
      navigate(`${withVersion(version, "/verify")}?mode=login`, { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoLogin = (id: DemoScenarioId) => {
    useScenarioStore.getState().setScenario(id);
    setShowDemoPanel(false);
    navigate(demoNavigateTarget(version, getScenarioFlowStart(id)));
  };

  return (
    <>
      <AuthFormShell
        headerSlot={<Logo className="max-h-8 w-auto" />}
        title={t("auth.login")}
        bodySlot={
          <LoginFormSection
            email={email}
            onEmailChange={setEmail}
            password={password}
            onPasswordChange={setPassword}
            error={error}
            submitting={submitting}
            supabaseReady={supabaseReady}
            canReachServer={canReachServer}
            detectedLogo={detectedLogo}
            onLogin={handleLogin}
            onForgotPassword={() => navigate("/forgot")}
            onHelpCenter={() => navigate("/help")}
          />
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
