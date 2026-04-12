import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRightLeft,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  Info,
  LayoutDashboard,
  PieChart as PieChartIcon,
  Sparkles,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementContributionProps {
  onBack: () => void;
  onNext: () => void;
}

const steps = [
  { id: 1, label: 'Plan' },
  { id: 2, label: 'Contribution' },
  { id: 3, label: 'Source' },
  { id: 4, label: 'Auto Increase' },
  { id: 5, label: 'Investment' },
  { id: 6, label: 'Readiness' },
  { id: 7, label: 'Review' },
];

export const RetirementContribution: React.FC<RetirementContributionProps> = ({ onBack, onNext }) => {
  const [contribution, setContribution] = useState(6);
  const employerMatch = 4;

  return (
    <div className="min-h-screen bg-[var(--surface-page)] font-sans selection:bg-[var(--color-primary)] selection:text-[var(--primary-foreground)]">
      {/* Header */}
      <header className="bg-[var(--surface-card)] border-b border-[var(--border-default)] px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[var(--primary-foreground)]" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[var(--text-primary)]">RetireWell</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Retirement Plan', icon: Building2, active: true },
              { label: 'Transactions', icon: ArrowRightLeft },
              { label: 'Investments', icon: TrendingUp },
              { label: 'Profile', icon: User },
            ].map((item) => (
              <a 
                key={item.label} 
                href="#" 
                className={cn(
                  "flex items-center gap-2 text-sm font-semibold transition-all py-2 relative",
                  item.active ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.active && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  />
                )}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="secondary"
            size="iconLg"
            className="relative rounded-full bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[color-mix(in_srgb,var(--text-primary)_40%,var(--surface-card))] rounded-full border-2 border-[var(--surface-card)]" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_16%,var(--surface-card))] flex items-center justify-center text-[var(--color-primary)] font-bold text-sm border-2 border-[var(--surface-card)] ">
            JD
          </div>
        </div>
      </header>

      {/* Progress Sub-header */}
      <div className="bg-[var(--surface-card)] border-b border-[var(--border-default)] px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 2 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 2 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 2 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-8 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Set Your Contribution</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Decide how much of your pre-tax income you want to save.</p>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12">
          {/* Contribution Slider Card */}
          <div className="card-standard flex flex-col gap-10 p-10">
            <div className="flex flex-col gap-8">
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Your Contribution</span>
                  <div className="text-5xl font-black text-[var(--text-primary)]">{contribution}%</div>
                </div>
                <div className="flex flex-col gap-1 items-end text-right">
                  <span className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-wider">Employer Match</span>
                  <div className="text-2xl font-black text-[var(--color-primary)]">+{employerMatch}%</div>
                </div>
              </div>

              <div className="relative pt-6 pb-2">
                <input 
                  type="range" 
                  min="0" 
                  max="25" 
                  value={contribution}
                  onChange={(e) => setContribution(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--surface-section)] accent-[var(--color-primary)]"
                />
                <div className="flex justify-between mt-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  <span>0%</span>
                  <span>5%</span>
                  <span>10%</span>
                  <span>15%</span>
                  <span>20%</span>
                  <span>25%</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-2xl border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] flex items-start gap-4">
              <div className="w-10 h-10 shrink-0 rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-[var(--text-primary)] text-sm">Smart Suggestion</h4>
                <p className="text-[color-mix(in_srgb,var(--color-primary)_78%,var(--text-primary))]/80 text-sm font-medium leading-relaxed">
                  Most people in your position contribute at least 6% to take full advantage of the employer match.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Estimated Paycheck Impact</span>
                </div>
                <div className="text-xl font-bold text-[var(--text-primary)]">-$240.00</div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Per pay period (Pre-tax)</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Monthly Savings</span>
                </div>
                <div className="text-xl font-bold text-[var(--color-primary)]">$800.00</div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Including employer match</p>
              </div>
            </div>
          </div>

          {/* Impact Visualization */}
          <div className="flex flex-col gap-8">
            <div className="bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] rounded-[32px] p-10 text-[var(--primary-foreground)] flex flex-col gap-8 relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)]">
                    <PieChartIcon className="w-5 h-5 text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">Contribution Breakdown</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Your Contribution</span>
                    </div>
                    <span className="text-sm font-bold">{contribution}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[var(--color-primary)]" />
                      <span className="text-sm font-medium text-[var(--text-secondary)]">Employer Match</span>
                    </div>
                    <span className="text-sm font-bold">{employerMatch}%</span>
                  </div>
                  <div className="h-px bg-[var(--surface-card)]/10 my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-[var(--primary-foreground)]">Total Annual Savings</span>
                    <span className="text-xl font-black text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]">$9,600</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)]/20 rounded-full blur-[80px]" />
            </div>

            <div className="card-standard flex flex-col gap-4 p-8">
              <div className="flex items-center gap-2 text-[var(--text-primary)]">
                <Info className="w-4 h-4 text-[var(--color-primary)]" />
                <h4 className="text-sm font-bold text-[var(--text-primary)]">About Employer Matching</h4>
              </div>
              <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed">
                Your employer matches 100% of your contributions up to 4% of your salary. This is essentially "free money" for your retirement.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-[var(--surface-card)] border-t border-[var(--border-default)] px-8 py-6 sticky bottom-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            size="custom"
            onClick={onBack}
            className="rounded-xl px-8 py-3 text-sm font-bold text-[var(--text-primary)]"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={onNext}
            className="px-8 py-3 bg-[color-mix(in_srgb,var(--color-primary)_50%,var(--text-primary))] text-[var(--primary-foreground)] rounded-xl font-bold text-sm hover:bg-[var(--color-primary-hover)]  "
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};
