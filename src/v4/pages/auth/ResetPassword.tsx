import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/ui/auth/AuthLayout";
import { AuthFormShell, AuthPasswordInput, AuthButton } from "@/ui/auth";
import { CoreLogo } from "@/components/ui/CoreLogo";
import { PasswordStrength } from "@/ui/components/PasswordStrength";

export const ResetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = () => {
    navigate("/");
  };

  const handleBackToSignIn = () => {
    navigate("/");
  };

  const headerSlot = <CoreLogo />;

  const bodySlot = (
    <>
      <div className="flex flex-col gap-2">
        <AuthPasswordInput
          label={t("auth.newPassword")}
          name="newPassword"
          id="newPassword"
          placeholder={t("auth.enterNewPassword")}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <PasswordStrength password={newPassword} />
      </div>
      <AuthPasswordInput
        label={t("auth.confirmPassword")}
        name="confirmPassword"
        id="confirmPassword"
        placeholder={t("auth.confirmNewPassword")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <AuthButton onClick={handleResetPassword}>{t("auth.resetPassword")}</AuthButton>
      <div className="flex flex-col items-center gap-2">
        <a
          href="#"
          className="text-center text-sm text-[var(--color-primary)] no-underline hover:underline"
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
    <AuthLayout>
      <AuthFormShell
        headerSlot={headerSlot}
        title={t("auth.resetPasswordTitle")}
        description={t("auth.resetPasswordDesc")}
        bodySlot={bodySlot}
      />
    </AuthLayout>
  );
};
