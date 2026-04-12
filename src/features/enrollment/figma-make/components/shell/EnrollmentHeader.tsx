import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/core/lib/utils";

export type EnrollmentHeaderProps = {
  title: string;
  subtitle?: ReactNode;
  /** `default`: subtitle `text-base`; `compact`: `text-sm` (matches existing screens) */
  subtitleVariant?: "default" | "compact";
  onBack?: () => void;
  backLabel?: string;
  className?: string;
};

/**
 * Figma enrollment screen header — Back + title + subtitle (shared hierarchy).
 */
export function EnrollmentHeader({
  title,
  subtitle,
  subtitleVariant = "compact",
  onBack,
  backLabel = "Back",
  className,
}: EnrollmentHeaderProps) {
  return (
    <div className={cn(className)}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-3 flex items-center gap-1 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {backLabel}
        </button>
      )}
      <h1 className="text-3xl font-semibold text-[var(--text-primary)]">{title}</h1>
      {subtitle != null && subtitle !== "" && (
        <p
          className={cn(
            "mt-1 text-[var(--text-secondary)]",
            subtitleVariant === "default" ? "text-base" : "text-sm",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
