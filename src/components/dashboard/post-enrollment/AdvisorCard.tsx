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
      className={cn(pePanelTight, "overflow-hidden", className)}
      style={{
        background: "linear-gradient(135deg, #1e3a5f 0%, #1a4a8a 60%, #1565c0 100%)",
        color: "#fff",
      }}
    >
      <p className="font-dashboard-body text-[10px] font-semibold uppercase tracking-wider text-blue-200">
        {t("dashboard.postEnrollment.peAdvisorTitle")}
      </p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl ring-2 ring-white/30">
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
          <p className="font-dashboard-heading text-sm font-bold text-white">
            {name}
          </p>
          {title ? (
            <p className="font-dashboard-body mt-0.5 text-xs text-blue-200">{title}</p>
          ) : null}
          <p className="font-dashboard-body text-xs text-blue-300">{organization}</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-blue-200">
            <span className="inline-flex items-center gap-1 font-semibold text-white">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" aria-hidden />
              {rating.toFixed(1)}
            </span>
            <span>{t("dashboard.postEnrollment.peAdvisorExperience", { years: experienceYears })}</span>
          </div>
        </div>
      </div>
      <p className="font-dashboard-body mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-blue-100">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-blue-200" aria-hidden />
        {nextAvailableLabel}
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={onMessage}
          className="font-dashboard-body inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/30 bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <MessageCircle className="h-3.5 w-3.5" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorMessage")}
        </button>
        <button
          type="button"
          onClick={onSchedule}
          className="font-dashboard-body inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white py-2.5 text-xs font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <Calendar className="h-3.5 w-3.5" aria-hidden />
          {t("dashboard.postEnrollment.peAdvisorSchedule")}
        </button>
      </div>
    </section>
  );
}
