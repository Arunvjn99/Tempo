import { Calendar, MessageCircle, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanelTight } from "./dashboardSurfaces";

type Props = {
  name: string;
  title: string;
  organization: string;
  rating: number;
  experienceYears: number;
  imageSrc: string;
  nextAvailableLabel: string;
  onMessage: () => void;
  onSchedule: () => void;
  className?: string;
};

export function AdvisorCard({
  name,
  title,
  organization,
  rating,
  experienceYears,
  imageSrc,
  nextAvailableLabel,
  onMessage,
  onSchedule,
  className,
}: Props) {
  const { t } = useTranslation();

  return (
    <section
      className={cn(pePanelTight, "overflow-hidden text-[var(--color-text)]", className)}
      style={{
        background:
          "linear-gradient(155deg, color-mix(in srgb, var(--color-primary) 18%, var(--color-background)) 0%, color-mix(in srgb, var(--color-primary) 6%, var(--color-background-secondary)) 45%, var(--color-background-secondary) 100%)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <h2 className="font-dashboard-heading text-lg font-semibold">{t("dashboard.postEnrollment.peAdvisorTitle")}</h2>
      <div className="mt-5 flex gap-4">
        <div className="relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-2xl ring-2 ring-primary/30">
          {imageSrc ? (
            <img src={imageSrc} alt="" className="h-full w-full object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-lg font-bold text-[var(--color-text-on-primary)]"
              style={{ background: "var(--ds-advisor-gradient)" }}
              aria-hidden
            >
              {name
                .split(/\s+/)
                .map((p) => p[0])
                .join("")
                .slice(0, 2)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-dashboard-heading font-semibold">
            {name}
            {title ? (
              <span className="font-dashboard-body font-normal text-[var(--color-text-secondary)]">
                {" "}
                · {title}
              </span>
            ) : null}
          </p>
          <p className="font-dashboard-body mt-0.5 text-sm text-[var(--color-text-secondary)]">{organization}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-secondary)]">
            <span className="inline-flex items-center gap-1 font-semibold text-[var(--color-text)]">
              <Star className="h-3.5 w-3.5 fill-[var(--color-warning)] text-[var(--color-warning)]" aria-hidden />
              {rating.toFixed(1)}
            </span>
            <span>
              {t("dashboard.postEnrollment.peAdvisorExperience", { years: experienceYears })}
            </span>
          </div>
        </div>
      </div>
      <p className="font-dashboard-body mt-5 flex items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-background)_55%,transparent)] px-4 py-2.5 text-xs backdrop-blur-sm">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden />
        {nextAvailableLabel}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onMessage}
          className="font-dashboard-body inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-background)_72%,transparent)] py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-[color-mix(in_srgb,var(--color-background)_88%,transparent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorMessage")}
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="font-dashboard-body inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] py-3 text-sm font-semibold text-[var(--color-text-on-primary)] shadow-sm transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <Calendar className="h-4 w-4" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorSchedule")}
        </button>
      </div>
    </section>
  );
}
