import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Lock,
  Minus,
  Plus,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface EnrollmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const steps = [
  { id: 1, title: 'Age' },
  { id: 2, title: 'Location' },
  { id: 3, title: 'Savings' },
];

export const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ isOpen, onClose, onComplete }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [retirementAge, setRetirementAge] = useState(39);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [savings, setSavings] = useState<string>('');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const destinations = [
    { name: 'Florida', cost: 'Low Cost', desc: 'Tax-friendly, warm climate', icon: '🌴' },
    { name: 'Arizona', cost: 'Medium Cost', desc: 'Dry climate, active communities', icon: '🌵' },
    { name: 'North Carolina', cost: 'Low Cost', desc: 'Mountains & beaches, affordable', icon: '🏔️' },
    { name: 'South Carolina', cost: 'Low Cost', desc: 'Coastal living, low taxes', icon: '🌅' },
  ];

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* User Info Card */}
            <div className="card-standard flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] text-2xl">
                  🎂
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[var(--text-primary)]">You're 31 years old 🎉</span>
                  <span className="text-xs text-[var(--text-secondary)] font-medium">Born on April 16, 1994</span>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="custom"
                className="flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface-card)] px-3 py-1.5 text-[11px] font-bold text-[var(--color-primary)] transition-colors hover:bg-[var(--surface-section)]"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
            </div>

            {/* Retirement Age Selector */}
            <div className="flex flex-col items-center gap-6 py-4">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">At what age would you like to retire?</h3>
              
              <div className="flex items-center gap-8">
                <Button
                  type="button"
                  variant="secondary"
                  size="iconLg"
                  onClick={() => setRetirementAge(prev => Math.max(32, prev - 1))}
                  className="rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
                  aria-label="Decrease retirement age"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="text-5xl font-black text-[var(--color-primary)] tabular-nums">{retirementAge}</div>
                <Button
                  type="button"
                  variant="secondary"
                  size="iconLg"
                  onClick={() => setRetirementAge(prev => Math.min(75, prev + 1))}
                  className="rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]"
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
                  onChange={(e) => setRetirementAge(parseInt(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-[var(--surface-section)] accent-[var(--color-primary)]"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-[var(--text-secondary)]">
                  <span>32</span>
                  <span>75</span>
                </div>
              </div>
            </div>

            {/* Comparison Box */}
            <div className="card-standard flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))] rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--text-primary)]">Most people retire at 58 <span className="text-[var(--color-primary)] ml-1">Popular</span></span>
                  <span className="text-[10px] text-[var(--text-secondary)] font-medium">Based on 2.4M users</span>
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

            {/* Timeline Info */}
            <div className="flex flex-col items-center gap-4 pt-2">
              <p className="text-sm font-medium text-[var(--text-secondary)]">
                Retiring at <span className="text-[var(--color-primary)] font-bold">{retirementAge}</span> means you have <span className="text-[var(--color-primary)] font-bold">{retirementAge - 31} years</span> until retirement.
              </p>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Your estimated retirement year: <span className="text-[var(--text-primary)] font-bold">{2026 + (retirementAge - 31)}</span>
              </p>
              
              <div className="w-full relative h-8 mt-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-[var(--surface-section)]" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-[var(--color-primary)] -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${((retirementAge - 32) / (75 - 32)) * 100}%` }}
                />
                <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-[var(--color-primary)] -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 h-2 w-2 -translate-y-1/2 rounded-full bg-[var(--surface-section)]" />
                <div 
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[var(--color-primary)] bg-[var(--surface-card)] transition-all duration-500"
                  style={{ left: `${((retirementAge - 32) / (75 - 32)) * 100}%` }}
                />
                <div className="absolute top-full left-0 text-[9px] font-bold text-[var(--text-secondary)] mt-1">Now 2026</div>
                <div className="absolute top-full right-0 text-[9px] font-bold text-[var(--text-secondary)] mt-1">Retire {2026 + (retirementAge - 31)}</div>
                <div 
                  className="absolute top-full -translate-x-1/2 text-[9px] font-bold text-[var(--color-primary)] mt-1 transition-all duration-500"
                  style={{ left: `${((retirementAge - 32) / (75 - 32)) * 100}%` }}
                >
                  {retirementAge - 31} years
                </div>
              </div>
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Where do you imagine retiring? 🌎</h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Your location helps us estimate cost of living and plan smarter.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-secondary)]" />
              <input 
                type="text" 
                placeholder="Search for a state..."
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-3 pl-11 pr-4 font-medium text-sm transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Popular Retirement Destinations
              </div>
              <div className="grid grid-cols-2 gap-3">
                {destinations.map((dest) => (
                  <Button
                    key={dest.name}
                    type="button"
                    variant="custom"
                    size="custom"
                    onClick={() => setSelectedLocation(dest.name)}
                    className={cn(
                      "h-auto justify-start p-3 rounded-xl border text-left font-normal transition-all group relative",
                      selectedLocation === dest.name
                        ? "border-[var(--color-primary)] bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]/30 "
                        : "border-[var(--border-default)] bg-[var(--surface-card)] hover:border-[var(--border-default)]/80",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {dest.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[var(--text-primary)]">{dest.name}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded-full font-bold",
                            dest.cost === 'Low Cost' ? "bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))] text-[var(--color-primary)]" : "bg-[color-mix(in_srgb,var(--text-secondary)_14%,var(--surface-card))] text-[var(--text-secondary)]"
                          )}>
                            {dest.cost}
                          </span>
                        </div>
                        <span className="text-[10px] text-[var(--text-secondary)] font-medium">{dest.desc}</span>
                      </div>
                    </div>
                    {selectedLocation === dest.name && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-[var(--primary-foreground)]" />
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
                className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-2xl p-4 border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-[var(--color-primary)]">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold text-[var(--color-primary)]">Smart Choice! 🎯</span>
                </div>
                <p className="text-[11px] font-medium leading-relaxed text-[var(--text-secondary)]">
                  <span className="font-bold text-[var(--text-primary)]">{selectedLocation}</span> is a popular retirement destination. With no state income tax and warm weather year-round, you could save $15,000+ annually on taxes alone.
                </p>
              </motion.div>
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            <div className="text-center flex flex-col gap-2">
              <h3 className="text-xl font-bold text-[var(--text-primary)]">What's your current retirement savings? 💰</h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">Sharing this helps us give you a clearer picture of your future.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Enter your total retirement savings 💰</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[var(--text-secondary)]">$</span>
                <input 
                  type="text" 
                  placeholder="0"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] py-4 pl-8 pr-4 text-xl font-bold text-[var(--text-primary)] transition-all focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_20%,transparent)]"
                />
              </div>
              <p className="text-[10px] text-[var(--text-secondary)] font-medium">Exclude 401(k), IRA, pension - only include personal savings and investments</p>
            </div>

            {savings && parseInt(savings) > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-2xl p-4 border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))] rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-[var(--text-primary)]">Great Start! 💪</span>
                  <p className="text-[11px] font-medium leading-relaxed text-[var(--text-secondary)]">
                    Every dollar counts! With <span className="font-bold text-[var(--text-primary)]">${parseInt(savings).toLocaleString()}</span> saved and {retirementAge - 31} years to retirement, consistent contributions can grow this significantly through compound interest.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]" onClick={onClose} role="presentation" />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="card-standard relative flex w-full max-w-xl flex-col overflow-hidden"
      >
            {/* Blue Header */}
            <div className="relative overflow-hidden bg-[var(--color-primary)] p-8">
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-[var(--primary-foreground)] tracking-tight">Hi, Satish 👋</h2>
                  <p className="text-sm font-medium text-[color-mix(in_srgb,var(--primary-foreground)_85%,transparent)]">
                    Let&apos;s personalize your retirement journey.
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)]">
                  <Wand2 className="h-6 w-6 text-[var(--text-primary)]" />
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="px-10 py-6 flex justify-between items-center gap-4 border-b border-[var(--border-default)]">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center gap-3 flex-1 last:flex-none">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                      isActive ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]  " : 
                      isCompleted ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                      isActive ? "text-[var(--text-primary)]" : isCompleted ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
                    )}>
                      {step.title}
                    </span>
                    {step.id < steps.length && (
                      <div className={cn(
                        "h-0.5 flex-1 mx-2 rounded-full transition-all duration-500",
                        isCompleted ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="px-10 py-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {renderStep()}
            </div>

            {/* Footer */}
            <div className="px-10 pb-8 pt-4 flex justify-between items-center gap-4">
              {currentStep === 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="custom"
                  onClick={onClose}
                  className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-primary)]"
                >
                  <Lock className="w-3 h-3" /> Save & Exit
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="custom"
                  onClick={prevStep}
                  className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-transparent hover:text-[var(--text-primary)]"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              )}

              {currentStep < steps.length ? (
                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={nextStep}
                  className="px-8 py-3 bg-[var(--color-primary)] text-[var(--primary-foreground)] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-primary-hover)] hover:scale-[1.02] active:scale-[0.98] transition-all  "
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => {
                    navigate("/plans");
                    onComplete();
                    onClose();
                  }}
                  className="px-8 py-3 bg-[var(--color-primary)] text-[var(--primary-foreground)] rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[var(--color-primary-hover)] hover:scale-[1.02] active:scale-[0.98] transition-all  "
                >
                  View My Plan <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
      </motion.div>
    </div>
  );
};
