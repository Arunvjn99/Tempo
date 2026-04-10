import type { SignupFormErrors } from "./signupTypes";

export const SIGNUP_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignupFields(
  name: string,
  selectedState: string | null,
  companyId: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: (key: string) => string,
): SignupFormErrors {
  const errors: SignupFormErrors = {};
  if (!name.trim()) errors.name = t("auth.signupValidationNameRequired");
  if (!selectedState) errors.location = t("auth.signupValidationStateRequired");
  if (!companyId) errors.companyId = t("auth.signupValidationCompanyRequired");
  if (!email.trim()) errors.email = t("auth.signupValidationEmailRequired");
  else if (!SIGNUP_EMAIL_REGEX.test(email)) errors.email = t("auth.signupValidationEmailInvalid");
  if (password.length < 6) errors.password = t("auth.signupValidationPasswordMin");
  if (password !== confirmPassword) errors.confirmPassword = t("auth.signupValidationPasswordsDontMatch");
  return errors;
}
