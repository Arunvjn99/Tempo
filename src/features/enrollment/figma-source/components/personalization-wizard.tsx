// @ts-nocheck — verbatim Figma Make export (unused locals preserved).
import { useState } from "react";
import { useEnrollmentFlowNavigate } from "../enrollmentFlowNav";
import { ep } from "../paths";
import { useEnrollment } from "./enrollment-context";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  Zap,
  Search,
  Sparkles,
} from "lucide-react";

const TOTAL_STEPS = 4;
const stepLabels = ["Age", "Location", "Savings", "Comfort"];

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-6">
      <p className="text-[var(--text-secondary)] mb-2 text-xs">
        Step {step} of {TOTAL_STEPS}
      </p>
      <div className="flex items-center gap-1.5">
        {stepLabels.map((label, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < step;
          const isCurrent = stepNum === step;
          return (
            <div key={label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  isCompleted
                    ? "bg-[var(--color-primary)]"
                    : isCurrent
                    ? "bg-[var(--color-primary)]/50"
                    : "bg-[var(--surface-section)]"
                }`}
              />
              <span
                className={`text-xs transition-colors ${
                  isCurrent ? "text-[var(--color-primary)] font-semibold" : isCompleted ? "text-[var(--text-primary)] font-normal" : "text-[var(--text-secondary)] font-normal"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 1: Retirement Age ─── */
function StepRetirementAge() {
  const { personalization, updatePersonalization } = useEnrollment();
  const retirementYear = new Date().getFullYear() + (personalization.retirementAge - personalization.currentAge);
  const yearsUntil = personalization.retirementAge - personalization.currentAge;
  const quickAges = [60, 65, 67];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">When would you like to retire?</h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          You're currently {personalization.currentAge} years old.
        </p>
      </div>

      {/* Large age display */}
      <div className="text-center py-4">
        <p className="text-[var(--color-primary)] text-5xl font-bold">
          {personalization.retirementAge}
        </p>
        <p className="text-[var(--text-secondary)] text-sm">years old</p>
      </div>

      {/* Slider */}
      <div className="px-2">
        <input
          type="range"
          min={50}
          max={75}
          value={personalization.retirementAge}
          onChange={(e) => updatePersonalization({ retirementAge: Number(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
        />
        <div className="flex justify-between text-[var(--text-secondary)] mt-1 text-xs">
          <span>50</span>
          <span>75</span>
        </div>
      </div>

      {/* Quick select */}
      <div className="flex gap-2 justify-center">
        {quickAges.map((age) => (
          <button
            key={age}
            onClick={() => updatePersonalization({ retirementAge: age })}
            className={`px-5 py-2.5 rounded-xl transition-colors text-sm ${
              personalization.retirementAge === age
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-section)]"
            }`}
          >
            {age}
          </button>
        ))}
      </div>

      {/* Timeline preview */}
      <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="text-[var(--text-primary)] text-xs">Now</p>
            <p className="text-[var(--color-primary)] font-semibold text-sm">{new Date().getFullYear()}</p>
          </div>
          <div className="flex-1 mx-3 border-t-2 border-dashed border-[var(--color-primary)]/25 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] px-2 text-[var(--color-primary)] text-xs">
              {yearsUntil} years
            </span>
          </div>
          <div className="text-center">
            <p className="text-[var(--text-primary)] text-xs">Retirement</p>
            <p className="text-[var(--color-primary)] font-semibold text-sm">{retirementYear}</p>
          </div>
        </div>
      </div>

      {/* Suggestion chip */}
      <div className="flex items-center gap-2 justify-center">
        <Sparkles className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
        <span className="text-[var(--text-secondary)] text-xs">
          Most people retire at 65
        </span>
      </div>
    </div>
  );
}

/* ─── Step 2: Retirement Location ─── */
function StepLocation() {
  const { personalization, updatePersonalization } = useEnrollment();
  const [searchQuery, setSearchQuery] = useState("");

  const popularLocations = [
    { name: "Florida", emoji: "☀️" },
    { name: "Arizona", emoji: "🌵" },
    { name: "North Carolina", emoji: "🏔️" },
    { name: "South Carolina", emoji: "🌴" },
  ];

  const filteredLocations = searchQuery
    ? popularLocations.filter((loc) =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularLocations;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Where do you imagine retiring?</h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Location helps estimate cost of living.
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search city or state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3 pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Popular locations */}
      <div>
        <p className="text-[var(--text-secondary)] mb-3 text-xs">Popular retirement destinations</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredLocations.map((loc) => (
            <button
              key={loc.name}
              onClick={() => updatePersonalization({ retirementLocation: loc.name })}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                personalization.retirementLocation === loc.name
                  ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
                  : "border-[var(--border-default)] bg-[var(--surface-card)] hover:border-[var(--border-default)]"
              }`}
            >
              <span className="block mb-1 text-xl">{loc.emoji}</span>
              <span
                className={`font-medium text-sm ${
                  personalization.retirementLocation === loc.name ? "text-[var(--color-primary)]" : "text-[var(--text-primary)]"
                }`}
              >
                {loc.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Not sure option */}
      <button
        onClick={() => updatePersonalization({ retirementLocation: "Not sure yet" })}
        className={`w-full p-3 rounded-xl border-2 text-center transition-all text-sm ${
          personalization.retirementLocation === "Not sure yet"
            ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[var(--color-primary)]"
            : "border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:border-[var(--border-default)]"
        }`}
      >
        Not sure yet
      </button>
    </div>
  );
}

/* ─── Step 3: Current Savings ─── */
function StepSavings() {
  const { personalization, updatePersonalization } = useEnrollment();

  const quickAmounts = [
    { label: "$0", value: 0 },
    { label: "$5K", value: 5000 },
    { label: "$10K", value: 10000 },
    { label: "$50K+", value: 50000 },
  ];

  const formatCurrency = (val: number) => {
    if (val === 0) return "$0";
    return `$${val.toLocaleString()}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">What are your current personal savings?</h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          Include personal savings or investments outside your employer plan.
        </p>
      </div>

      {/* Currency input */}
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <input
          type="number"
          value={personalization.currentSavings || ""}
          onChange={(e) => updatePersonalization({ currentSavings: Number(e.target.value) })}
          placeholder="0"
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-4 pl-10 pr-4 text-2xl font-semibold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        />
      </div>

      {/* Quick options */}
      <div className="flex gap-2 flex-wrap">
        {quickAmounts.map((opt) => (
          <button
            key={opt.label}
            onClick={() => updatePersonalization({ currentSavings: opt.value })}
            className={`px-4 py-2.5 rounded-xl transition-colors text-sm ${
              personalization.currentSavings === opt.value
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-section)]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Encouraging insight */}
      <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] rounded-xl p-4 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-[var(--color-primary)] mt-0.5 shrink-0" />
        <p className="text-[color-mix(in_srgb,var(--color-primary)_80%,var(--text-primary))] text-sm">
          Every dollar saved today grows through compound interest. Starting early is the most powerful advantage you have.
        </p>
      </div>
    </div>
  );
}

/* ─── Step 4: Investment Comfort ─── */
function StepComfort() {
  const { personalization, updatePersonalization } = useEnrollment();

  const comfortLevels: {
    key: "conservative" | "balanced" | "growth" | "aggressive";
    label: string;
    desc: string;
    icon: typeof ShieldCheck;
    popular?: boolean;
  }[] = [
    { key: "conservative", label: "Conservative", desc: "Low risk, stable growth.", icon: ShieldCheck },
    { key: "balanced", label: "Balanced", desc: "Moderate growth and moderate risk.", icon: Zap, popular: true },
    { key: "growth", label: "Growth", desc: "Higher growth potential with market fluctuations.", icon: TrendingUp },
    { key: "aggressive", label: "Aggressive", desc: "Highest growth potential with higher volatility.", icon: TrendingUp },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">How comfortable are you with investment risk?</h2>
        <p className="text-[var(--text-secondary)] mt-1 text-sm">
          This helps us recommend a portfolio that matches your style.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {comfortLevels.map((level) => (
          <button
            key={level.key}
            onClick={() => updatePersonalization({ investmentComfort: level.key })}
            className={`p-4 rounded-xl border-2 text-left transition-all relative ${
              personalization.investmentComfort === level.key
                ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
                : "border-[var(--border-default)] bg-[var(--surface-card)] hover:border-[var(--border-default)]"
            }`}
          >
            {level.popular && (
              <span
                className="absolute -top-2.5 right-3 bg-[var(--color-primary)] text-[var(--primary-foreground)] px-2 py-0.5 rounded-full text-xs font-semibold"
              >
                Most common
              </span>
            )}
            <div className="flex items-center gap-2 mb-1">
              <level.icon
                className={`w-4 h-4 ${
                  personalization.investmentComfort === level.key ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
                }`}
              />
              <span
                className={`font-semibold text-sm ${
                  personalization.investmentComfort === level.key ? "text-[var(--color-primary)]" : "text-[var(--text-primary)]"
                }`}
              >
                {level.label}
              </span>
            </div>
            <p className="text-[var(--text-secondary)] text-xs">
              {level.desc}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Wizard Component ─── */
export function PersonalizationWizard() {
  const [wizardStep, setWizardStep] = useState(1);
  const navigate = useEnrollmentFlowNavigate();
  const { updatePersonalization, updateData, personalization } = useEnrollment();

  const canProceed = () => {
    switch (wizardStep) {
      case 1:
        return true;
      case 2:
        return personalization.retirementLocation !== "";
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (wizardStep < TOTAL_STEPS) {
      setWizardStep(wizardStep + 1);
    } else {
      // Complete wizard, sync comfort → riskLevel
      updatePersonalization({ wizardCompleted: true });
      updateData({ riskLevel: personalization.investmentComfort });
      navigate(ep("plan"));
    }
  };

  const handleBack = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const renderStep = () => {
    switch (wizardStep) {
      case 1:
        return <StepRetirementAge />;
      case 2:
        return <StepLocation />;
      case 3:
        return <StepSavings />;
      case 4:
        return <StepComfort />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="card-standard max-w-lg w-full p-6 sm:p-8">
        <WizardProgress step={wizardStep} />

        {renderStep()}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {wizardStep > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] text-sm ${
              canProceed()
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)]"
                : "bg-[var(--surface-section)] text-[var(--text-secondary)] cursor-not-allowed"
            }`}
          >
            {wizardStep === TOTAL_STEPS ? "Start Enrollment" : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
