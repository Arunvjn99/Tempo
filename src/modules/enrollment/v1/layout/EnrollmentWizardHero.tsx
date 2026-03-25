import { Sparkles, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

type EnrollmentWizardHeroProps = {
  /** First name or short display name (e.g. from profile). */
  displayName: string;
};

/**
 * Figma Participants-Portal-Playground wizard header: blue→violet gradient, decorative icons, greeting.
 */
export function EnrollmentWizardHero({ displayName }: EnrollmentWizardHeroProps) {
  const { t } = useTranslation();
  return (
    <header className="enrollment-wizard-hero relative shrink-0 overflow-hidden px-6 pb-6 pt-6 text-white">
      <div
        className="pointer-events-none absolute right-3 top-2 opacity-20"
        aria-hidden
      >
        <Sparkles className="size-16 text-white" strokeWidth={1.25} />
      </div>
      <div
        className="pointer-events-none absolute right-0 top-3 opacity-10"
        aria-hidden
      >
        <TrendingUp className="size-24 text-white" strokeWidth={1.25} />
      </div>
      <div className="relative z-[1] flex flex-col gap-1">
        <h1 className="text-2xl font-bold leading-9 tracking-wide md:text-[1.875rem] md:leading-9">
          {t("enrollment.wizardHeroTitle", { name: displayName })}
        </h1>
        <p className="text-base leading-6 text-sky-100/95">
          {t("enrollment.wizardHeroSubtitle")}
        </p>
      </div>
    </header>
  );
}
