import type { TFunction } from "i18next";

/** Sync with `RETIREMENT_LOCATION_UNKNOWN` in `wizardConstants.ts`. */
const LOCATION_NOT_SURE = "unknown";

/** States with no broad state income tax on wages (simplified; not tax advice). */
const NO_STATE_INCOME_TAX_WAGES = new Set<string>([
  "Alaska",
  "Florida",
  "Nevada",
  "New Hampshire",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Washington",
  "Wyoming",
]);

function stateInsightKey(state: string): string {
  return state.replace(/\s+/g, "_");
}

/**
 * Returns a short insight for a selected U.S. state/DC, or null for empty / “not sure”.
 * Strings are loaded from locale JSON (premiumPreEnrollmentWizard), key path preEnrollment.stateInsights.
 */
export function getStateLocationInsight(state: string, t: TFunction): string | null {
  if (!state || state === LOCATION_NOT_SURE) return null;
  const specificKey = `preEnrollment.stateInsights.${stateInsightKey(state)}`;
  const specific = t(specificKey);
  if (specific !== specificKey) return specific;
  if (NO_STATE_INCOME_TAX_WAGES.has(state)) {
    return t("preEnrollment.stateInsights._noWageTax", { state });
  }
  return t("preEnrollment.stateInsights._generic", { state });
}
