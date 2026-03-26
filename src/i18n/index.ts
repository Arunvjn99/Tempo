import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import commonEn from "../locales/en/common.json";
import commonEs from "../locales/es/common.json";
import premiumWizardEn from "../locales/en/premiumPreEnrollmentWizard.json";
import premiumWizardEs from "../locales/es/premiumPreEnrollmentWizard.json";
import enrollmentEn from "../locales/en/enrollment.json";
import dashboardEn from "./en.json";
import dashboardEs from "./es.json";

type JsonRecord = Record<string, unknown>;

function unwrapJson<T>(mod: T | { default: T }): T {
  if (mod && typeof mod === "object" && "default" in (mod as object)) {
    return (mod as { default: T }).default;
  }
  return mod as T;
}

/** Deep-merge overlay onto base (objects only); overlay leaves replace base. Arrays are replaced, not merged. */
function deepMergePreferOverlay(base: JsonRecord, overlay: JsonRecord): JsonRecord {
  const out: JsonRecord = { ...base };
  for (const k of Object.keys(overlay)) {
    const b = base[k];
    const o = overlay[k];
    if (
      o !== null &&
      o !== undefined &&
      typeof o === "object" &&
      !Array.isArray(o) &&
      b !== null &&
      b !== undefined &&
      typeof b === "object" &&
      !Array.isArray(b)
    ) {
      out[k] = deepMergePreferOverlay(b as JsonRecord, o as JsonRecord) as unknown;
    } else {
      out[k] = o;
    }
  }
  return out;
}

/** Merge enrollment into translation.enrollment. Spanish uses deep merge so partial `enrollment.v1` in locale JSON overrides without dropping other v1 keys from the shared enrollment file. */
function mergeEnrollmentIntoTranslation(
  common: JsonRecord,
  enrollment: JsonRecord,
  preferExistingLocale = false,
): JsonRecord {
  const merged = { ...common };
  const existing = (merged.enrollment as JsonRecord) || {};
  merged.enrollment = preferExistingLocale
    ? deepMergePreferOverlay(enrollment, existing)
    : { ...existing, ...enrollment };
  return merged;
}

/** Merge dashboard strings from src/i18n locale JSON over common.json dashboard keys. */
function mergeDashboardPatch(common: JsonRecord, patch: JsonRecord): JsonRecord {
  const baseDash = (common.dashboard as JsonRecord) || {};
  const patchDash = (patch.dashboard as JsonRecord) || {};
  return { ...common, dashboard: { ...baseDash, ...patchDash } };
}

/**
 * Spanish `common.json` is intentionally sparse. Fill every missing leaf from English so
 * language switching never shows raw keys or empty UI; Spanish overrides still win.
 */
function fillLocaleFromEnglish(enVal: unknown, localeVal: unknown): unknown {
  if (typeof enVal === "string") {
    if (typeof localeVal === "string" && localeVal.length > 0) return localeVal;
    return enVal;
  }
  if (Array.isArray(enVal)) {
    if (Array.isArray(localeVal) && localeVal.length > 0) return localeVal;
    return enVal;
  }
  if (enVal && typeof enVal === "object") {
    const enObj = enVal as JsonRecord;
    const locObj =
      localeVal && typeof localeVal === "object" && !Array.isArray(localeVal)
        ? (localeVal as JsonRecord)
        : {};
    const out: JsonRecord = { ...enObj };
    for (const k of Object.keys(enObj)) {
      out[k] = fillLocaleFromEnglish(enObj[k], locObj[k]) as unknown;
    }
    for (const k of Object.keys(locObj)) {
      if (!(k in out)) {
        out[k] = locObj[k];
      }
    }
    return out;
  }
  return localeVal !== undefined ? localeVal : enVal;
}

/** Premium pre-enrollment modal (personalize plan) + state insight blurbs under preEnrollment. */
function mergePremiumPreEnrollmentWizard(common: JsonRecord, fragment: JsonRecord): JsonRecord {
  const pe = (common.preEnrollment as JsonRecord) || {};
  const fragPw = (fragment.personalizeWizard as JsonRecord) || {};
  const fragSi = (fragment.stateInsights as JsonRecord) || {};
  const existingPw = (pe.personalizeWizard as JsonRecord) || {};
  const existingSi = (pe.stateInsights as JsonRecord) || {};
  return {
    ...common,
    preEnrollment: {
      ...pe,
      personalizeWizard: { ...existingPw, ...fragPw },
      stateInsights: { ...existingSi, ...fragSi },
    },
  };
}

const enBase = mergePremiumPreEnrollmentWizard(unwrapJson(commonEn) as JsonRecord, unwrapJson(premiumWizardEn) as JsonRecord);
const esBase = mergePremiumPreEnrollmentWizard(unwrapJson(commonEs) as JsonRecord, unwrapJson(premiumWizardEs) as JsonRecord);
const enrollment = unwrapJson(enrollmentEn) as JsonRecord;
const patchEn = unwrapJson(dashboardEn) as JsonRecord;
const patchEs = unwrapJson(dashboardEs) as JsonRecord;

const enWithEnrollment = mergeEnrollmentIntoTranslation(enBase, enrollment);
const esWithEnrollment = mergeEnrollmentIntoTranslation(esBase, enrollment, true);

const enFinal = mergeDashboardPatch(enWithEnrollment, patchEn);
const esFinalRaw = mergeDashboardPatch(esWithEnrollment, patchEs);
const esFinal = fillLocaleFromEnglish(enFinal, esFinalRaw) as JsonRecord;

const resources = {
  en: { translation: enFinal },
  es: { translation: esFinal },
};

const supportedLngs = ["en", "es"];

function normalizeLng(lng: string | null): string {
  if (!lng) return "en";
  const base = lng.split("-")[0].toLowerCase();
  return supportedLngs.includes(base) ? base : "en";
}

function syncHtmlLang(lng: string) {
  if (typeof document !== "undefined") {
    document.documentElement.lang = normalizeLng(lng);
  }
}

const initialLng = normalizeLng(
  typeof localStorage !== "undefined" ? localStorage.getItem("i18nextLng") : null,
);

i18n.use(initReactI18next).init({
  resources,
  lng: initialLng,
  fallbackLng: "en",
  supportedLngs,
  defaultNS: "translation",
  load: "currentOnly",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  react: {
    useSuspense: false,
    bindI18n: "languageChanged loaded",
    bindI18nStore: "added removed",
  },
});

syncHtmlLang(i18n.language);

i18n.on("languageChanged", (lng: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("i18nextLng", normalizeLng(lng));
  }
  syncHtmlLang(lng);
});

export default i18n;
