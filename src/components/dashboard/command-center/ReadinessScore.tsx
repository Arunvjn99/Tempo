import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ReadinessScoreProps {
  title?: string;
  score: number;
  scoreLabel?: string;
  footerText: string;
  aiRecommendation: string;
  className?: string;
}

/** Circular progress — stroke uses design tokens. */
export function ReadinessScore({
  title = "Readiness Score",
  score,
  scoreLabel = "Ready",
  footerText,
  aiRecommendation,
  className,
}: ReadinessScoreProps) {
  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[2rem] border border-[var(--border-subtle)] p-8 text-center shadow-[var(--color-shadow-elevated)]",
        "bg-[var(--bg-secondary)]",
        className,
      )}
    >
      <h3
        className="mb-8 w-full text-left text-lg font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
      >
        {title}
      </h3>
      <div className="relative mb-6 h-48 w-48">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle cx="50" cy="50" fill="none" r={r} stroke="var(--color-surface-container)" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            fill="none"
            r={r}
            stroke="var(--color-primary)"
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="8"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-extrabold text-[var(--text-primary)]"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            {score}%
          </span>
          <span className="text-xs font-medium text-[var(--text-muted)]">{scoreLabel}</span>
        </div>
      </div>
      <p className="text-sm font-medium text-[var(--text-muted)]">{footerText}</p>
      <div className="mt-4 flex items-center gap-2 rounded-lg px-3 py-1 bg-[color-mix(in_srgb,var(--color-on-tertiary-container)_5%,transparent)]">
        <Sparkles className="h-4 w-4 text-[var(--color-on-tertiary-container)]" strokeWidth={2} />
        <span className="text-xs font-bold text-[var(--color-on-tertiary-container)]">{aiRecommendation}</span>
      </div>
    </div>
  );
}
