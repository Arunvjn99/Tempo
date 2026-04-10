import { cn } from "@/core/lib/utils";
import { Button } from "./Button";

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
    <Button
      type="button"
      variant="ghost"
      size="iconMd"
      onClick={onToggle}
      className={cn(
        "rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]",
        "focus:ring-[var(--color-primary)] focus:ring-offset-[var(--color-background)]",
        className,
      )}
      aria-label={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <span className="flex h-5 w-5 items-center justify-center text-lg" aria-hidden="true">
        {mode === "light" ? "🌙" : "☀️"}
      </span>
    </Button>
  );
}
