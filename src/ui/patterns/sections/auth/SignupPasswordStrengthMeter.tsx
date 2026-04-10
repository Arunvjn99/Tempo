import { useTranslation } from "react-i18next";

type PasswordStrength = "weak" | "medium" | "strong";

function getPasswordStrength(password: string): { level: PasswordStrength; score: number } {
  if (!password) return { level: "weak", score: 0 };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  const level: PasswordStrength = score >= 5 ? "strong" : score >= 3 ? "medium" : "weak";
  return { level, score };
}

export function SignupPasswordStrengthMeter({ password }: { password: string }) {
  const { t } = useTranslation();
  const { level } = getPasswordStrength(password);
  const segmentCount = level === "weak" ? 1 : level === "medium" ? 2 : 3;
  const label =
    level === "weak"
      ? t("auth.signupPasswordStrengthWeak")
      : level === "medium"
        ? t("auth.signupPasswordStrengthMedium")
        : t("auth.signupPasswordStrengthStrong");
  const barColor =
    level === "weak"
      ? "var(--color-danger)"
      : level === "medium"
        ? "var(--color-warning)"
        : "var(--color-success)";

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col gap-1.5"
      aria-label={`Password strength: ${label}`}
    >
      <div className="flex gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors"
            style={{
              backgroundColor: i <= segmentCount ? barColor : "var(--color-border)",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium" style={{ color: barColor }}>
        {label}
      </span>
    </div>
  );
}
