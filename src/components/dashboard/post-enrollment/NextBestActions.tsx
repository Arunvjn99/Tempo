import { AlertCircle, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { NextBestAction } from "@/stores/postEnrollmentDashboardStore";
import { cn } from "@/lib/utils";
import { pePanelTight } from "./dashboardSurfaces";

type Props = {
  actions: NextBestAction[];
  onAction: (route: string) => void;
  className?: string;
};

export function NextBestActions({ actions, onAction, className }: Props) {
  const { t } = useTranslation();
  const sorted = [...actions].sort((a, b) => (a.priority === "required" ? -1 : b.priority === "required" ? 1 : 0));

  return (
    <section className={cn(pePanelTight, className)}>
      <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)]">
        {t("dashboard.postEnrollment.criticalInsights")}
      </h2>
      <p className="font-dashboard-body mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {t("dashboard.postEnrollment.peNextBestSubtitle")}
      </p>
      <ul className="mt-6 space-y-3">
        {sorted.map((action, index) => {
          const required = action.priority === "required";
          const isFirst = index === 0 && required;
          return (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => onAction(action.route)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-2xl p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-page-bg)] sm:p-5",
                  isFirst
                    ? "shadow-md"
                    : "bg-[color-mix(in_srgb,var(--color-background-secondary)_55%,var(--color-background)_45%)] shadow-sm hover:shadow-md",
                )}
                style={
                  isFirst
                    ? {
                        background:
                          "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 22%, var(--color-background)), color-mix(in srgb, var(--color-warning) 8%, var(--color-background)))",
                        boxShadow: "var(--shadow-md)",
                      }
                    : undefined
                }
              >
                {required ? (
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--color-warning)]"
                    style={{
                      background: "color-mix(in srgb, var(--color-warning) 22%, var(--color-background))",
                    }}
                  >
                    <AlertCircle className="h-4 w-4" aria-hidden />
                  </span>
                ) : (
                  <span className="mt-0.5 w-9 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-dashboard-heading text-sm font-semibold text-[var(--color-text)] sm:text-base">
                      {t(action.title)}
                    </span>
                    {required && (
                      <span className="rounded-md bg-[color-mix(in_srgb,var(--color-warning)_20%,transparent)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--color-warning)]">
                        {t("dashboard.postEnrollment.peRequiredBadge")}
                      </span>
                    )}
                  </span>
                  <span className="font-dashboard-body mt-1.5 block text-xs leading-relaxed text-[var(--color-text-secondary)] sm:text-sm">
                    {t(action.description)}
                  </span>
                </span>
                <ChevronRight
                  className="mt-1 h-4 w-4 shrink-0 text-[var(--color-text-tertiary)] transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
                  aria-hidden
                />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
