import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import es from "./locales/es/common.json";
import enrollmentEn from "./locales/en/enrollment.json";

type JsonRecord = Record<string, unknown>;

/** Merge enrollment namespace into translation.enrollment so t("enrollment.xxx") resolves. When preferExistingLocale is true (e.g. for es), existing locale keys win over the enrollment file so Spanish stays Spanish. */
function mergeEnrollmentIntoTranslation(
  common: JsonRecord,
  enrollment: JsonRecord,
  preferExistingLocale = false
): JsonRecord {
  const merged = { ...common };
  const existing = (merged.enrollment as JsonRecord) || {};
  merged.enrollment = preferExistingLocale
    ? { ...enrollment, ...existing }
    : { ...existing, ...enrollment };
  return merged;
}

const enWithEnrollment = mergeEnrollmentIntoTranslation(
  en as JsonRecord,
  enrollmentEn as JsonRecord
);
const esWithEnrollment = mergeEnrollmentIntoTranslation(
  es as JsonRecord,
  enrollmentEn as JsonRecord,
  true
);

const resources = {
  en: { translation: enWithEnrollment },
  es: { translation: esWithEnrollment },
};

const supportedLngs = ["en", "es"];

function normalizeLng(lng: string | null): string {
  if (!lng) return "en";
  const base = lng.split("-")[0].toLowerCase();
  return supportedLngs.includes(base) ? base : "en";
}

const initialLng = normalizeLng(localStorage.getItem("i18nextLng"));

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
  react: {
    useSuspense: false,
    bindI18n: "languageChanged loaded",
    bindI18nStore: "added removed",
  },
});

i18n.on("languageChanged", (lng: string) => {
  localStorage.setItem("i18nextLng", normalizeLng(lng));
});

export default i18n;
