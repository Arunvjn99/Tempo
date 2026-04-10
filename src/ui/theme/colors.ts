/**
 * Semantic color roles for the app shell (references CSS variables applied in theme).
 */
export type SemanticColor = "primary" | "secondary" | "muted" | "danger" | "success" | "warning";

export const semanticColorClass: Record<SemanticColor, string> = {
  primary: "text-primary",
  secondary: "text-muted-foreground",
  muted: "text-muted-foreground",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
};
