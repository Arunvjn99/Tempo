import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Check } from "lucide-react";

export type V2CostLevel = "low" | "medium" | "high";

export interface V2SelectableCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** Optional cost-of-living pill (figma popular destination cards). */
  costLevel?: V2CostLevel;
  costLabel?: ReactNode;
  selected?: boolean;
  leading?: ReactNode;
  /** Selected-state check icon (figma location cards). */
  showSelectedCheck?: boolean;
}

const COST_CLASS: Record<V2CostLevel, string> = {
  low: "v2-cost-pill v2-cost-pill--low",
  medium: "v2-cost-pill v2-cost-pill--medium",
  high: "v2-cost-pill v2-cost-pill--high",
};

export function V2SelectableCard({
  title,
  subtitle,
  costLevel,
  costLabel,
  selected,
  leading,
  showSelectedCheck = true,
  className = "",
  type = "button",
  ...rest
}: V2SelectableCardProps) {
  return (
    <button
      type={type}
      className={["v2-selectable-card", selected && "v2-selectable-card--selected", className].filter(Boolean).join(" ")}
      aria-pressed={selected}
      {...rest}
    >
      <div className="v2-selectable-card__row">
        {leading != null ? <span className="v2-selectable-card__emoji">{leading}</span> : null}
        <div className="v2-selectable-card__body">
          <div className="v2-selectable-card__title-row">
            <span className="v2-selectable-card__title">{title}</span>
            {costLevel != null ? (
              <span className={COST_CLASS[costLevel]}>{costLabel ?? (costLevel === "low" ? "Low" : costLevel === "medium" ? "Medium" : "High")} Cost</span>
            ) : null}
          </div>
          {subtitle != null ? <div className="v2-selectable-card__subtitle">{subtitle}</div> : null}
        </div>
        {selected && showSelectedCheck ? <Check className="v2-selectable-card__check" size={20} strokeWidth={2.5} aria-hidden /> : null}
      </div>
    </button>
  );
}
