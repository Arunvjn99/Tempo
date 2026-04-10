import { cn } from "@/core/lib/utils";

export interface ThemeToggleProps {
  /** Resolved light/dark (not "system"). */
  mode: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

/**
 * Presentational theme switch — wire `useTheme()` from app shell in the parent.
 */
export function ThemeToggle({ mode, onToggle, className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors",
        "hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-background)]",
        className,
      )}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="flex h-5 w-5 items-center justify-center text-lg" aria-hidden="true">
        {mode === "light" ? "🌙" : "☀️"}
      </span>
    </button>
  );
}
