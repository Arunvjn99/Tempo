import { useMemo, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { US_STATES } from "@/constants/usStates";
import { getStateLocationInsight } from "@/constants/stateLocationInsights";
import { getWizardLocationInsightKey } from "@/enrollment/wizardStepInsights";
import type { V2CostLevel } from "../V2SelectableCard";
import { AnimatedLocationGlobe } from "../AnimatedLocationGlobe";
import { V2Input } from "../V2Input";
import { V2SelectableCard } from "../V2SelectableCard";

const FEATURED: {
  name: string;
  emoji: string;
  title: string;
  descKey: "featuredFloridaDesc" | "featuredArizonaDesc" | "featuredNorthCarolinaDesc" | "featuredSouthCarolinaDesc";
  costLevel: V2CostLevel;
}[] = [
  { name: "Florida", emoji: "🌴", title: "Florida", descKey: "featuredFloridaDesc", costLevel: "low" },
  { name: "Arizona", emoji: "🌵", title: "Arizona", descKey: "featuredArizonaDesc", costLevel: "medium" },
  { name: "North Carolina", emoji: "🏔️", title: "North Carolina", descKey: "featuredNorthCarolinaDesc", costLevel: "low" },
  { name: "South Carolina", emoji: "⛱️", title: "South Carolina", descKey: "featuredSouthCarolinaDesc", costLevel: "low" },
];

export interface V2LocationStepProps {
  value: string;
  onChange: (v: string) => void;
}

export function V2LocationStep({ value, onChange }: V2LocationStepProps) {
  const { t } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";
  const [query, setQuery] = useState("");
  const isSearching = query.length > 0;

  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  const wizardInsightKey = value ? getWizardLocationInsightKey(value) : null;
  const genericInsightText = useMemo(() => {
    if (!value || wizardInsightKey) return null;
    return getStateLocationInsight(value, t);
  }, [value, wizardInsightKey, t]);

  const showLocationInsight = Boolean(value && (wizardInsightKey || genericInsightText));

  const selectState = (name: string, currentlySelected: boolean) => {
    setQuery("");
    onChange(currentlySelected ? "" : name);
  };

  return (
    <div className="v2-wizard-step-stack">
      <div className="v2-section v2-section--compact">
        <h2 className="v2-section__title v2-section__title--compact">
          <Trans
            i18nKey="preEnrollment.personalizeWizard.locationQuestion"
            components={{ globe: <AnimatedLocationGlobe /> }}
          />
        </h2>
        <p className="v2-section__subtitle v2-section__subtitle--compact">{t(`${pw}locationSubtitle`)}</p>
      </div>

      <div className="v2-location-search-wrap">
        <V2Input
          variant="search"
          placeholder={t(`${pw}locationSearchPlaceholder`)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t(`${pw}locationSearchAria`)}
          autoComplete="off"
        />
        {isSearching ? (
          <ul className="v2-location-suggest v2-location-suggest--compact" id="v2-location-suggest" role="listbox">
            {filteredStates.map((location) => {
              const selected = value === location;
              return (
                <li key={location} role="option" aria-selected={selected}>
                  <button type="button" className="v2-location-suggest__btn" onClick={() => selectState(location, selected)}>
                    <MapPin size={16} strokeWidth={2} className="v2-location-suggest__pin" aria-hidden />
                    <span className="v2-location-suggest__text">{location}</span>
                  </button>
                </li>
              );
            })}
            {filteredStates.length === 0 ? (
              <li className="v2-chip-grid__empty v2-text-muted">{t(`${pw}locationNoMatch`, { query: query.trim() })}</li>
            ) : null}
          </ul>
        ) : null}
      </div>

      {!isSearching ? (
        <div className="v2-popular-block v2-popular-block--compact">
          <div className="v2-popular-heading">
            <Sparkles size={16} strokeWidth={2} className="v2-popular-heading__icon" aria-hidden />
            <h3 className="v2-popular-heading__title" id="v2-popular-locations">
              {t(`${pw}locationPopularDestinations`)}
            </h3>
          </div>
          <div className="v2-grid-2 v2-grid-2--compact" role="group" aria-labelledby="v2-popular-locations">
            {FEATURED.map((loc) => {
              const selected = value === loc.name;
              return (
                <V2SelectableCard
                  key={loc.name}
                  type="button"
                  leading={<span aria-hidden>{loc.emoji}</span>}
                  title={loc.title}
                  subtitle={t(`${pw}${loc.descKey}`)}
                  costLevel={loc.costLevel}
                  selected={selected}
                  onClick={() => selectState(loc.name, selected)}
                />
              );
            })}
          </div>
        </div>
      ) : null}

      {showLocationInsight ? (
        <div className="v2-location-smart-card" role="region" aria-live="polite">
          <div className="v2-location-smart-card__row">
            <div className="v2-location-smart-card__icon" aria-hidden>
              <Sparkles size={18} strokeWidth={2} />
            </div>
            <div className="v2-location-smart-card__text">
              <h3 className="v2-location-smart-card__title">{t(`${pw}locationInsightSmartTitle`)}</h3>
              {wizardInsightKey ? (
                <p className="v2-location-smart-card__body">
                  <Trans
                    i18nKey={`preEnrollment.personalizeWizard.${wizardInsightKey}`}
                    components={{ st: <strong className="v2-location-smart-card__state" /> }}
                  />
                </p>
              ) : (
                <p className="v2-location-smart-card__body">{genericInsightText}</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
