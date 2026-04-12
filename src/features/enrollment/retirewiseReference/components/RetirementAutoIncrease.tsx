import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRightLeft,
  ArrowUpCircle,
  Bell,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementAutoIncreaseProps {
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

export const RetirementAutoIncrease: React.FC<RetirementAutoIncreaseProps> = ({ onBack, onNext }) => {
  const [enabled, setEnabled] = useState(true);
  const [increaseAmount, setIncreaseAmount] = useState(1);
  const [maxAmount, setMaxAmount] = useState(15);

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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 4 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 4 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 4 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
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
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Set It and Forget It</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Automatically increase your savings to reach your goals faster.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.8fr] gap-12">
          {/* Auto Increase Controls */}
          <div className="card-standard flex flex-col gap-10 p-10">
            <div className="card-standard flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  enabled ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-section)] text-[var(--text-secondary)]"
                )}>
                  <ArrowUpCircle className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-[var(--text-primary)]">Auto Increase Savings</h3>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">Recommended for long-term growth</p>
                </div>
              </div>
              <Button
                type="button"
                variant="custom"
                size="custom"
                onClick={() => setEnabled(!enabled)}
                className={cn(
                  "w-14 h-8 rounded-full p-1 transition-all",
                  enabled ? "bg-[var(--color-primary)]" : "bg-[var(--surface-section)]",
                )}
                aria-pressed={enabled}
                aria-label="Toggle auto increase savings"
              >
                <motion.div
                  animate={{ x: enabled ? 24 : 0 }}
                  className="h-6 w-6 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)]"
                />
              </Button>
            </div>

            {enabled && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-10"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Annual Increase</label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        size="iconLg"
                        onClick={() => setIncreaseAmount(Math.max(1, increaseAmount - 1))}
                        className="rounded-xl font-bold text-[var(--text-secondary)]"
                        aria-label="Decrease annual increase"
                      >
                        -
                      </Button>
                      <div className="text-3xl font-black text-[var(--text-primary)] w-12 text-center">{increaseAmount}%</div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="iconLg"
                        onClick={() => setIncreaseAmount(Math.min(5, increaseAmount + 1))}
                        className="rounded-xl font-bold text-[var(--text-secondary)]"
                        aria-label="Increase annual increase"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <label className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Stop Increasing At</label>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="secondary"
                        size="iconLg"
                        onClick={() => setMaxAmount(Math.max(1, maxAmount - 1))}
                        className="rounded-xl font-bold text-[var(--text-secondary)]"
                        aria-label="Decrease max amount"
                      >
                        -
                      </Button>
                      <div className="text-3xl font-black text-[var(--text-primary)] w-12 text-center">{maxAmount}%</div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="iconLg"
                        onClick={() => setMaxAmount(Math.min(25, maxAmount + 1))}
                        className="rounded-xl font-bold text-[var(--text-secondary)]"
                        aria-label="Increase max amount"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Effective Date</label>
                  <div className="flex items-center gap-3 p-4 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl">
                    <Calendar className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="text-sm font-bold text-[var(--text-primary)]">January 1st, Annually</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Why Auto Increase? */}
          <div className="flex flex-col gap-6">
            <div className="bg-[var(--color-primary)] rounded-[32px] p-8 text-[var(--primary-foreground)] flex flex-col gap-6 relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)]">
                  <Sparkles className="w-5 h-5 text-[var(--primary-foreground)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">The Power of Small Steps</h3>
                <p className="text-[color-mix(in_srgb,var(--primary-foreground)_80%,transparent)] text-sm font-medium leading-relaxed">
                  Increasing your contribution by just 1% each year can lead to hundreds of thousands of dollars more in retirement savings, often without you even noticing the difference in your paycheck.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--surface-card)]/10 rounded-full blur-[40px]" />
            </div>

            <div className="card-standard flex flex-col gap-6 p-8">
              <h4 className="font-bold text-[var(--text-primary)]">Projected Impact</h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Starting Rate</span>
                  <span className="text-sm font-bold text-[var(--text-primary)]">6%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Rate in 5 Years</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">{enabled ? 6 + (increaseAmount * 5) : 6}%</span>
                </div>
                <div className="h-px bg-[var(--border-default)]" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--text-primary)]">Long-term Growth</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">Significant Increase</span>
                </div>
              </div>
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
