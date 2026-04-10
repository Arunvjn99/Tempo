import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthInput, AuthPasswordInput, AuthButton } from "@/ui/auth";
import { AuthDemoModeBanner } from "./AuthDemoModeBanner";
import { LoginNetworkWarningBanner } from "./LoginNetworkWarningBanner";

export interface LoginFormSectionProps {
  email: string;
  onEmailChange: (value: string) => void;
  password: string;
  onPasswordChange: (value: string) => void;
  error: string | null;
  submitting: boolean;
  supabaseReady: boolean;
  canReachServer: boolean;
  detectedLogo: string | null;
  onLogin: () => void;
  onForgotPassword: () => void;
  onHelpCenter: () => void;
}

export function LoginFormSection({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  error,
  submitting,
  supabaseReady,
  canReachServer,
  detectedLogo,
  onLogin,
  onForgotPassword,
  onHelpCenter,
}: LoginFormSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      {detectedLogo && (
        <div className="flex justify-center">
          <img
            src={detectedLogo}
            alt="Company Preview"
            className="h-10 w-auto object-contain transition-opacity duration-300"
          />
        </div>
      )}
      {!supabaseReady && <AuthDemoModeBanner variant="login" />}
      {supabaseReady && !canReachServer && <LoginNetworkWarningBanner />}

      <div className="flex flex-col gap-6">
        <AuthInput
          label={t("auth.email")}
          type="email"
          name="email"
          id="email"
          placeholder={t("auth.enterEmail")}
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
        <div className="flex flex-col gap-2">
          <AuthPasswordInput
            label={t("auth.password")}
            name="password"
            id="password"
            placeholder={t("auth.enterPassword")}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm text-[var(--color-primary)] no-underline transition-colors hover:underline"
              onClick={(e) => {
                e.preventDefault();
                onForgotPassword();
              }}
            >
              {t("auth.forgotPassword")}
            </a>
          </div>
        </div>
        <AuthButton
          onClick={onLogin}
          disabled={submitting || !supabaseReady || !canReachServer}
          className="w-full"
        >
          {submitting ? t("auth.loggingIn", "Logging in…") : t("auth.login")}
        </AuthButton>

        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="rounded-lg border border-[var(--color-danger)]/20 bg-[var(--color-danger)]/5 px-4 py-3 text-sm text-[var(--color-danger)]"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-sm text-[var(--color-textSecondary)]">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[var(--color-primary)] no-underline hover:underline">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-[var(--color-textSecondary)]">
            {t("auth.stillNeedHelp")}{" "}
            <a
              href="#"
              className="text-[var(--color-primary)] no-underline hover:underline"
              onClick={(e) => {
                e.preventDefault();
                onHelpCenter();
              }}
            >
              {t("auth.helpCenter")}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
