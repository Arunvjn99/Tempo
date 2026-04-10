import { cn } from "@/core/lib/utils";

/** Shared selectable tile style for transaction flows (withdrawal, etc.). */
export function transactionChoiceButtonClass(on: boolean) {
  return cn(
    "rounded-card border px-md py-sm text-left text-sm font-medium transition-colors",
    on ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-foreground hover:bg-muted",
  );
}
