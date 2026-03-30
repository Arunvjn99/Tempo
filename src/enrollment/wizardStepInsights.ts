/**
 * Pure wizard step insight logic (steps 1–3). UI strings live in i18n under `personalizeWizard.*`.
 * Maps to product state: retirement age, selected U.S. state, savings dollars.
 */

export const WIZARD_RETIREMENT_AGE_MIN = 32;
export const WIZARD_RETIREMENT_AGE_MAX = 75;

export function clampWizardRetirementAge(age: number): number {
  if (!Number.isFinite(age)) return 65;
  return Math.min(WIZARD_RETIREMENT_AGE_MAX, Math.max(WIZARD_RETIREMENT_AGE_MIN, Math.round(age)));
}

/** Selected retirement age (slider), not current age. */
export function getAgeInsightKey(retirementAge: number): "ageInsightBandUnder50" | "ageInsightBand50to60" | "ageInsightBandOver60" {
  if (retirementAge < 50) return "ageInsightBandUnder50";
  if (retirementAge <= 60) return "ageInsightBand50to60";
  return "ageInsightBandOver60";
}

/** Years from now until retirement age (floored at 0). */
export function getYearsUntilRetirement(retirementAge: number, currentAge: number): number {
  return Math.max(0, retirementAge - currentAge);
}

export function getRetirementCalendarYear(retirementAge: number, currentAge: number): number {
  const y = getYearsUntilRetirement(retirementAge, currentAge);
  return new Date().getFullYear() + y;
}

/** Rich location blurbs (wizard card); other states use locale `stateInsights` via caller. */
export const WIZARD_LOCATION_INSIGHT_KEYS: Record<
  string,
  "locationInsightFlorida" | "locationInsightArizona" | "locationInsightNorthCarolina" | "locationInsightSouthCarolina"
> = {
  Florida: "locationInsightFlorida",
  Arizona: "locationInsightArizona",
  "North Carolina": "locationInsightNorthCarolina",
  "South Carolina": "locationInsightSouthCarolina",
};

export function getWizardLocationInsightKey(state: string): string | null {
  return WIZARD_LOCATION_INSIGHT_KEYS[state] ?? null;
}

export type SavingsInsightKeys = {
  titleKey: "savingsWizardTitle0" | "savingsWizardTitleUnder10k" | "savingsWizardTitleMid" | "savingsWizardTitleOver50k";
  bodyKey: "savingsWizardBody0" | "savingsWizardBodyUnder10k" | "savingsWizardBodyMid" | "savingsWizardBodyOver50k";
};

export function getSavingsInsightKeys(amount: number): SavingsInsightKeys {
  const n = Number.isFinite(amount) ? Math.max(0, Math.floor(amount)) : 0;
  if (n === 0) return { titleKey: "savingsWizardTitle0", bodyKey: "savingsWizardBody0" };
  if (n < 10_000) return { titleKey: "savingsWizardTitleUnder10k", bodyKey: "savingsWizardBodyUnder10k" };
  if (n <= 50_000) return { titleKey: "savingsWizardTitleMid", bodyKey: "savingsWizardBodyMid" };
  return { titleKey: "savingsWizardTitleOver50k", bodyKey: "savingsWizardBodyOver50k" };
}

/** Single source of truth shape for steps 1–3 (maps to `WizardFormState` fields). */
export type WizardStepsCoreState = {
  /** Target retirement age (slider). */
  retirementAge: number;
  retirementLocation: string | null;
  savingsAmount: number;
};
