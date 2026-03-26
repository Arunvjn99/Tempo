import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface OnboardingHeaderProps {
  name: string;
  /** Subline under greeting (overrides default i18n subtitle when set) */
  subtitle?: string;
  onClose: () => void;
  className?: string;
}

const GENERIC_EN = "there";

/**
 * Gradient welcome header for the personalize-plan wizard (all steps).
 */
export function OnboardingHeader({ name, subtitle, onClose, className }: OnboardingHeaderProps) {
  const { t } = useTranslation();
  const trimmed = name?.trim();
  const isCasual =
    !trimmed || trimmed.toLowerCase() === GENERIC_EN || trimmed === t("preEnrollment.personalizeWizard.headerAnonymous");
  const greeting = isCasual
    ? t("preEnrollment.personalizeWizard.headerGreetingCasual")
    : t("preEnrollment.personalizeWizard.headerGreeting", { name: trimmed });
  const sub = subtitle ?? t("preEnrollment.personalizeWizard.headerSubtitle");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-t-[inherit] bg-gradient-to-r from-[var(--color-primary)] to-indigo-600 px-6 py-5 text-white sm:px-8 sm:py-6",
        className,
      )}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-xl text-white/90 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        aria-label={t("preEnrollment.personalizeWizard.headerCloseAria")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <h2 className="pr-12 text-xl font-semibold tracking-tight sm:text-2xl">{greeting}</h2>
      <p className="mt-1 max-w-md text-sm leading-relaxed text-white/90">{sub}</p>
    </div>
  );
}
