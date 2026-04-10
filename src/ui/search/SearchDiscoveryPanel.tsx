import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { Button } from "@/ui/components/Button";
import { cn } from "@/core/lib/utils";

const TRENDING = [
  "Contribution limits",
  "Roth vs Traditional",
  "Loan rules",
  "Withdrawal rules",
] as const;

const QUICK_ACTIONS = [
  { label: "Start enrollment", scenarioId: "start_enrollment", prompt: "Start enrollment" },
  { label: "Increase contribution", scenarioId: "increase_contribution", prompt: "Increase contribution" },
  { label: "Apply for loan", scenarioId: "apply_loan", prompt: "Apply for a loan" },
] as const;

export type SearchDiscoveryPanelProps = {
  onFillSearch: (text: string) => void;
  onRunScenario: (scenarioId: string, label: string) => void;
  className?: string;
};

/**
 * Empty-query discovery: HDFC-style trending chips + high-intent quick actions (UI only; routing via scenarios).
 */
export function SearchDiscoveryPanel({ onFillSearch, onRunScenario, className }: SearchDiscoveryPanelProps) {
  return (
    <div className={cn("search-discovery-panel", className)}>
      <div className="search-discovery-section">
        <div className="search-discovery-section__head">
          <Compass className="search-discovery-section__icon" aria-hidden />
          <span className="search-discovery-section__title">Trending searches</span>
        </div>
        <div className="search-discovery-chips" role="list">
          {TRENDING.map((label) => (
            <Button
              key={label}
              type="button"
              variant="custom"
              size="custom"
              role="listitem"
              className="search-discovery-chip"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onFillSearch(label)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div className="search-discovery-section search-discovery-section--expand">
        <div className="search-discovery-section__head">
          <Sparkles className="search-discovery-section__icon" aria-hidden />
          <span className="search-discovery-section__title">Quick actions</span>
        </div>
        <div className="search-discovery-actions">
          {QUICK_ACTIONS.map((a) => (
            <Button
              key={a.scenarioId}
              type="button"
              variant="custom"
              size="custom"
              className="search-discovery-action"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onRunScenario(a.scenarioId, a.prompt)}
            >
              <span className="search-discovery-action__label">{a.label}</span>
              <ArrowRight className="search-discovery-action__arrow" aria-hidden />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
