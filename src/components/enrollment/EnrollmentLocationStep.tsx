import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { US_STATES } from "@/constants/usStates";
import { getStateLocationInsight } from "@/constants/stateLocationInsights";
import { InsightCard } from "./InsightCard";
import { RETIREMENT_LOCATION_UNKNOWN } from "./wizardConstants";

const FEATURED = [
  {
    name: "Florida" as const,
    emoji: "🌴",
    title: "Florida",
    description: "Warm weather, beaches, and retiree-friendly communities.",
  },
  {
    name: "Arizona" as const,
    emoji: "🌵",
    title: "Arizona",
    description: "Dry climate, golf, and strong snowbird appeal.",
  },
  {
    name: "North Carolina" as const,
    emoji: "🏔️",
    title: "North Carolina",
    description: "Mountains to coast with a moderate cost of living.",
  },
  {
    name: "South Carolina" as const,
    emoji: "🌊",
    title: "South Carolina",
    description: "Coastal charm and lower taxes than many peers.",
  },
] as const;

export interface EnrollmentLocationStepProps {
  value: string;
  onChange: (v: string) => void;
}

/**
 * Location step — JSX order (strict):
 * 1. Title 2. Subtitle 3. Search 4. Suggested cards 5. Not sure 6. Search results (when typing) 7. Insight
 */
export function EnrollmentLocationStep({ value, onChange }: EnrollmentLocationStepProps) {
  const [query, setQuery] = useState("");
  const isSearching = query.length > 0;
  const unknownSelected = value === RETIREMENT_LOCATION_UNKNOWN;

  const filteredStates = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return US_STATES;
    return US_STATES.filter((s) => s.toLowerCase().includes(q));
  }, [query]);

  const insightText = getStateLocationInsight(value);

  const selectState = (name: string, currentlySelected: boolean) => {
    onChange(currentlySelected ? "" : name);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1–2. Title + subtitle */}
      <div>
        <h3 className="premium-wizard__question">Where do you imagine retiring?</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Your location helps us estimate cost of living and plan smarter.
        </p>
      </div>

      {/* 3. Search input — first control after title/subtitle (no extra label above field; spacing below via parent gap-5 = 20px) */}
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
            placeholder="Search all U.S. states…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="premium-wizard__search-input"
            aria-label="Search U.S. states and District of Columbia"
            autoComplete="off"
          />
        </div>
        {isSearching ? (
          <p className="mt-1.5 text-xs text-[var(--color-text-tertiary,var(--color-text-secondary))]">
            All 50 states and D.C. — type to narrow the list, or scroll to pick one.
          </p>
        ) : null}
      </div>

      {/* 4. Suggested locations — hidden while searching */}
      {!isSearching ? (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-secondary)]">
            Popular destinations
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                    "rounded-xl border-2 p-3.5 text-left transition-colors",
                    selected
                      ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
                      : "border-[var(--color-border)] bg-[var(--color-background)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--color-border))]",
                  )}
                >
                  <span className="text-2xl" aria-hidden>
                    {loc.emoji}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">{loc.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">{loc.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* 5. Not sure yet */}
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
        Not sure yet
      </motion.button>

      {/* 6. Search results — only when typing */}
      {isSearching ? (
        <div className="max-h-[min(240px,42vh)] overflow-y-auto rounded-xl premium-wizard__scroll border border-[var(--color-border)]">
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
            <p className="px-3 py-8 text-center text-sm text-[var(--color-text-secondary)]">
              No states match &quot;{query.trim()}&quot;
            </p>
          )}
        </div>
      ) : null}

      {/* 7. Insight after selection */}
      <AnimatePresence mode="wait">
        {insightText ? (
          <InsightCard key={value}>{insightText}</InsightCard>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
