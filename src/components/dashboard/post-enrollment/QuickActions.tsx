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
      <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">
        {t("dashboard.postEnrollment.quickActions")}
      </h2>
      <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {actions.map(({ id, title, description, icon: Icon, onClick }) => (
          <li key={id}>
            <button
              type="button"
              onClick={onClick}
              className="group flex w-full flex-col items-start gap-4 rounded-2xl bg-[color-mix(in_srgb,var(--color-background-secondary)_65%,var(--color-background)_35%)] p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ds-page-bg)]"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition group-hover:scale-105"
                style={{
                  background: "color-mix(in srgb, var(--color-primary) 12%, var(--color-background))",
                  color: "var(--color-primary)",
                }}
                aria-hidden
              >
                <Icon className="h-6 w-6" />
              </span>
              <span className="min-w-0 space-y-1.5">
                <span className="font-dashboard-heading block text-base font-semibold text-[var(--color-text)]">{title}</span>
                <span className="font-dashboard-body block text-sm leading-relaxed text-[var(--color-text-secondary)]">
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
