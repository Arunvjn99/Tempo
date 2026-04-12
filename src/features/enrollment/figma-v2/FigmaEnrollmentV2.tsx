import React, { useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Lock,
  Minus,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wand2,
  Zap,
} from "lucide-react";
import { useUser } from "@/core/context/UserContext";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";
import "./styles/enrollment-form-pixel.css";

const wizardSteps = [
  { id: 1, title: "Age" },
  { id: 2, title: "Location" },
  { id: 3, title: "Savings" },
  { id: 4, title: "Comfort" },
];

/** Last step id (Comfort). `wizardSteps` order: Age → Location → Savings → Comfort. */
const STEP_LAST = wizardSteps[wizardSteps.length - 1].id;

export type ComfortKey = "conservative" | "balanced" | "growth" | "aggressive";

export type FigmaEnrollmentV2Props = {
  onClose?: () => void;
  onComplete?: () => void;
};

function ageFromIsoDob(iso: string): number {
  const birth = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return 31;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return Math.max(0, age);
}

type AgeStepProps = {
  retirementAge: number;
  setRetirementAge: React.Dispatch<React.SetStateAction<number>>;
  dob: string;
  setDob: React.Dispatch<React.SetStateAction<string>>;
  isEditingDob: boolean;
  setIsEditingDob: React.Dispatch<React.SetStateAction<boolean>>;
  currentAge: number;
  yearsToRetirement: number;
  estimatedRetirementYear: number;
};

function AgeStep({
  retirementAge,
  setRetirementAge,
  dob,
  setDob,
  isEditingDob,
  setIsEditingDob,
  currentAge,
  yearsToRetirement,
  estimatedRetirementYear,
}: AgeStepProps) {
  const formattedDob = useMemo(() => {
    const d = new Date(`${dob}T12:00:00`);
    if (Number.isNaN(d.getTime())) return dob;
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }, [dob]);

  const trackPct = ((retirementAge - 32) / (75 - 32)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      <div className="card-standard flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-2xl">
            🎂
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-sm font-bold text-[var(--text-primary)]">
              You&apos;re {currentAge} years old 🎉
            </span>
            {isEditingDob ? (
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                onBlur={() => setIsEditingDob(false)}
                className="mt-0.5 max-w-[200px] rounded-md border border-[var(--border-default)] bg-[var(--surface-card)] px-2 py-1 text-xs font-medium text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
              />
            ) : (
              <span className="text-xs font-medium text-[var(--text-secondary)]">Born on {formattedDob}</span>
            )}
          </div>
        </div>
        {!isEditingDob && (
          <Button
            type="button"
            variant="secondary"
            size="custom"
            onClick={() => setIsEditingDob(true)}
            className="shrink-0 flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--surface-muted)]"
          >
            <Edit2 className="w-3 h-3" /> Edit
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center gap-6 py-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">At what age would you like to retire?</h3>

        <div className="flex items-center gap-8">
          <Button
            type="button"
            variant="secondary"
            size="iconLg"
            onClick={() => setRetirementAge((prev) => Math.max(32, prev - 1))}
            className="rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
            aria-label="Decrease retirement age"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <div className="text-5xl font-black text-[var(--color-primary)] tabular-nums">{retirementAge}</div>
          <Button
            type="button"
            variant="secondary"
            size="iconLg"
            onClick={() => setRetirementAge((prev) => Math.min(75, prev + 1))}
            className="rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]"
            aria-label="Increase retirement age"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        <div className="w-full px-4">
          <input
            type="range"
            min="32"
            max="75"
            value={retirementAge}
            onChange={(e) => setRetirementAge(parseInt(e.target.value, 10))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[var(--surface-section)] accent-[var(--color-primary)]"
          />
          <div className="mt-2 flex justify-between text-[10px] font-bold text-[var(--text-secondary)]">
            <span>32</span>
            <span>75</span>
          </div>
        </div>
      </div>

      <div className="card-standard flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))]">
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[var(--text-primary)]">
              Most people retire at 58 <span className="ml-1 text-[var(--color-primary)]">Popular</span>
            </span>
            <span className="text-[10px] font-medium text-[var(--text-secondary)]">Based on 2.4M users</span>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="custom"
          onClick={() => setRetirementAge(58)}
          className="h-auto px-0 text-[10px] font-bold text-[var(--color-primary)] hover:bg-transparent hover:underline"
        >
          Apply this age
        </Button>
      </div>

      <div className="flex flex-col items-center gap-4 pt-2">
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          Retiring at <span className="font-bold text-[var(--color-primary)]">{retirementAge}</span> means you have{" "}
          <span className="font-bold text-[var(--color-primary)]">{yearsToRetirement} years</span> until retirement.
        </p>
        <p className="text-xs font-medium text-[var(--text-secondary)]">
          Your estimated retirement year:{" "}
          <span className="font-bold text-[var(--text-primary)]">{estimatedRetirementYear}</span>
        </p>

        <div className="mt-2 w-full space-y-2">
          <div className="relative h-4 w-full shrink-0">
            <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--surface-section)]" />
            <div
              className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-[var(--color-primary)] transition-all duration-500"
              style={{ width: `${trackPct}%` }}
            />
            <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--color-primary)]" />
            <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--surface-section)]" />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-primary)] bg-[var(--surface-card)] transition-all duration-500"
              style={{ left: `${trackPct}%` }}
            />
          </div>
          <div className="flex w-full justify-between gap-2 text-[9px] font-bold">
            <span className="text-[var(--text-secondary)]">Now 2026</span>
            <span className="text-[var(--color-primary)]">{yearsToRetirement} years</span>
            <span className="text-[var(--text-secondary)]">Retire {estimatedRetirementYear}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

type LocationCard = { name: string; cost: string; desc: string; icon: string };

const LOCATIONS = ["New York", "Florida", "Arizona", "North Carolina", "South Carolina"];

const LOCATION_CARDS: LocationCard[] = [
  { name: "New York", cost: "High Cost", desc: "Culture, seasons, and walkable neighborhoods.", icon: "🗽" },
  { name: "Florida", cost: "Low Cost", desc: "Tax-friendly, warm climate", icon: "🌴" },
  { name: "Arizona", cost: "Medium Cost", desc: "Dry climate, active communities", icon: "🌵" },
  { name: "North Carolina", cost: "Low Cost", desc: "Mountains & beaches, affordable", icon: "🏔️" },
  { name: "South Carolina", cost: "Low Cost", desc: "Coastal living, low taxes", icon: "🌅" },
];

type LocationStepProps = {
  selectedLocation: string | null;
  setSelectedLocation: (name: string) => void;
};

function LocationStep({ selectedLocation, setSelectedLocation }: LocationStepProps) {
  const [query, setQuery] = useState("");

  const filteredLocations = LOCATIONS.filter((loc) => loc.toLowerCase().includes(query.toLowerCase()));

  const displayedCards = filteredLocations
    .map((locName) => LOCATION_CARDS.find((c) => c.name === locName))
    .filter((c): c is LocationCard => c != null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">Where do you imagine retiring? 🌎</h3>
        <p className="text-xs font-medium text-[var(--text-secondary)]">
          Your location helps us estimate cost of living and plan smarter.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search for a state..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3 pl-11 pr-4 text-sm font-medium text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          <Sparkles className="w-3 h-3" /> Popular Retirement Destinations
        </div>
        <div className="grid grid-cols-2 gap-3">
          {displayedCards.map((dest) => (
            <Button
              key={dest.name}
              type="button"
              variant="custom"
              size="custom"
              onClick={() => setSelectedLocation(dest.name)}
              className={cn(
                "h-auto justify-start p-3 rounded-xl border text-left font-normal transition-all group relative",
                selectedLocation === dest.name
                  ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] "
                  : "border-[var(--border-default)] bg-[var(--surface-card)] hover:border-[color-mix(in_srgb,var(--border-default)_80%,var(--text-primary))]",
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] text-xl transition-transform group-hover:scale-110">
                  {dest.icon}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[var(--text-primary)]">{dest.name}</span>
                    <span
                      className={cn(
                        "text-[8px] px-1.5 py-0.5 rounded-full font-bold",
                        dest.cost === "Low Cost"
                          ? "bg-[color-mix(in_srgb,var(--color-primary)_22%,var(--surface-card))] text-[var(--color-primary)]"
                          : "bg-[color-mix(in_srgb,var(--color-primary)_24%,var(--surface-card))] text-[var(--color-primary)]",
                      )}
                    >
                      {dest.cost}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-[var(--text-secondary)]">{dest.desc}</span>
                </div>
              </div>
              {selectedLocation === dest.name && (
                <div className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)]">
                  <CheckCircle2 className="h-2.5 w-2.5 text-[var(--primary-foreground)]" />
                </div>
              )}
            </Button>
          ))}
        </div>
      </div>

      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_24%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))] p-4"
        >
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-bold text-[var(--text-primary)]">Smart Choice! 🎯</span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed text-[var(--text-secondary)]">
            <span className="font-bold text-[var(--text-primary)]">{selectedLocation}</span> is a popular retirement destination. With no state
            income tax and warm weather year-round, you could save $15,000+ annually on taxes alone.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

type SavingsStepProps = {
  savings: string;
  setSavings: React.Dispatch<React.SetStateAction<string>>;
  yearsToRetirement: number;
};

function SavingsStep({ savings, setSavings, yearsToRetirement }: SavingsStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      <div className="text-center flex flex-col gap-2">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">What&apos;s your current retirement savings? 💰</h3>
        <p className="text-xs font-medium text-[var(--text-secondary)]">
          Sharing this helps us give you a clearer picture of your future.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
          Enter your total retirement savings 💰
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--text-secondary)]">$</span>
          <input
            type="text"
            placeholder="0"
            value={savings}
            onChange={(e) => setSavings(e.target.value.replace(/[^0-9]/g, ""))}
            className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-4 pl-8 pr-4 text-xl font-bold text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
          />
        </div>
        <p className="text-[10px] font-medium text-[var(--text-secondary)]">
          Exclude 401(k), IRA, pension - only include personal savings and investments
        </p>
      </div>

      {savings && parseInt(savings, 10) > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-start gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_24%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))] p-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]">
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[var(--text-primary)]">Great Start! 💪</span>
            <p className="text-[11px] font-medium leading-relaxed text-[var(--text-secondary)]">
              Every dollar counts! With{" "}
              <span className="font-bold text-[var(--text-primary)]">${parseInt(savings, 10).toLocaleString()}</span>{" "}
              saved and {yearsToRetirement} years to retirement, consistent contributions can grow this significantly through
              compound interest.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ComfortStep() {
  const [selected, setSelected] = useState<ComfortKey | null>(null);

  const insights: Record<ComfortKey, string> = {
    conservative: "Stable growth with low volatility.",
    balanced: "Balanced risk and return.",
    growth: "Higher returns with fluctuations.",
    aggressive: "High growth potential with higher risk.",
  };

  const comfortLevels: {
    key: ComfortKey;
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6"
    >
      <div>
        <h3 className="text-xl font-bold text-[var(--text-primary)]">How comfortable are you with investment risk?</h3>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">This helps us recommend a portfolio that matches your style.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {comfortLevels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.key}
              type="button"
              onClick={() => setSelected(level.key)}
              className={cn(
                "enrollment-comfort-option relative w-full rounded-xl border-2 p-4 text-left outline-none transition-all",
                selected === level.key ? "selected-card" : "card",
              )}
            >
              {level.popular && (
                <span className="absolute -top-2.5 right-3 rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-semibold text-[var(--primary-foreground)]">
                  Most common
                </span>
              )}
              <div className="mb-1 flex items-center gap-2">
                <Icon className="enrollment-comfort-option-icon h-4 w-4 shrink-0" />
                <span className="enrollment-comfort-option-label text-sm font-semibold">{level.label}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{level.desc}</p>
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--color-primary)_28%,var(--border-default))] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] px-4 py-3 text-sm font-medium text-[var(--text-primary)]">
          {insights[selected]}
        </div>
      )}
    </motion.div>
  );
}

/**
 * Personalization wizard — only `useState` for steps; no router.
 * Root is `w-full` only; parent owns layout/scroll.
 */
export default function FigmaEnrollmentV2({ onClose, onComplete }: FigmaEnrollmentV2Props) {
  const { user, profile } = useUser();

  const firstName = useMemo(() => {
    const meta = user?.user_metadata as
      | { first_name?: string; full_name?: string; name?: string }
      | undefined;
    if (typeof meta?.first_name === "string" && meta.first_name.trim()) {
      return meta.first_name.trim();
    }
    if (profile?.name?.trim()) {
      return profile.name.trim().split(/\s+/)[0] ?? "User";
    }
    if (typeof meta?.full_name === "string" && meta.full_name.trim()) {
      return meta.full_name.trim().split(/\s+/)[0] ?? "User";
    }
    if (typeof meta?.name === "string" && meta.name.trim()) {
      return meta.name.trim().split(/\s+/)[0] ?? "User";
    }
    if (user?.email) {
      return user.email.split("@")[0] ?? "User";
    }
    return "User";
  }, [user, profile]);

  const [step, setStep] = useState(1);
  const [retirementAge, setRetirementAge] = useState(39);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [savings, setSavings] = useState("");
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [dob, setDob] = useState("1994-04-16");

  const currentAge = useMemo(() => ageFromIsoDob(dob), [dob]);
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const estimatedRetirementYear = 2026 + yearsToRetirement;

  const goNext = () => setStep((s) => Math.min(STEP_LAST, s + 1));
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="w-full">
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="enrollment-theme card-standard enrollment-figma-pixel-root flex w-full min-w-0 max-w-full flex-col overflow-hidden"
      >
        <div className="enrollment-figma-hero relative overflow-hidden p-8">
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-black tracking-tight text-[var(--primary-foreground)]">
                Hi, {firstName} 👋
              </h2>
              <p className="text-sm font-medium text-[color-mix(in_srgb,var(--primary-foreground)_85%,transparent)]">
                Let&apos;s personalize your retirement journey.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)]">
              <Wand2 className="h-6 w-6 text-[var(--text-primary)]" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] px-10 py-6">
          {wizardSteps.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;

            return (
              <div key={s.id} className="flex items-center gap-3 flex-1 last:flex-none">
                <div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]  "
                      : isCompleted
                        ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]"
                        : "border border-[var(--border-default)] bg-[var(--surface-card)] text-[var(--text-secondary)]",
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                </div>
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                    isActive
                      ? "text-[var(--text-primary)]"
                      : isCompleted
                        ? "text-[var(--color-primary)]"
                        : "text-[var(--text-secondary)]",
                  )}
                >
                  {s.title}
                </span>
                {s.id < wizardSteps.length && (
                  <div
                    className={cn(
                      "h-0.5 flex-1 mx-2 rounded-full transition-all duration-500",
                      isCompleted ? "bg-[var(--color-primary)]" : "border border-[var(--border-default)] bg-[var(--surface-card)]",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="px-10 py-8">
          {step === 1 && (
            <AgeStep
              retirementAge={retirementAge}
              setRetirementAge={setRetirementAge}
              dob={dob}
              setDob={setDob}
              isEditingDob={isEditingDob}
              setIsEditingDob={setIsEditingDob}
              currentAge={currentAge}
              yearsToRetirement={yearsToRetirement}
              estimatedRetirementYear={estimatedRetirementYear}
            />
          )}
          {step === 2 && (
            <LocationStep selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation} />
          )}
          {step === 3 && (
            <SavingsStep savings={savings} setSavings={setSavings} yearsToRetirement={yearsToRetirement} />
          )}
          {step === 4 && <ComfortStep />}
        </div>

        <div className="px-10 pb-8 pt-4 flex justify-between items-center gap-4">
          {step === 1 ? (
            <Button
              type="button"
              variant="ghost"
              size="custom"
              onClick={onClose}
              className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-primary)]"
            >
              <Lock className="h-3 w-3" /> Save & Exit
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="custom"
              onClick={goBack}
              className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-primary)]"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}

          {step < STEP_LAST ? (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={goNext}
              className="enrollment-figma-primary-cta flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-[var(--primary-foreground)] transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] bg-[var(--color-primary)]"
            >
              Continue <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="custom"
              size="custom"
              onClick={() => onComplete?.()}
              className="enrollment-figma-primary-cta flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-[var(--primary-foreground)] transition-all hover:scale-[1.02] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] bg-[var(--color-primary)]"
            >
              View My Plan <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
