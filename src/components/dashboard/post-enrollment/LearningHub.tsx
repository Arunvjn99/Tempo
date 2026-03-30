import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { pePanel } from "./dashboardSurfaces";

type Props = {
  title: string;
  description: string;
  href: string;
  className?: string;
};

export function LearningHub({ title, description, href, className }: Props) {
  const { t } = useTranslation();

  return (
    <section className={cn(pePanel, "overflow-hidden", className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div
          className="flex h-28 w-full shrink-0 items-center justify-center rounded-2xl sm:h-32 lg:w-44"
          style={{
            background:
              "linear-gradient(145deg, color-mix(in srgb, var(--color-primary) 14%, var(--color-background-secondary)), var(--color-background-secondary))",
          }}
          aria-hidden
        >
          <BookOpen className="h-14 w-14 text-[var(--color-primary)] opacity-90" strokeWidth={1.15} />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <h2 className="font-dashboard-heading text-lg font-semibold text-[var(--color-text)] sm:text-xl">{title}</h2>
          <p className="font-dashboard-body text-sm leading-relaxed text-[var(--color-text-secondary)]">{description}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-dashboard-body inline-flex text-sm font-semibold text-[var(--color-primary)] underline-offset-4 hover:underline"
          >
            {t("dashboard.learnMore")}
          </a>
        </div>
      </div>
    </section>
  );
}
