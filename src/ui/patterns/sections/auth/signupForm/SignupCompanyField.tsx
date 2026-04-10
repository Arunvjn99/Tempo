import { useTranslation } from "react-i18next";
import * as Label from "@radix-ui/react-label";
import type { SignupCompanyOption, SignupFormErrors } from "../signupTypes";

export function SignupCompanyField({
  companyId,
  setCompanyId,
  companies,
  companiesLoading,
  errors,
}: {
  companyId: string;
  setCompanyId: (v: string) => void;
  companies: SignupCompanyOption[];
  companiesLoading: boolean;
  errors: SignupFormErrors;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-2">
      <Label.Root htmlFor="signup-company" className="text-sm font-medium text-[var(--color-text)]">
        {t("auth.signupCompany")}
      </Label.Root>
      <select
        id="signup-company"
        name="company"
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        disabled={companiesLoading}
        aria-invalid={errors.companyId ? true : undefined}
        aria-describedby={errors.companyId ? "signup-company-error" : undefined}
        className={`h-[2.75rem] w-full rounded-lg border bg-[var(--color-surface)] px-4 py-3 text-base transition-colors focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 ${
          companyId ? "text-[var(--color-text)]" : "text-[var(--color-textSecondary)]"
        } ${
          errors.companyId
            ? "border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20"
            : "border-[var(--color-border)]"
        }`}
      >
        <option value="">
          {companiesLoading ? t("auth.signupCompanyLoading") : t("auth.signupCompanyPlaceholder")}
        </option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {errors.companyId && (
        <span id="signup-company-error" className="text-sm text-[var(--color-danger)]" role="alert">
          {errors.companyId}
        </span>
      )}
    </div>
  );
}
