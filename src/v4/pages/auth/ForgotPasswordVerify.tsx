import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/ui/auth/AuthLayout";
import { AuthFormShell, AuthOTPInput, AuthButton } from "@/ui/auth";
import { CoreLogo } from "@/components/ui/CoreLogo";

export const ForgotPasswordVerify = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? "";
  const [otpValue, setOtpValue] = useState<string>("");

  const handleOTPComplete = (value: string) => {
    setOtpValue(value);
    if (value.length === 6) {
      navigate("/reset", { state: { email } });
    }
  };

  const handleVerify = () => {
    navigate("/reset", { state: { email } });
  };

  const handleResend = () => {
    // In a real app, would resend the code to email
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = <CoreLogo />;

  const bodySlot = (
    <>
      <AuthOTPInput onComplete={handleOTPComplete} />
      <AuthButton onClick={handleVerify} disabled={otpValue.length !== 6}>
        {t("auth.verifyContinue")}
      </AuthButton>
      <div className="flex flex-col items-center gap-2">
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleResend();
          }}
          aria-label={t("auth.resendCode")}
        >
          {t("auth.resendCode")}
        </a>
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => {
            e.preventDefault();
            handleBackToSignIn();
          }}
        >
          {t("auth.backToSignIn")}
        </a>
      </div>
    </>
  );

  const description = email
    ? t("auth.verificationCodeDescWithEmail", { email })
    : t("auth.verificationCodeDesc");

  return (
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.verificationCode")}
        description={description}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
