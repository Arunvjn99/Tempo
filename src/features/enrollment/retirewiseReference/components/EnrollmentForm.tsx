import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  🎂
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">You're 31 years old 🎉</span>
                  <span className="text-xs text-slate-400 font-medium">Born on April 16, 1994</span>
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="custom"
                className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 bg-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
              >
                <Edit2 className="w-3 h-3" /> Edit
              </Button>
            </div>

            {/* Retirement Age Selector */}
            <div className="flex flex-col items-center gap-6 py-4">
              <h3 className="text-lg font-bold text-slate-900">At what age would you like to retire?</h3>
              
              <div className="flex items-center gap-8">
                <Button
                  type="button"
                  variant="secondary"
                  size="iconLg"
                  onClick={() => setRetirementAge(prev => Math.max(32, prev - 1))}
                  className="rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                  aria-label="Decrease retirement age"
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <div className="text-5xl font-black text-blue-600 tabular-nums">{retirementAge}</div>
                <Button
                  type="button"
                  variant="secondary"
                  size="iconLg"
                  onClick={() => setRetirementAge(prev => Math.min(75, prev + 1))}
                  className="rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                  <span>32</span>
                  <span>75</span>
                </div>
              </div>
            </div>

            {/* Comparison Box */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-900">Most people retire at 58 <span className="text-blue-600 ml-1">Popular</span></span>
                  <span className="text-[10px] text-slate-400 font-medium">Based on 2.4M users</span>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="custom"
                onClick={() => setRetirementAge(58)}
                className="h-auto px-0 text-[10px] font-bold text-blue-600 hover:bg-transparent hover:underline"
              >
                Apply this age
              </Button>
            </div>

            {/* Timeline Info */}
            <div className="flex flex-col items-center gap-4 pt-2">
              <p className="text-sm font-medium text-slate-600">
                Retiring at <span className="text-blue-600 font-bold">{retirementAge}</span> means you have <span className="text-blue-600 font-bold">{retirementAge - 31} years</span> until retirement.
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Your estimated retirement year: <span className="text-slate-900 font-bold">{2026 + (retirementAge - 31)}</span>
              </p>
              
              <div className="w-full relative h-8 mt-2">
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
                <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-blue-600 -translate-y-1/2 transition-all duration-500"
                  style={{ width: `${((retirementAge - 32) / (75 - 32)) * 100}%` }}
                />
                <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-blue-600 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-slate-300 -translate-y-1/2" />
                <div 
                  className="absolute top-1/2 w-3 h-3 rounded-full bg-white border-2 border-blue-600 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 shadow-sm"
                  style={{ left: `${((retirementAge - 32) / (75 - 32)) * 100}%` }}
                />
                <div className="absolute top-full left-0 text-[9px] font-bold text-slate-400 mt-1">Now 2026</div>
                <div className="absolute top-full right-0 text-[9px] font-bold text-slate-400 mt-1">Retire {2026 + (retirementAge - 31)}</div>
                <div 
                  className="absolute top-full -translate-x-1/2 text-[9px] font-bold text-blue-600 mt-1 transition-all duration-500"
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
              <h3 className="text-xl font-bold text-slate-900">Where do you imagine retiring? 🌎</h3>
              <p className="text-xs text-slate-400 font-medium">Your location helps us estimate cost of living and plan smarter.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for a state..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                        ? "border-blue-500 bg-blue-50/30 shadow-sm"
                        : "border-slate-100 bg-white hover:border-slate-200",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                        {dest.icon}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{dest.name}</span>
                          <span className={cn(
                            "text-[8px] px-1.5 py-0.5 rounded-full font-bold",
                            dest.cost === 'Low Cost' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                          )}>
                            {dest.cost}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{dest.desc}</span>
                      </div>
                    </div>
                    {selectedLocation === dest.name && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
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
                className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold">Smart Choice! 🎯</span>
                </div>
                <p className="text-[11px] text-blue-900/70 font-medium leading-relaxed">
                  <span className="font-bold text-blue-900">{selectedLocation}</span> is a popular retirement destination. With no state income tax and warm weather year-round, you could save $15,000+ annually on taxes alone.
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
              <h3 className="text-xl font-bold text-slate-900">What's your current retirement savings? 💰</h3>
              <p className="text-xs text-slate-400 font-medium">Sharing this helps us give you a clearer picture of your future.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enter your total retirement savings 💰</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">$</span>
                <input 
                  type="text" 
                  placeholder="0"
                  value={savings}
                  onChange={(e) => setSavings(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full pl-8 pr-4 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-xl"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Exclude 401(k), IRA, pension - only include personal savings and investments</p>
            </div>

            {savings && parseInt(savings) > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-blue-900">Great Start! 💪</span>
                  <p className="text-[11px] text-blue-900/70 font-medium leading-relaxed">
                    Every dollar counts! With <span className="font-bold text-blue-900">${parseInt(savings).toLocaleString()}</span> saved and {retirementAge - 31} years to retirement, consistent contributions can grow this significantly through compound interest.
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden flex flex-col"
          >
            {/* Blue Header */}
            <div className="bg-blue-600 p-8 relative overflow-hidden">
              <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-black text-white tracking-tight">Hi, Satish 👋</h2>
                  <p className="text-sm text-blue-100 font-medium">Let's personalize your retirement journey.</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
              </div>
              {/* Decorative Background Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl -ml-12 -mb-12" />
            </div>

            {/* Progress Bar */}
            <div className="px-10 py-6 flex justify-between items-center gap-4 border-b border-slate-50">
              {steps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center gap-3 flex-1 last:flex-none">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500",
                      isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : 
                      isCompleted ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider hidden sm:block",
                      isActive ? "text-slate-900" : isCompleted ? "text-emerald-500" : "text-slate-400"
                    )}>
                      {step.title}
                    </span>
                    {step.id < steps.length && (
                      <div className={cn(
                        "h-0.5 flex-1 mx-2 rounded-full transition-all duration-500",
                        isCompleted ? "bg-emerald-500" : "bg-slate-100"
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
                  className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-slate-400 hover:bg-transparent hover:text-slate-900"
                >
                  <Lock className="w-3 h-3" /> Save & Exit
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="custom"
                  onClick={prevStep}
                  className="flex h-auto items-center gap-2 px-0 text-[11px] font-bold text-slate-400 hover:bg-transparent hover:text-slate-900"
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
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="custom"
                  size="custom"
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                >
                  View My Plan <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
