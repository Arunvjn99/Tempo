import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
} from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AuthInput,
  AuthPasswordInput,
  AuthButton,
} from "@/ui/auth";
import { AuthDemoModeBanner } from "./AuthDemoModeBanner";
import { SignupPasswordStrengthMeter } from "./SignupPasswordStrengthMeter";
import type { SignupCompanyOption, SignupFormErrors } from "./signupTypes";
import { useSignupStateCombobox } from "./signupForm/useSignupStateCombobox";
import { SignupFormAlerts } from "./signupForm/SignupFormAlerts";
import { SignupStateCombobox } from "./signupForm/SignupStateCombobox";
import { SignupCompanyField } from "./signupForm/SignupCompanyField";

export interface SignupFormSectionProps {
  name: string;
  setName: (v: string) => void;
  selectedState: string | null;
  setSelectedState: (v: string | null) => void;
  companyId: string;
  setCompanyId: (v: string) => void;
  companies: SignupCompanyOption[];
  companiesLoading: boolean;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  errors: SignupFormErrors;
  setErrors: Dispatch<SetStateAction<SignupFormErrors>>;
  serverError: string | null;
  successMessage: string | null;
  supabaseReady: boolean;
  onSubmit: (e: FormEvent) => void;
  loading: boolean;
}

export function SignupFormSection({
  name,
  setName,
  selectedState,
  setSelectedState,
  companyId,
  setCompanyId,
  companies,
  companiesLoading,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  errors,
  setErrors,
  serverError,
  successMessage,
  supabaseReady,
  onSubmit,
  loading,
}: SignupFormSectionProps) {
  const { t } = useTranslation();
  const stateCombo = useSignupStateCombobox(selectedState, setSelectedState, setErrors);

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4 overflow-visible md:grid-cols-2 md:gap-6"
      noValidate
    >
      {!supabaseReady && <AuthDemoModeBanner variant="signup" className="md:col-span-2" />}
      <SignupFormAlerts serverError={serverError} successMessage={successMessage} />

      <AuthInput
        label={t("auth.signupName")}
        type="text"
        name="name"
        id="signup-name"
        placeholder={t("auth.signupNamePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />

      <AuthInput
        label={t("auth.signupEmail")}
        type="email"
        name="email"
        id="signup-email"
        placeholder={t("auth.signupEmailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <SignupStateCombobox selectedState={selectedState} errors={errors} combo={stateCombo} />

      <SignupCompanyField
        companyId={companyId}
        setCompanyId={setCompanyId}
        companies={companies}
        companiesLoading={companiesLoading}
        errors={errors}
      />

      <div className="flex w-full flex-col gap-2">
        <AuthPasswordInput
          label={t("auth.signupPassword")}
          name="password"
          id="signup-password"
          placeholder={t("auth.signupPasswordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <SignupPasswordStrengthMeter password={password} />
      </div>

      <AuthPasswordInput
        label={t("auth.signupConfirmPassword")}
        name="confirmPassword"
        id="signup-confirm-password"
        placeholder={t("auth.signupConfirmPasswordPlaceholder")}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
      />

      <div className="md:col-span-2">
        <AuthButton
          type="submit"
          disabled={loading || companiesLoading || selectedState === null || !supabaseReady}
          aria-busy={loading}
          className="w-full"
        >
          {loading ? t("auth.signupSubmitting") : t("auth.signupSubmit")}
        </AuthButton>
      </div>

      <div className="md:col-span-2">
        <p className="text-center text-sm text-[var(--color-textSecondary)]">
          {t("auth.signupAlreadyHaveAccount")}{" "}
          <Link to="/" className="text-[var(--color-primary)] no-underline hover:underline">
            {t("auth.signupSignIn")}
          </Link>
        </p>
      </div>
    </form>
  );
}
