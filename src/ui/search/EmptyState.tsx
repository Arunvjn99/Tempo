import { Search } from "lucide-react";
import { LazyFloatingObjects } from "@/ui/3d";

export type EmptyStateProps = {
  query: string;
  listLabelId: string;
};

/**
 * Shown when the filtered command list has no matches (before the AI fallback CTA).
 */
export function EmptyState({ query, listLabelId }: EmptyStateProps) {
  const q = query.trim();

  return (
    <div className="ai-command-empty" role="status" aria-labelledby={listLabelId}>
      <div className="relative mx-auto mb-3 h-16 max-w-[200px] overflow-hidden rounded-xl border border-default/50 bg-background ring-1 ring-border/30">
        <LazyFloatingObjects variant="compact" className="opacity-90" />
      </div>
      <span className="ai-command-empty__icon-wrap" aria-hidden>
        <Search className="ai-command-empty__icon" strokeWidth={1.75} />
      </span>
      <p id={listLabelId} className="ai-command-empty__title">
        No results found for &lsquo;{q}&rsquo;
      </p>
      <p className="ai-command-empty__sub">Try asking AI instead</p>
    </div>
  );
}
