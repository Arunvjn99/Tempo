import { useMemo, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";
import { getSavingsInsightKeys } from "@/enrollment/wizardStepInsights";
import { AnimatedMoneyBag } from "../AnimatedMoneyBag";

function resolveLocaleTag(i18nLanguage: string): string {
  const base = i18nLanguage.split("-")[0]?.toLowerCase() ?? "en";
  return base === "es" ? "es-ES" : "en-US";
}

function formatCurrency(value: number, i18nLanguage: string): string {
  return new Intl.NumberFormat(resolveLocaleTag(i18nLanguage), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatUsdSaved(value: number, i18nLanguage: string): string {
  return new Intl.NumberFormat(resolveLocaleTag(i18nLanguage), {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

const QUICK_AMOUNTS = [5_000, 10_000, 50_000] as const;

export interface V2SavingsStepProps {
  value: number;
  /** From age step (retirement age − current age); used in the $0-savings insight copy. */
  yearsUntilRetirement: number;
  onChange: (v: number) => void;
}

export function V2SavingsStep({ value, yearsUntilRetirement, onChange }: V2SavingsStepProps) {
  const { t, i18n } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";
  const display = formatCurrency(value, i18n.language);
  const { titleKey, bodyKey } = useMemo(() => getSavingsInsightKeys(value), [value]);
  const [isFocused, setIsFocused] = useState(false);

  const insightBody = useMemo(() => {
    if (bodyKey === "savingsWizardBody0") {
      const yearsLabel = yearsUntilRetirement === 1 ? t(`${pw}yearOne`) : t(`${pw}yearsOther`);
      return t(`${pw}${bodyKey}`, {
        amount: formatUsdSaved(value, i18n.language),
        years: yearsUntilRetirement,
        yearsLabel,
      });
    }
    return t(`${pw}${bodyKey}`);
  }, [bodyKey, value, yearsUntilRetirement, i18n.language, t, pw]);

  const chipLabels = useMemo(
    () => [t(`${pw}chip5k`), t(`${pw}chip10k`), t(`${pw}chip50k`)],
    [t, pw],
  );

  const money = <AnimatedMoneyBag />;

  return (
    <div className="v2-wizard-step-stack">
      <div className="v2-section v2-section--compact">
        <h2 className="v2-section__title v2-section__title--compact">
          <Trans i18nKey="preEnrollment.personalizeWizard.savingsQuestion" components={{ money }} />
        </h2>
        <p className="v2-section__subtitle v2-section__subtitle--compact">{t(`${pw}savingsSubtitle`)}</p>
      </div>

      <div className="v2-stack-gap-3">
        <label htmlFor="v2-savings-amount" className="v2-field-label">
          <Trans i18nKey="preEnrollment.personalizeWizard.savingsFieldLabel" components={{ money }} />
        </label>
        <div className={["v2-amount-field", isFocused && "v2-amount-field--focused"].filter(Boolean).join(" ")}>
          <span className="v2-amount-field__prefix" aria-hidden>
            $
          </span>
          <input
            id="v2-savings-amount"
            type="text"
            inputMode="numeric"
            value={display}
            onChange={(e) => onChange(parseCurrencyInput(e.target.value))}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={t(`${pw}savingsPlaceholder`)}
            className="v2-input v2-input--amount"
            aria-describedby="v2-savings-hint"
          />
        </div>
        <div className="v2-savings-quick-row" role="group" aria-label={t(`${pw}quickSelect`)}>
          {QUICK_AMOUNTS.map((amt, i) => (
            <button
              key={amt}
              type="button"
              className="v2-savings-quick-btn"
              onClick={() => onChange(amt)}
              aria-pressed={value === amt}
            >
              {chipLabels[i]}
            </button>
          ))}
        </div>
        <p id="v2-savings-hint" className="v2-text-caption">
          {t(`${pw}savingsFigmaHint`)}
        </p>
      </div>

      <div className="v2-location-smart-card" role="region" aria-live="polite">
        <div className="v2-location-smart-card__row">
          <div className="v2-location-smart-card__icon" aria-hidden>
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <div className="v2-location-smart-card__text">
            <h3 className="v2-location-smart-card__title">{t(`${pw}${titleKey}`)}</h3>
            <p className="v2-location-smart-card__body">{insightBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
