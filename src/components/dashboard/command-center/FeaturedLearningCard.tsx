import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_LEARNING_IMAGE =
  "https://pmmvggrzowobvbebjzdo.supabase.co/storage/v1/object/public/company-logos/learning.webp";

export type FeaturedLearningCardProps = {
  tag?: string;
  title?: string;
  description?: string;
  /** Defaults to Supabase learning illustration */
  imageSrc?: string;
  imageAlt?: string;
  onKnowMore?: () => void;
  className?: string;
};

/**
 * Single featured learning row: image left (~40%), content right (~60%), token-based styling.
 */
export function FeaturedLearningCard({
  tag = "RETIREMENT PLANNING",
  title = "Financial Wellness",
  description = "Build confidence with short lessons on saving, investing, and staying on track for retirement.",
  imageSrc = DEFAULT_LEARNING_IMAGE,
  imageAlt = "",
  onKnowMore,
  className,
}: FeaturedLearningCardProps) {
  return (
    <section
      className={cn(
        "mb-12 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] shadow-sm",
        className,
      )}
      aria-labelledby="featured-learning-title"
    >
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
        <div className="col-span-1 flex min-h-0 items-center justify-center bg-transparent md:col-span-5 dark:bg-transparent">
          <div className="flex h-full min-h-[12rem] w-full items-center justify-center rounded-xl bg-[var(--bg-secondary)] md:min-h-[14rem]">
            <img
              src={imageSrc}
              alt={imageAlt || title}
              className="h-full w-full object-contain p-6"
            />
          </div>
        </div>
        <div className="col-span-1 flex flex-col justify-center gap-3 p-6 sm:p-8 md:col-span-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">{tag}</p>
          <h3 id="featured-learning-title" className="text-xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-2xl">
            {title}
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
          <button
            type="button"
            onClick={onKnowMore}
            className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[var(--primary)] transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)]"
          >
            Know more
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}
