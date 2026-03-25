import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Modal } from "../ui/Modal";
import { cn } from "@/lib/utils";
import {
  loadEnrollmentDraft,
  saveEnrollmentDraft,
  type EnrollmentDraft,
} from "@/enrollment/enrollmentDraftStore";
import { US_STATES } from "@/constants/usStates";
import { getRoutingVersion, withVersion } from "@/core/version";
import { Step4Comfort, type InvestmentComfort } from "./Step4Comfort";
import { InsightCard } from "./InsightCard";
import { Step2Location } from "./Step2Location";
import { RETIREMENT_LOCATION_UNKNOWN } from "./wizardConstants";

export { RETIREMENT_LOCATION_UNKNOWN };

const TOTAL_STEPS = 4;
const DEFAULT_DOB = "1994-04-16";

function getAgeFromDOB(isoDate: string): number {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return 30;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return Math.max(18, Math.min(74, age));
}

function formatDOBDisplay(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function getDOBFromAge(age: number): string {
  const y = new Date().getFullYear() - age;
  return `${y}-01-01`;
}

interface WizardFormState {
  dateOfBirth: string;
  retirementAge: number;
  annualSalary: number;
  retirementLocation: string;
  savingsAmount: number;
  investmentComfort: InvestmentComfort;
}

const DEFAULT_STATE: WizardFormState = {
  dateOfBirth: DEFAULT_DOB,
  retirementAge: 65,
  annualSalary: 45000,
  retirementLocation: "",
  savingsAmount: 0,
  investmentComfort: "balanced",
};

export interface PersonalizePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

function formatCurrency(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
}

function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

const stepTransition = { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] };

const STEP_LABELS = ["Age", "Location", "Savings", "Comfort"] as const;

function WizardStepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="py-1">
      <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">
        Step {currentStep} of {TOTAL_STEPS}
      </p>
      <div className="flex items-stretch gap-1.5 sm:gap-2">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isUpcoming = stepNum > currentStep;
          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
              <div
                className={cn(
                  "h-1.5 w-full rounded-full transition-colors",
                  isCompleted && "bg-[var(--color-primary)]",
                  isCurrent && "bg-[var(--color-primary)] opacity-80",
                  isUpcoming && "bg-[var(--color-border)]",
                )}
                aria-hidden
              />
              <div className="flex flex-col items-center gap-0.5">
                {isCompleted ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-primary)] text-white" aria-hidden>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold tabular-nums",
                      isCurrent && "bg-[color-mix(in_srgb,var(--color-primary)_15%,transparent)] text-[var(--color-primary)]",
                      isUpcoming && "text-[var(--color-text-tertiary,var(--color-text-secondary))]",
                    )}
                  >
                    {stepNum}
                  </span>
                )}
                <span
                  className={cn(
                    "text-center text-[10px] font-medium leading-tight sm:text-[11px]",
                    isCurrent && "font-semibold text-[var(--color-primary)]",
                    isCompleted && "text-[var(--color-text-secondary)]",
                    isUpcoming && "text-[var(--color-text-tertiary,var(--color-text-secondary))]",
                  )}
                >
                  {label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExitConfirmation({ onConfirm, onCancel }: { isOpen: boolean; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div className="premium-wizard__exit-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
      <motion.div className="premium-wizard__exit-dialog" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
        <div className="flex justify-center mb-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        </div>
        <h3 className="text-lg font-bold text-[var(--color-text)] text-center mb-1">Are you sure you want to exit setup?</h3>
        <p className="text-sm text-[var(--color-text-secondary)] text-center mb-6">Your progress will be saved. You can pick up where you left off anytime.</p>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="premium-wizard__exit-btn premium-wizard__exit-btn--cancel">Keep Going</button>
          <button type="button" onClick={onConfirm} className="premium-wizard__exit-btn premium-wizard__exit-btn--confirm">Exit Setup</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Step1RetirementAge({
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
}: {
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
}) {
  const max = 75;
  const min = Math.min(max, Math.max(22, currentAge + 1));
  const sliderValue = Math.min(max, Math.max(min, retirementAge));
  const isRangeLocked = min === max;
  const yearsToGrow = Math.max(0, sliderValue - currentAge);
  const sliderPercent = ((sliderValue - min) / (max - min)) * 100;
  const ageInsightText = useMemo(() => {
    if (yearsToGrow >= 30)
      return `Retiring at ${sliderValue} gives you ${yearsToGrow} years of growth — a long runway for compounding and a powerful advantage for your nest egg.`;
    if (yearsToGrow >= 20)
      return `Retiring at ${sliderValue} gives you ${yearsToGrow} years of growth — a strong runway to build wealth before you tap your savings.`;
    if (yearsToGrow >= 10)
      return `At ${sliderValue}, you'll have ${yearsToGrow} years of growth ahead. Every extra year in the market can meaningfully boost your outcome.`;
    return `Retiring at ${sliderValue} means ${yearsToGrow} years of growth. We'll help you make the most of the time you have.`;
  }, [sliderValue, yearsToGrow]);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {editingAge ? (
          <motion.div key="editing" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }} className="premium-wizard__info-card">
            <label htmlFor="wizard-dob-input" className="block text-sm font-semibold text-[var(--color-text)] mb-2">Date of birth</label>
            <div className="relative">
              <input id="wizard-dob-input" type="date" value={dateOfBirth} onChange={(e) => onDateOfBirthChange(e.target.value)} onBlur={onDoneEditing} max={new Date().toISOString().slice(0, 10)} className="premium-wizard__dob-input" aria-describedby="wizard-dob-helper" />
              <span className="premium-wizard__dob-icon" aria-hidden><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></span>
            </div>
            <p id="wizard-dob-helper" className="mt-2 text-xs text-[var(--color-text-secondary)]">Your age updates automatically based on this date.</p>
          </motion.div>
        ) : (
          <motion.div key="display" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="premium-wizard__info-card">
            <div className="flex items-center gap-4">
              <div className="premium-wizard__info-icon"><span className="text-xl" role="img" aria-label="celebration">🎉</span></div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-[var(--color-text)]">You're {currentAge} years old 🎉</p>
                <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">Born on {formatDOBDisplay(dateOfBirth)}</p>
                <button type="button" onClick={onEdit} className="premium-wizard__edit-link">Edit date of birth</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div><h3 className="premium-wizard__question">At what age would you like to retire?</h3></div>
      <div className="space-y-4">
        <div className="premium-wizard__slider-container">
          <input
            type="range"
            min={min}
            max={max}
            value={sliderValue}
            disabled={isRangeLocked}
            onChange={(e) => onRetirementAgeChange(parseInt(e.target.value, 10))}
            className="premium-wizard__slider"
            style={{ "--slider-percent": `${sliderPercent}%` } as React.CSSProperties}
            aria-label="Retirement age"
          />
          <div className="flex justify-between mt-1.5 px-0.5"><span className="text-[11px] text-[var(--color-text-tertiary,var(--color-text-secondary))] font-medium">{min}</span><span className="text-[11px] text-[var(--color-text-tertiary,var(--color-text-secondary))] font-medium">{max}</span></div>
        </div>
        <div className="flex items-center justify-center">
          <div className="premium-wizard__stepper">
            <button type="button" disabled={isRangeLocked || sliderValue <= min} onClick={() => onRetirementAgeChange(Math.max(min, sliderValue - 1))} className="premium-wizard__stepper-btn" aria-label="Decrease retirement age"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
            <div className="premium-wizard__stepper-value">
              <motion.span
                key={sliderValue}
                initial={{ y: -6, opacity: 0.65 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="text-2xl font-bold text-[var(--color-primary)] tabular-nums"
              >
                {sliderValue}
              </motion.span>
              <span className="text-xs font-medium text-[var(--color-text-secondary)] mt-0.5">years old</span>
            </div>
            <button type="button" disabled={isRangeLocked || sliderValue >= max} onClick={() => onRetirementAgeChange(Math.min(max, sliderValue + 1))} className="premium-wizard__stepper-btn" aria-label="Increase retirement age"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg></button>
          </div>
        </div>
      </div>
      <div className="space-y-3 pt-1">
        <AnimatePresence mode="wait">
          <InsightCard key={sliderValue}>{ageInsightText}</InsightCard>
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-xl border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface-elevated,var(--color-background))_100%,transparent)] p-4 shadow-sm dark:bg-[color-mix(in_srgb,var(--color-surface-elevated,#1a1a1a)_80%,transparent)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[var(--color-text)]">Most people retire at 65</p>
              <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-secondary)]">A common benchmark that balances longevity and time in the market.</p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">Popular</span>
          </div>
          <button
            type="button"
            disabled={!canApplySuggestedAge}
            onClick={onApplySuggestedAge}
            className={cn(
              "mt-3 w-full rounded-lg py-2.5 text-sm font-semibold transition-colors",
              canApplySuggestedAge
                ? "bg-[var(--color-primary)] text-white hover:opacity-95"
                : "cursor-not-allowed bg-[var(--color-border)] text-[var(--color-text-secondary)] opacity-60",
            )}
          >
            Apply this age
          </button>
        </motion.div>
      </div>
    </div>
  );
}

const SAVINGS_QUICK_CHIPS: { label: string; amount: number }[] = [
  { label: "$0", amount: 0 },
  { label: "$5K", amount: 5000 },
  { label: "$10K", amount: 10000 },
  { label: "$50K+", amount: 50000 },
];

function Step3Savings({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const display = value > 0 ? formatCurrency(value) : "";
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value > 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="premium-wizard__question">Have you built retirement savings elsewhere?</h3>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">This won't affect your enrollment — it simply helps us create a more complete retirement outlook.</p>
      </div>
      <div>
        <p className="mb-2 text-xs font-medium text-[var(--color-text-secondary)]">Quick select</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick savings amounts">
          {SAVINGS_QUICK_CHIPS.map((chip) => {
            const selected = value === chip.amount;
            return (
              <motion.button
                key={chip.label}
                type="button"
                onClick={() => onChange(chip.amount)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "rounded-full border-2 px-3.5 py-2 text-sm font-semibold transition-colors",
                  selected
                    ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-text)] shadow-sm ring-2 ring-[color-mix(in_srgb,var(--color-primary)_28%,transparent)]"
                    : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--color-border))]",
                )}
              >
                {chip.label}
              </motion.button>
            );
          })}
        </div>
      </div>
      <div className={cn("premium-wizard__currency-wrapper", isFocused && "premium-wizard__currency-wrapper--focused")}>
        <span className="premium-wizard__currency-symbol">$</span>
        <input type="text" inputMode="numeric" value={display} onChange={(e) => onChange(parseCurrencyInput(e.target.value))} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder="Enter total balance (optional)" className="premium-wizard__currency-input" aria-describedby="step3-helper" />
      </div>
      <p id="step3-helper" className="text-sm text-[var(--color-text-secondary)]">{hasValue ? "Great — we'll include this in your long-term projection." : "No problem — we'll plan based on this account alone."}</p>
      <AnimatePresence mode="wait">
        <InsightCard key="savings-insight-static">
          Even small savings grow significantly over time through compounding — every dollar you add now can work harder for your future self.
        </InsightCard>
      </AnimatePresence>
    </div>
  );
}

export const PersonalizePlanModal = ({ isOpen, onClose, userName = "there" }: PersonalizePlanModalProps) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardFormState>(DEFAULT_STATE);
  const [editingAge, setEditingAge] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const stateRef = useRef(state);
  stateRef.current = state;
  const ageAnimRef = useRef<number | null>(null);

  const currentAge = useMemo(() => getAgeFromDOB(state.dateOfBirth), [state.dateOfBirth]);

  const minRetirementAge = useMemo(() => Math.min(75, Math.max(22, currentAge + 1)), [currentAge]);

  const canApplySuggestedAge = minRetirementAge <= 65;

  const applyRetirementAgeSmooth = useCallback(() => {
    if (ageAnimRef.current != null) cancelAnimationFrame(ageAnimRef.current);
    const prev = stateRef.current;
    const ca = getAgeFromDOB(prev.dateOfBirth);
    const min = Math.min(75, Math.max(22, ca + 1));
    const end = Math.min(75, Math.max(min, 65));
    const start = prev.retirementAge;
    if (start === end) return;

    const t0 = performance.now();
    const duration = 400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      const v = Math.round(start + (end - start) * eased);
      setState((p) => ({ ...p, retirementAge: v }));
      if (t < 1) {
        ageAnimRef.current = requestAnimationFrame(tick);
      } else {
        ageAnimRef.current = null;
      }
    };
    ageAnimRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => {
      if (ageAnimRef.current != null) cancelAnimationFrame(ageAnimRef.current);
    };
  }, []);

  const canProceedFromStep = useCallback(
    (s: number): boolean => {
      switch (s) {
        case 1:
          return (
            Number.isFinite(state.retirementAge) &&
            state.retirementAge >= minRetirementAge &&
            state.retirementAge <= 75
          );
        case 2: {
          const loc = state.retirementLocation;
          if (!loc) return false;
          if (loc === RETIREMENT_LOCATION_UNKNOWN) return true;
          return US_STATES.includes(loc);
        }
        case 3:
          return true;
        case 4:
          return (
            state.investmentComfort === "conservative" ||
            state.investmentComfort === "balanced" ||
            state.investmentComfort === "growth" ||
            state.investmentComfort === "aggressive"
          );
        default:
          return false;
      }
    },
    [state, minRetirementAge],
  );

  useEffect(() => {
    setState((prev) => {
      const max = 75;
      const minRetirementAge = Math.min(max, Math.max(22, currentAge + 1));
      const normalizedRetirementAge = Math.min(max, Math.max(minRetirementAge, prev.retirementAge));
      if (normalizedRetirementAge === prev.retirementAge) return prev;
      return { ...prev, retirementAge: normalizedRetirementAge };
    });
  }, [currentAge]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setEditingAge(false);
      setShowExitConfirm(false);
      const draft = loadEnrollmentDraft();
      if (draft) {
        setState((prev) => ({
          ...prev,
          dateOfBirth: draft.dateOfBirth ?? (draft.currentAge != null ? getDOBFromAge(draft.currentAge) : prev.dateOfBirth),
          retirementAge: draft.retirementAge ?? prev.retirementAge,
          annualSalary: draft.annualSalary ?? prev.annualSalary,
          retirementLocation: draft.retirementLocation || prev.retirementLocation,
          savingsAmount: draft.otherSavings?.amount ?? prev.savingsAmount,
          investmentComfort: draft.investmentComfort ?? prev.investmentComfort,
        }));
      }
    }
  }, [isOpen]);

  const update = useCallback(<K extends keyof WizardFormState>(key: K, value: WizardFormState[K]) => {
    if (key === "retirementAge" && ageAnimRef.current != null) {
      cancelAnimationFrame(ageAnimRef.current);
      ageAnimRef.current = null;
    }
    setState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const persistDraft = useCallback(() => {
    const existing = loadEnrollmentDraft();
    const yearsToRetire = state.retirementAge - currentAge;
    const merged: EnrollmentDraft = {
      ...existing,
      currentAge,
      dateOfBirth: state.dateOfBirth,
      retirementAge: state.retirementAge,
      yearsToRetire,
      annualSalary: state.annualSalary,
      retirementLocation: state.retirementLocation,
      investmentComfort: state.investmentComfort,
      otherSavings: state.savingsAmount > 0 ? { type: "Other", amount: state.savingsAmount } : existing?.otherSavings,
    };
    saveEnrollmentDraft(merged);
  }, [state, currentAge]);

  const handleCloseAttempt = () => setShowExitConfirm(true);
  const handleConfirmExit = () => {
    persistDraft();
    setShowExitConfirm(false);
    onClose();
  };
  const handleSaveAndExit = () => {
    persistDraft();
    onClose();
  };
  const handleNext = () => {
    if (!canProceedFromStep(step)) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
    else {
      persistDraft();
      onClose();
      navigate(withVersion(version, "/enrollment/choose-plan"));
    }
  };
  const handlePrevious = () => setStep(Math.max(1, step - 1));

  const isLastStep = step === TOTAL_STEPS;
  const isFirstStep = step === 1;
  const ctaLabel = step === 1 ? "Continue" : isLastStep ? "Start Enrollment" : "Next";
  const nextDisabled = !canProceedFromStep(step);

  return (
    <Modal isOpen={isOpen} onClose={handleCloseAttempt} closeOnOverlayClick={false} dialogClassName="premium-wizard__dialog" wizard>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.3 }} className="premium-wizard">
        <div className="relative flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-[var(--color-border)]">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium tracking-wide uppercase text-[var(--color-primary)] opacity-80 mb-0.5">Welcome back,</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] tracking-tight">{userName}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">Let's personalize your retirement journey.</p>
          </div>
          <button type="button" onClick={handleCloseAttempt} className="premium-wizard__close-btn" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
        <div className="px-6 pt-4 pb-2 sm:px-8">
          <WizardStepProgress currentStep={step} />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 sm:px-8 sm:py-5">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step-1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step1RetirementAge
                  dateOfBirth={state.dateOfBirth}
                  currentAge={currentAge}
                  retirementAge={state.retirementAge}
                  editingAge={editingAge}
                  onEdit={() => setEditingAge(true)}
                  onDoneEditing={() => setEditingAge(false)}
                  onDateOfBirthChange={(v) => update("dateOfBirth", v)}
                  onRetirementAgeChange={(v) => update("retirementAge", v)}
                  onApplySuggestedAge={applyRetirementAgeSmooth}
                  canApplySuggestedAge={canApplySuggestedAge}
                />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="step-2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step2Location value={state.retirementLocation} onChange={(v) => update("retirementLocation", v)} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div key="step-3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step3Savings value={state.savingsAmount} onChange={(v) => update("savingsAmount", v)} />
              </motion.div>
            )}
            {step === 4 && (
              <motion.div key="step-4" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={stepTransition}>
                <Step4Comfort value={state.investmentComfort} onChange={(v) => update("investmentComfort", v)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="premium-wizard__footer">
          <button type="button" onClick={handleSaveAndExit} className="premium-wizard__ghost-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save & Exit
          </button>
          <div className="flex items-center gap-2.5">
            {!isFirstStep && (
              <motion.button type="button" onClick={handlePrevious} className="premium-wizard__back-btn" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.2 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                Back
              </motion.button>
            )}
            <motion.button
              type="button"
              onClick={handleNext}
              disabled={nextDisabled}
              className={cn("premium-wizard__cta", nextDisabled && "pointer-events-none opacity-50")}
              whileHover={nextDisabled ? undefined : { y: -1 }}
              whileTap={nextDisabled ? undefined : { scale: 0.98 }}
            >
              {ctaLabel}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          </div>
        </div>
        {showExitConfirm && <ExitConfirmation isOpen={showExitConfirm} onConfirm={handleConfirmExit} onCancel={() => setShowExitConfirm(false)} />}
      </motion.div>
    </Modal>
  );
};
