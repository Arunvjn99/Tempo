import { ArrowRight, Check, Headset } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = ["Certified professionals", "Custom portfolio analysis"] as const;

export interface AdvisorCardProps {
  title?: string;
  organization: string;
  advisorName: string;
  credentials?: string;
  availability: string;
  imageSrc?: string;
  imageAlt?: string;
  ctaLabel?: string;
  onBookClick?: () => void;
  className?: string;
  /** Badge label above title (Figma: “Expert Help”). */
  badgeLabel?: string;
}

export function AdvisorCard({
  title = "Dedicated Advisor",
  organization,
  advisorName,
  credentials,
  availability,
  imageSrc,
  imageAlt = "Advisor",
  ctaLabel = "Book Consultation",
  onBookClick,
  className,
  badgeLabel = "Expert Help",
}: AdvisorCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-2xl border border-[#FED7AA] bg-[#FFF7ED] p-6 dark:border-[#374151] dark:bg-[#1F2937] lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 items-start gap-4 lg:gap-6">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white",
            imageSrc
              ? "overflow-hidden ring-2 ring-[#F97316] ring-offset-2 ring-offset-[#FFF7ED] dark:ring-offset-[#1F2937]"
              : "bg-[#F97316]",
          )}
        >
          {imageSrc ? (
            <img src={imageSrc} alt={imageAlt} className="h-full w-full object-cover" />
          ) : (
            <Headset className="h-6 w-6" strokeWidth={2} aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="mb-2 inline-block rounded-full bg-[#FFEDD5] px-3 py-1 text-xs font-semibold text-[#C2410C] dark:bg-orange-950/50 dark:text-orange-200">
            {badgeLabel}
          </span>
          <h3
            className="text-[18px] font-semibold text-[var(--text-primary)]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {title}
          </h3>
          <p className="mt-1 text-[14px] text-[var(--text-muted)]">{organization}</p>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            {[advisorName, credentials].filter(Boolean).join(", ")}
          </p>
          {availability ? (
            <p className="mt-0.5 text-[14px] text-[var(--text-muted)]">{availability}</p>
          ) : null}

          <ul className="mt-3 space-y-2">
            {BENEFITS.map((line) => (
              <li key={line} className="flex items-center gap-2 text-[14px] text-[var(--text-secondary)]">
                <Check className="h-4 w-4 shrink-0 text-green-500" strokeWidth={2.5} aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex shrink-0 lg:items-center">
        <button
          type="button"
          onClick={onBookClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#EA580C] lg:w-auto"
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" strokeWidth={2} aria-hidden />
        </button>
      </div>
    </div>
  );
}
