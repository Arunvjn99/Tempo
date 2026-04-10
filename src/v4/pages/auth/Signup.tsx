import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthFormShell } from "@/ui/auth";
import { Logo } from "@/ui/brand/Logo";
import { useAuth } from "@/core/context/AuthContext";
import { useOtp } from "@/core/globalStores/otpStore";
import { isSupabaseConfigured, signOut as authSignOut } from "@/services/authService";
import { listCompaniesForSignup } from "@/services/companyLookup";
import { fetchProfileCompanyId } from "@/services/profileQueries";
import { upsertProfileRow } from "@/services/userService";
import {
  SignupFormSection,
  validateSignupFields,
  type SignupCompanyOption,
  type SignupFormErrors,
} from "@/ui/patterns";

export const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { resetOtp } = useOtp();

  const [name, setName] = useState("");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState("");
  const [companies, setCompanies] = useState<SignupCompanyOption[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabaseReady = isSupabaseConfigured();

  useEffect(() => {
    let cancelled = false;

    const fetchCompanies = async () => {
      if (!isSupabaseConfigured()) {
        if (!cancelled) {
          setCompanies([]);
          setCompaniesLoading(false);
        }
        return;
      }
      try {
        const { data, error } = await listCompaniesForSignup();

        if (cancelled) return;
        if (error) {
          setServerError(
            error.code === "PGRST301" || error.message?.includes("permission") || error.message?.includes("row-level security")
              ? t("auth.signupErrorCompaniesUnavailable")
              : t("auth.signupErrorLoadCompaniesFailed"),
          );
        } else {
          setCompanies(data ?? []);
        }
      } catch {
        if (cancelled) return;
        setServerError(t("auth.signupErrorConnection"));
      } finally {
        if (!cancelled) setCompaniesLoading(false);
      }
    };

    fetchCompanies();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setSuccessMessage(null);

    const fieldErrors = validateSignupFields(name, selectedState, companyId, email, password, confirmPassword, t);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      if (!isSupabaseConfigured()) {
        setServerError("Supabase not configured");
        return;
      }
      const { user: newUser } = await signUp(email, password, {
        name: name.trim(),
        company_id: companyId,
        location: selectedState ?? "",
      });

      const selectedCompanyUUID = (companyId ?? "").trim() || null;
      if (!newUser?.id) {
        setServerError(t("auth.signupErrorGeneric"));
        return;
      }

      const { error: upsertError } = await upsertProfileRow(
        {
          id: newUser.id,
          name: name.trim(),
          location: selectedState ?? "",
          company_id: selectedCompanyUUID,
          role: "user",
        },
        { onConflict: "id" },
      );

      if (upsertError) {
        console.error("[Signup] profiles upsert failed:", upsertError);
        setServerError(t("auth.signupErrorGeneric"));
        return;
      }

      const { data: verifyCompanyId } = await fetchProfileCompanyId(newUser.id);

      if (!verifyCompanyId) {
        console.warn("[Signup] company_id missing after upsert");
      }

      await authSignOut();
      resetOtp();
      navigate("/verify?mode=signup", { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : String(err).replace(/^Error:\s*/, "") || t("auth.signupErrorGeneric");
      if (message.includes("already registered") || message.includes("already exists")) {
        setServerError(t("auth.signupErrorAlreadyRegistered"));
      } else if (message.includes("signup disabled") || message.includes("Sign-up is currently disabled")) {
        setServerError(t("auth.signupErrorSignupDisabled"));
      } else {
        setServerError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthFormShell
      headerSlot={<Logo className="h-10 w-auto" />}
      title={t("auth.signupTitle")}
      description={t("auth.signupDesc")}
      bodySlot={
        <SignupFormSection
          name={name}
          setName={setName}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          companyId={companyId}
          setCompanyId={setCompanyId}
          companies={companies}
          companiesLoading={companiesLoading}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          errors={errors}
          setErrors={setErrors}
          serverError={serverError}
          successMessage={successMessage}
          supabaseReady={supabaseReady}
          onSubmit={handleSubmit}
          loading={loading}
        />
      }
    />
  );
};
