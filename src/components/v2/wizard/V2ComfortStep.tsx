import { useTranslation } from "react-i18next";

export type V2InvestmentComfort = "conservative" | "balanced" | "growth" | "aggressive";

const LEVELS: {
  key: V2InvestmentComfort;
  emoji: string;
  labelKey: string;
  descKey: string;
  mostCommon?: boolean;
}[] = [
  { key: "conservative", emoji: "\u{1F6E1}", labelKey: "comfortOptConservativeLabel", descKey: "comfortOptConservativeDesc" },
  { key: "balanced", emoji: "\u{1F4CA}", labelKey: "comfortOptBalancedLabel", descKey: "comfortOptBalancedDesc", mostCommon: true },
  { key: "growth", emoji: "\u{1F4C8}", labelKey: "comfortOptGrowthLabel", descKey: "comfortOptGrowthDesc" },
  { key: "aggressive", emoji: "\u{26A1}", labelKey: "comfortOptAggressiveLabel", descKey: "comfortOptAggressiveDesc" },
];

export interface V2ComfortStepProps {
  value: V2InvestmentComfort;
  onChange: (v: V2InvestmentComfort) => void;
}

export function V2ComfortStep({ value, onChange }: V2ComfortStepProps) {
  const { t } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";

  return (
    <div className="v2-wizard-step-stack">
      <div className="v2-section v2-section--compact">
        <h2 className="v2-section__title v2-section__title--age v2-section__title--compact">{t(`${pw}comfortQuestion`)}</h2>
        <p className="v2-section__subtitle v2-section__subtitle--compact">{t(`${pw}comfortSubtitle`)}</p>
      </div>

      <div className="v2-comfort-grid v2-comfort-grid--compact" role="radiogroup" aria-label={t(`${pw}comfortRadiogroupAria`)}>
        {LEVELS.map((level) => {
          const selected = value === level.key;
          return (
            <button
              key={level.key}
              type="button"
              role="radio"
              aria-checked={selected}
              className={["v2-comfort-card", "v2-comfort-card--compact", selected && "v2-comfort-card--selected"].filter(Boolean).join(" ")}
              onClick={() => onChange(level.key)}
            >
              {level.mostCommon ? <span className="v2-comfort-card__badge">{t(`${pw}comfortMostCommonBadge`)}</span> : null}
              <div className="v2-comfort-card__row">
                <span className="v2-comfort-card__emoji" aria-hidden>
                  {level.emoji}
                </span>
                <span className="v2-comfort-card__label">{t(`${pw}${level.labelKey}`)}</span>
              </div>
              <p className="v2-comfort-card__desc">{t(`${pw}${level.descKey}`)}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
