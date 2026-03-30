import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

export function V2InsightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <aside className={`v2-insight ${className}`.trim()}>{children}</aside>;
}

export interface V2SuggestionCardProps {
  title: ReactNode;
  subtitle: ReactNode;
  badge: ReactNode;
  actionLabel: string;
  onAction: () => void;
  disabled?: boolean;
}

/** Matches figma-dump compact AI row + text link CTA (`retirement-age-planner.tsx` lines 396–425). */
export function V2SuggestionCard({ title, subtitle, badge, actionLabel, onAction, disabled }: V2SuggestionCardProps) {
  return (
    <div className="v2-ai-compact" role="region">
      <div className="v2-ai-compact__inner">
        <div className="v2-ai-compact__text-block">
          <div className="v2-ai-compact__icon-wrap" aria-hidden>
            <Sparkles size={14} strokeWidth={2} />
          </div>
          <div className="v2-flex-1-min">
            <div className="v2-ai-compact__title-row">
              <h3 className="v2-ai-compact__title">{title}</h3>
              <span className="v2-ai-compact__badge">{badge}</span>
            </div>
            <p className="v2-ai-compact__sub">{subtitle}</p>
          </div>
        </div>
        <button type="button" className="v2-ai-compact__link" onClick={onAction} disabled={disabled}>
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
