import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { AnimatedLocationGlobe } from "@/components/v2";
import { cn } from "@/lib/utils";
import { US_STATES } from "@/constants/usStates";
import { getStateLocationInsight } from "@/constants/stateLocationInsights";
import { OnboardingStepCard, SuggestionCard, WizardGuideInsight } from "./onboarding";
import { RETIREMENT_LOCATION_UNKNOWN } from "./wizardConstants";

const FEATURED = [
  {
    name: "Florida" as const,
    emoji: "🌴",
    title: "Florida",
    descKey: "featuredFloridaDesc" as const,
  },
  {
    name: "Arizona" as const,
    emoji: "🌵",
    title: "Arizona",
    descKey: "featuredArizonaDesc" as const,
  },
  {
    name: "North Carolina" as const,
    emoji: "🏔️",
    title: "North Carolina",
    descKey: "featuredNorthCarolinaDesc" as const,
  },
  {
    name: "South Carolina" as const,
    emoji: "🌊",
    title: "South Carolina",
    descKey: "featuredSouthCarolinaDesc" as const,
  },
] as const;

const SUGGEST_STATE = "Florida" as const;

export interface EnrollmentLocationStepProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * Location step — guided layout: card (search, picks, not sure) + suggestion + insight.
 */
export function EnrollmentLocationStep({ value, onChange }: EnrollmentLocationStepProps) {
  const { t } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";
  const [query, setQuery] = useState("");
  const isSearching = query.length > 0;
  const unknownSelected = value === RETIREMENT_LOCATION_UNKNOWN;

  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  const insightText = getStateLocationInsight(value, t);

  const selectState = (name: string, currentlySelected: boolean) => {
    onChange(currentlySelected ? "" : name);
  };

  const suggestApplyDisabled = value === SUGGEST_STATE;

  return (
    <>
      <OnboardingStepCard>
        <div>
          <h3 className="premium-wizard__question text-center">
            <Trans
              i18nKey="preEnrollment.personalizeWizard.locationQuestion"
              components={{ globe: <AnimatedLocationGlobe /> }}
            />
          </h3>
          <p className="mt-2 text-center text-sm leading-relaxed text-[var(--color-text-secondary)]">{t(`${pw}locationSubtitle`)}</p>
        </div>

        <p className="text-center text-sm text-[var(--color-text-tertiary,var(--color-text-secondary))]">{t(`${pw}locationPlanningIn`)}</p>

        <div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-[var(--color-text-secondary)]"
                aria-hidden
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <input
              type="text"
              placeholder={t(`${pw}locationSearchPlaceholder`)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="premium-wizard__search-input"
              aria-label={t(`${pw}locationSearchAria`)}
              autoComplete="off"
            />
          </div>
          {isSearching ? (
            <p className="mt-1.5 text-center text-xs text-[var(--color-text-tertiary,var(--color-text-secondary))]">{t(`${pw}locationSearchHint`)}</p>
          ) : null}
        </div>

        {!isSearching ? (
          <div>
            <p className="mb-1.5 text-center text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
              {t(`${pw}locationPopularDestinations`)}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {FEATURED.map((loc) => {
                const selected = value === loc.name;
                return (
                  <motion.button
                    key={loc.name}
                    type="button"
                    layout
                    onClick={() => selectState(loc.name, selected)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      "rounded-xl border-2 p-2.5 text-left transition-colors",
                      selected
                        ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
                        : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--color-border))]",
                    )}
                  >
                    <span className="text-xl leading-none" aria-hidden>
                      {loc.emoji}
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-snug text-[var(--color-text)]">{loc.title}</p>
                    <p className="mt-0.5 text-xs leading-snug text-[var(--color-text-secondary)]">{t(`${pw}${loc.descKey}`)}</p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : null}

        <motion.button
          type="button"
          layout
          onClick={() => onChange(unknownSelected ? "" : RETIREMENT_LOCATION_UNKNOWN)}
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
          className={cn(
            "w-full rounded-xl border-2 px-4 py-3.5 text-center text-sm font-medium transition-colors",
            unknownSelected
              ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_8%,transparent)] text-[var(--color-text)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
              : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:border-[var(--color-border)]",
          )}
        >
          {t(`${pw}locationNotSure`)}
        </motion.button>

        {isSearching ? (
          <div className="max-h-[min(240px,42vh)] overflow-y-auto rounded-xl border border-[var(--color-border)] premium-wizard__scroll">
            <div className="grid grid-cols-2 gap-3 p-2 sm:grid-cols-3">
              {filteredStates.map((location) => {
                const selected = value === location;
                return (
                  <motion.button
                    key={location}
                    type="button"
                    layout
                    onClick={() => selectState(location, selected)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn("premium-wizard__chip", selected && "premium-wizard__chip--selected")}
                  >
                    <span className="flex-1 text-left">{location}</span>
                    <AnimatePresence>
                      {selected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "backOut" }}
                          className="premium-wizard__chip-check"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
            {filteredStates.length === 0 && (
              <p className="px-3 py-8 text-center text-sm text-[var(--color-text-secondary)]">{t(`${pw}locationNoMatch`, { query: query.trim() })}</p>
            )}
          </div>
        ) : null}

        <SuggestionCard
          title={t(`${pw}locationSuggestTitle`, { state: SUGGEST_STATE })}
          subtitle={t(`${pw}locationSuggestSubtitle`)}
          badge={t(`${pw}badgePopular`)}
          actionLabel={t(`${pw}apply`)}
          onAction={() => onChange(SUGGEST_STATE)}
          disabled={suggestApplyDisabled}
        />
      </OnboardingStepCard>

      <WizardGuideInsight key={value || "none"}>
        {insightText ?? t(`${pw}locationInsightFallback`)}
      </WizardGuideInsight>
    </>
  );
}
