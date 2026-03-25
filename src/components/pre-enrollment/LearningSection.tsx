import { useTranslation } from "react-i18next";
import { safeT } from "@/lib/safeT";
import { LearningCard, type LearningCardStatus } from "@/components/cards/LearningCard";
import { RESOURCES } from "./constants";

function resourceStatus(id: string): LearningCardStatus {
  if (id === "2") return "in_progress";
  if (id === "3") return "completed";
  return "not_started";
}

function resourceProgress(id: string): number {
  return id === "2" ? 45 : 0;
}

export const LearningSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 sm:gap-4 mb-5 sm:mb-8">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-[var(--color-text)] mb-1 sm:mb-2">
            {t("preEnrollment.learnAtYourPace")}
          </h2>
          <p className="text-[var(--color-textSecondary)] text-sm sm:text-base md:text-lg">
            {t("preEnrollment.learnSubtitle")}
          </p>
        </div>
        <button
          type="button"
          className="hidden sm:block text-brand-600 font-medium hover:text-brand-800 transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:ring-offset-2 py-1 shrink-0"
        >
          {t("preEnrollment.viewLibrary")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-2">
        {RESOURCES.map((resource) => {
          const title = t(`preEnrollment.resource${resource.id}Title` as const);
          const category = t(`preEnrollment.resource${resource.id}Category` as const);
          const duration = t(`preEnrollment.resource${resource.id}Duration` as const);
          const description = safeT(
            t,
            `preEnrollment.resource${resource.id}Description` as const,
            t(`preEnrollment.resource${resource.id}Title` as const),
          );
          const status = resourceStatus(resource.id);
          const insight =
            resource.id === "1"
              ? safeT(t, "dashboard.learningAiInsight", "Recommended for you")
              : resource.id === "2"
                ? safeT(t, "dashboard.learningPopularInsight", "Most users start here")
                : undefined;

          return (
            <LearningCard
              key={resource.id}
              topicLabel={category}
              title={title}
              description={description}
              readTimeLabel={duration}
              thumbnailUrl={resource.thumbnail}
              thumbnailAlt={title}
              actionLabel={t("preEnrollment.learnAboutPlanCta")}
              onAction={() => {}}
              status={status}
              progressPercent={resourceProgress(resource.id)}
              insightLabel={insight}
            />
          );
        })}
      </div>
    </section>
  );
};
