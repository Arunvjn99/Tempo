import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LearningItem {
  id: string;
  title: string;
  progressPercent: number;
  ctaLabel: string;
  imageSrc?: string;
  imageAlt?: string;
  aiRecommended?: boolean;
  onContinue?: () => void;
}

export interface LearningCarouselProps {
  title?: string;
  subtitle?: string;
  items: LearningItem[];
  className?: string;
}

export function LearningCarousel({
  title = "Learning Hub",
  subtitle = "Grow your financial literacy with bite-sized lessons.",
  items,
  className,
}: LearningCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className={cn("mb-12", className)}>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h3
            className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {title}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:bg-[var(--color-surface-container)]"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:bg-[var(--color-surface-container)]"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className="no-scrollbar flex gap-6 overflow-x-auto pb-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "min-w-[min(100%,320px)] overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] transition-all",
              "bg-[var(--bg-secondary)] hover:border-[var(--color-outline)] hover:shadow-lg",
            )}
          >
            <div className="group relative h-40 bg-[var(--color-surface-container)]">
              {item.imageSrc ? (
                <img
                  src={item.imageSrc}
                  alt={item.imageAlt ?? ""}
                  className="h-full w-full object-cover grayscale opacity-60 transition-all duration-500 group-hover:grayscale-0 group-hover:opacity-100"
                />
              ) : null}
              {item.aiRecommended ? (
                <div className="ai-glow absolute left-4 top-4 flex items-center gap-1 rounded-lg bg-[color-mix(in_srgb,var(--color-on-tertiary-container)_88%,transparent)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-colored-surface)]">
                  <Sparkles className="h-3 w-3" strokeWidth={2} />
                  AI Recommended
                </div>
              ) : null}
            </div>
            <div className="p-6">
              <h4 className="mb-2 font-bold text-[var(--text-primary)]">{item.title}</h4>
              <div className="mb-4 flex items-center gap-2">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-container)]">
                  <div
                    className="h-full rounded-full bg-[var(--color-on-tertiary-container)] transition-all"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--text-muted)]">{item.progressPercent}%</span>
              </div>
              <button
                type="button"
                onClick={item.onContinue}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] transition-transform hover:translate-x-0.5"
              >
                {item.ctaLabel}
                <ArrowRight className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
