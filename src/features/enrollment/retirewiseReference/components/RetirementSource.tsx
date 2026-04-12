import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Building2, 
  ArrowRightLeft, 
  TrendingUp, 
  User, 
  Bell, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementSourceProps {
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

export const RetirementSource: React.FC<RetirementSourceProps> = ({ onBack, onNext }) => {
  const [selectedSource, setSelectedSource] = useState<'pre-tax' | 'roth'>('pre-tax');

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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 3 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 3 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 3 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
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
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Select Contribution Source</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Choose how your contributions are taxed.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pre-tax Source */}
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setSelectedSource('pre-tax')}
            className={cn(
              "h-auto justify-start p-8 rounded-[32px] border-2 transition-all flex flex-col gap-6 text-left font-normal group",
              selectedSource === 'pre-tax'
                ? "bg-[var(--surface-card)] border-[var(--color-primary)]  "
                : "bg-[var(--surface-card)] border-[var(--border-default)] hover:border-[var(--border-default)]/80",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedSource === 'pre-tax' ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              )}>
                <ShieldCheck className="w-6 h-6" />
              </div>
              {selectedSource === 'pre-tax' && (
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Pre-tax</h3>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                Contributions are taken out of your paycheck before taxes are calculated.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-default)] w-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                Lower taxes today
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                Taxed when withdrawn
              </div>
            </div>
          </Button>

          {/* Roth Source */}
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setSelectedSource('roth')}
            className={cn(
              "h-auto justify-start p-8 rounded-[32px] border-2 transition-all flex flex-col gap-6 text-left font-normal group",
              selectedSource === 'roth'
                ? "bg-[var(--surface-card)] border-[var(--color-primary)]  "
                : "bg-[var(--surface-card)] border-[var(--border-default)] hover:border-[var(--border-default)]/80",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedSource === 'roth' ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              )}>
                <TrendingUp className="w-6 h-6" />
              </div>
              {selectedSource === 'roth' && (
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Roth</h3>
              <p className="text-[var(--text-secondary)] font-medium leading-relaxed">
                Contributions are taken out after taxes, allowing for tax-free growth and withdrawals.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-4 border-t border-[var(--border-default)] w-full">
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                <Zap className="w-4 h-4 text-[var(--color-primary)]" />
                Tax-free withdrawals
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
                <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                Pay taxes today
              </div>
            </div>
          </Button>
        </div>

        <div className="bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] p-8 rounded-[32px] text-[var(--primary-foreground)] flex flex-col gap-6 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-2">
            <h4 className="text-xl font-bold text-[var(--text-primary)]">Why does this matter?</h4>
            <p className="text-[var(--text-secondary)] font-medium leading-relaxed max-w-2xl">
              The source you choose affects your take-home pay today and your tax burden in retirement. Most financial advisors suggest a mix or choosing based on your current tax bracket vs. expected future bracket.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)]/20 rounded-full blur-[80px]" />
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
