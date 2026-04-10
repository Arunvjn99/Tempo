/**
 * Design system — semantic token names (map to CSS variables from core styles).
 * Prefer Tailwind semantic classes (bg-card, text-foreground) in components; use these for programmatic access.
 */
export const cssVar = {
  background: "var(--color-background)",
  surface: "var(--color-surface)",
  foreground: "var(--color-text-primary)",
  muted: "var(--color-text-secondary)",
  border: "var(--color-border)",
  primary: "var(--color-primary)",
  danger: "var(--color-danger)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
} as const;

export const radius = {
  card: "rounded-card",
  button: "rounded-button",
  input: "rounded-input",
} as const;
