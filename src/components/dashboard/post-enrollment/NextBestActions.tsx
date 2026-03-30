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
      <h2 className="font-dashboard-heading text-base font-semibold text-gray-900">
        {t("dashboard.postEnrollment.criticalInsights")}
      </h2>
      <p className="font-dashboard-body mt-1 text-xs text-gray-500">
        {t("dashboard.postEnrollment.peNextBestSubtitle")}
      </p>
      <ul className="mt-4 space-y-2">
        {sorted.map((action, index) => {
          const required = action.priority === "required";
          const isFirst = index === 0 && required;
          return (
            <li key={action.id}>
              <button
                type="button"
                onClick={() => onAction(action.route)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2",
                  isFirst
                    ? "border-amber-200 bg-amber-50 hover:border-amber-300"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm",
                )}
              >
                {required ? (
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <AlertCircle className="h-4 w-4" aria-hidden />
                  </span>
                ) : (
                  <span className="mt-0.5 w-8 shrink-0" aria-hidden />
                )}
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-dashboard-heading text-sm font-semibold text-gray-900">
                      {t(action.title)}
                    </span>
                    {required && (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                        {t("dashboard.postEnrollment.peRequiredBadge")}
                      </span>
                    )}
                  </span>
                  <span className="font-dashboard-body mt-1 block text-xs leading-snug text-gray-500">
                    {t(action.description)}
                  </span>
                </span>
                <ChevronRight
                  className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--color-primary)]"
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
