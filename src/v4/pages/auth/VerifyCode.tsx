import { useState } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthFormShell,
  AuthOTPInput,
  AuthButton,
} from "@/ui/auth";
import { CoreLogo } from "@/components/ui/CoreLogo";
import { VerifyCodeSuccessOverlay } from "@/ui/patterns/sections/auth/VerifyCodeSuccessOverlay";
import { useOtp } from "@/core/globalStores/otpStore";
import { DEFAULT_VERSION, withVersion } from "@/core/version";

export const VerifyCode = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { version: versionParam } = useParams<{ version: string }>();
  const version = versionParam ?? DEFAULT_VERSION;
  const [searchParams] = useSearchParams();
  const { setOtpVerified } = useOtp();

  const mode = searchParams.get("mode");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleVerify = () => {
    if (mode === "signup") {
      setShowSuccessModal(true);
    } else {
      setOtpVerified(true);
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate(withVersion(version, "/login"), { replace: true });
  };

  const handleBackToSignIn = () => {
    navigate(withVersion(version, "/login"));
  };

  const headerSlot = <CoreLogo />;

  const bodySlot = (
    <>
      <AuthOTPInput onComplete={handleVerify} />
      <AuthButton onClick={handleVerify}>
        {t("auth.verifyContinue")}
      </AuthButton>
      <div className="flex flex-col items-center gap-2">
        <a
          href="#"
          className="text-sm text-[var(--color-primary)] no-underline hover:underline"
          onClick={(e) => e.preventDefault()}
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

  return (
    <>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.verificationCode")}
        description={t("auth.verificationCodeDesc")}
        bodySlot={bodySlot}
      />

      {showSuccessModal ? <VerifyCodeSuccessOverlay onContinue={handleSuccessClose} /> : null}
    </>
  );
};
