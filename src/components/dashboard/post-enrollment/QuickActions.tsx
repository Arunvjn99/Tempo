import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

export type QuickActionItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
};

type Props = {
  actions: QuickActionItem[];
  className?: string;
};

export function QuickActions({ actions, className }: Props) {
  const { t } = useTranslation();

  return (
    <section className={cn(pePanel, className)}>
      <h2 className="font-dashboard-heading text-base font-semibold text-gray-900">
        {t("dashboard.postEnrollment.quickActions")}
      </h2>
      <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {actions.map(({ id, title, description, icon: Icon, onClick }) => (
          <li key={id}>
            <button
              type="button"
              onClick={onClick}
              className="group flex w-full flex-col items-start gap-2.5 rounded-lg border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 10%, #EFF6FF)",
                  color: "var(--color-primary)",
                }}
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="font-dashboard-heading block text-sm font-semibold text-gray-900">{title}</span>
                <span className="font-dashboard-body mt-0.5 block text-xs leading-snug text-gray-500">
                  {description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
