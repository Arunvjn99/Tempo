import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { Minus, Plus, Sparkles } from "lucide-react";
import {
  WIZARD_RETIREMENT_AGE_MAX,
  WIZARD_RETIREMENT_AGE_MIN,
  clampWizardRetirementAge,
  getRetirementCalendarYear,
  getYearsUntilRetirement,
} from "@/enrollment/wizardStepInsights";
import { V2Slider } from "../V2Slider";

const POPULAR_RETIREMENT_AGE = 58;

function resolveLocaleTag(i18nLanguage: string): string {
  const base = i18nLanguage.split("-")[0]?.toLowerCase() ?? "en";
  return base === "es" ? "es-ES" : "en-US";
}

function formatDOBDisplay(isoDate: string, i18nLanguage: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(resolveLocaleTag(i18nLanguage), { month: "long", day: "numeric", year: "numeric" });
}

const PARTY_POPPER = "\u{1F389}";

function AnimatedPartyPopper({ transitionDelay = 0 }: { transitionDelay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className="v2-party-popper"
      aria-hidden
      animate={
        reduceMotion
          ? undefined
          : {
              rotate: [0, -12, 12, -8, 8, 0],
              y: [0, -2, 0, -1, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { repeat: Infinity, duration: 2.35, ease: "easeInOut", delay: transitionDelay }
      }
    >
      {PARTY_POPPER}
    </motion.span>
  );
}

function AgeCurrentTitle({ age, i18nKey }: { age: number; i18nKey: string }) {
  const { t } = useTranslation();
  return <p className="v2-age-current-card__title">{t(i18nKey, { age })}</p>;
}

export interface V2AgeStepProps {
  dateOfBirth: string;
  currentAge: number;
  retirementAge: number;
  editingAge: boolean;
  onEdit: () => void;
  onDoneEditing: () => void;
  onDateOfBirthChange: (isoDate: string) => void;
  onRetirementAgeChange: (v: number) => void;
  onApplySuggestedAge: () => void;
  canApplySuggestedAge: boolean;
}

export function V2AgeStep({
  dateOfBirth,
  currentAge,
  retirementAge,
  editingAge,
  onEdit,
  onDoneEditing,
  onDateOfBirthChange,
  onRetirementAgeChange,
  onApplySuggestedAge,
  canApplySuggestedAge,
}: V2AgeStepProps) {
  const { t, i18n } = useTranslation();
  const pw = "preEnrollment.personalizeWizard.";
  const min = WIZARD_RETIREMENT_AGE_MIN;
  const max = WIZARD_RETIREMENT_AGE_MAX;
  const sliderValue = clampWizardRetirementAge(retirementAge);
  const yearsToGrow = getYearsUntilRetirement(sliderValue, currentAge);
  const sliderPercent = ((sliderValue - min) / (max - min)) * 100;
  const currentYear = new Date().getFullYear();
  const estimatedRetirementYear = getRetirementCalendarYear(sliderValue, currentAge);

  const timelineYearsLabel = yearsToGrow === 1 ? t(`${pw}yearOne`) : t(`${pw}yearsOther`);

  return (
    <div className="v2-wizard-step-stack">
      <div className="v2-age-current-card v2-age-current-card--compact">
        <AnimatePresence mode="wait">
          {editingAge ? (
            <motion.div
              key="editing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <label htmlFor="v2-wizard-dob" className="v2-label v2-label--compact">
                {t(`${pw}dobLabel`)}
              </label>
              <input
                id="v2-wizard-dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => onDateOfBirthChange(e.target.value)}
                onBlur={onDoneEditing}
                max={new Date().toISOString().slice(0, 10)}
                className="v2-dob-input v2-dob-input--compact"
              />
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="v2-age-current-card__row"
            >
              <div className="v2-age-avatar" aria-hidden>
                <AnimatedPartyPopper />
              </div>
              <div className="v2-age-current-card__body">
                <AgeCurrentTitle age={currentAge} i18nKey={`${pw}youreYearsOld`} />
                <p className="v2-age-current-card__born">{t(`${pw}bornOn`, { date: formatDOBDisplay(dateOfBirth, i18n.language) })}</p>
              </div>
              <button type="button" onClick={onEdit} className="v2-edit-link v2-age-current-card__edit" aria-label={t(`${pw}editDob`)}>
                {t(`${pw}editDobShort`)}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <h2 className="v2-section__title v2-section__title--age v2-section__title--compact v2-shrink-0">{t(`${pw}retireQuestion`)}</h2>

      <div className="v2-age-slider-unit">
        <div className="v2-age-control-row v2-age-control-row--compact" role="group" aria-labelledby="v2-retire-age-label">
          <span id="v2-retire-age-label" className="v2-visually-hidden">
            {t(`${pw}retirementAgeAria`)}
          </span>
          <button
            type="button"
            disabled={sliderValue <= min}
            onClick={() => onRetirementAgeChange(Math.max(min, sliderValue - 1))}
            className="v2-age-round-btn"
            aria-label={t(`${pw}decreaseRetirementAge`)}
          >
            <Minus size={20} strokeWidth={2.5} aria-hidden />
          </button>
          <div className="v2-age-display">
            <div className="v2-age-display__label">{t(`${pw}planRetireAt`)}</div>
            <div className="v2-age-display__value v2-age-display__value--compact" aria-live="polite">
              {sliderValue}
            </div>
          </div>
          <button
            type="button"
            disabled={sliderValue >= max}
            onClick={() => onRetirementAgeChange(Math.min(max, sliderValue + 1))}
            className="v2-age-round-btn"
            aria-label={t(`${pw}increaseRetirementAge`)}
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden />
          </button>
        </div>

        <div className="v2-slider-outer">
          <V2Slider
            min={min}
            max={max}
            value={sliderValue}
            onChange={(e) => onRetirementAgeChange(parseInt(e.target.value, 10))}
            percentFill={sliderPercent}
            aria-label={t(`${pw}retirementAgeAria`)}
          />
          <div className="v2-slider-labels">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        </div>
      </div>

      {/* figma-dump: one combined insight (purple popular + gray summary + timeline) */}
      <div className="v2-age-insight-unified" role="region" aria-live="polite">
        <div className="v2-age-insight-unified__popular">
          <div className="v2-age-insight-unified__popular-row">
            <div className="v2-age-insight-unified__popular-main">
              <div className="v2-age-insight-unified__sparkle" aria-hidden>
                <Sparkles size={14} strokeWidth={2} />
              </div>
              <div className="v2-age-insight-unified__popular-text">
                <div className="v2-age-insight-unified__title-line">
                  <h3 className="v2-age-insight-unified__popular-title">
                    {t(`${pw}popularRetireTitle`, { age: POPULAR_RETIREMENT_AGE })}
                  </h3>
                  <span className="v2-age-insight-unified__badge">{t(`${pw}badgePopular`)}</span>
                </div>
                <p className="v2-age-insight-unified__popular-sub">{t(`${pw}popularRetireUsersFigma`)}</p>
              </div>
            </div>
            <button
              type="button"
              className="v2-age-insight-unified__apply"
              onClick={onApplySuggestedAge}
              disabled={!canApplySuggestedAge}
            >
              {t(`${pw}applyThisAge`)}
            </button>
          </div>
        </div>
        <div className="v2-age-insight-unified__feedback">
          <div className="v2-age-retire-summary">
            <p className="v2-age-retire-summary__headline">
              <Trans
                i18nKey={`${pw}ageInsightLine1`}
                values={{ age: sliderValue, years: yearsToGrow, yearsLabel: timelineYearsLabel }}
                components={{
                  retire: <span className="v2-insight-em" />,
                  yl: <span className="v2-insight-em v2-insight-em--accent" />,
                }}
              />
            </p>
            <p className="v2-age-retire-summary__year-line">
              {t(`${pw}estimatedRetirementYearPrefix`)}{" "}
              <span className="v2-age-retire-summary__year-num">{estimatedRetirementYear}</span>
            </p>
            <div
              className="v2-age-retire-summary__timeline"
              role="img"
              aria-label={t(`${pw}retirementTimelineAria`, {
                fromYear: currentYear,
                toYear: estimatedRetirementYear,
              })}
            >
              <span className="v2-age-retire-summary__tl-label v2-age-retire-summary__tl-label--left">
                {t(`${pw}retirementTimelineNow`)}
              </span>
              <span className="v2-age-retire-summary__tl-label v2-age-retire-summary__tl-label--right">
                {t(`${pw}retirementTimelineRetire`)}
              </span>
              <div className="v2-age-retire-summary__tl-dot-wrap v2-age-retire-summary__tl-dot-wrap--left">
                <div className="v2-age-retire-summary__tl-dot" />
              </div>
              <div className="v2-age-retire-summary__tl-track">
                <span className="v2-age-retire-summary__tl-chip">
                  {yearsToGrow} {timelineYearsLabel}
                </span>
              </div>
              <div className="v2-age-retire-summary__tl-dot-wrap v2-age-retire-summary__tl-dot-wrap--right">
                <div className="v2-age-retire-summary__tl-dot" />
              </div>
              <span className="v2-age-retire-summary__tl-year v2-age-retire-summary__tl-year--left">{currentYear}</span>
              <span className="v2-age-retire-summary__tl-year v2-age-retire-summary__tl-year--right">
                {estimatedRetirementYear}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
