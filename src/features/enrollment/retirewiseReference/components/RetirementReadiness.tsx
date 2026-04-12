import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRightLeft,
  ArrowUpRight,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Sparkles,
  Target,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementReadinessProps {
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

export const RetirementReadiness: React.FC<RetirementReadinessProps> = ({ onBack, onNext }) => {
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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 6 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 6 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 6 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
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
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Your Retirement Readiness</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">See how your current choices impact your future lifestyle.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-12">
          {/* Readiness Score & Chart */}
          <div className="card-standard flex flex-col gap-10 p-10">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">Readiness Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-[var(--color-primary)]">82</span>
                  <span className="text-xl font-bold text-[var(--text-secondary)]">/ 100</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))] text-[var(--color-primary)] font-bold text-sm border border-[color-mix(in_srgb,var(--color-primary)_18%,var(--border-default))]">
                On Track
              </div>
            </div>

            {/* Stylized Chart Placeholder */}
            <div className="card-standard relative flex h-64 flex-col justify-end gap-4 overflow-hidden p-8">
              <div className="absolute inset-0 flex items-end px-8 pb-8 gap-4">
                {[40, 55, 45, 70, 65, 85, 80, 95].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="flex-1 bg-[var(--color-primary)]/20 rounded-t-lg relative group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-full" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(i + 1) * 10}k
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="relative z-10 flex justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest pt-4 border-t border-[var(--border-default)]/50">
                <span>Current</span>
                <span>Age 40</span>
                <span>Age 50</span>
                <span>Retirement</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Est. Monthly Income</span>
                <div className="text-2xl font-black text-[var(--text-primary)]">$6,450</div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">In today's dollars</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Goal Replacement</span>
                <div className="text-2xl font-black text-[var(--text-primary)]">85%</div>
                <p className="text-xs text-[var(--text-secondary)] font-medium">Of your current income</p>
              </div>
            </div>
          </div>

          {/* AI Insights & Recommendations */}
          <div className="flex flex-col gap-8">
            <div className="bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] rounded-[32px] p-8 text-[var(--primary-foreground)] flex flex-col gap-8 relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)]">
                    <Sparkles className="w-5 h-5 text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-primary)]">AI Recommendations</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-[var(--surface-card)]/5 rounded-2xl border border-[color-mix(in_srgb,var(--border-default)_40%,transparent)] flex flex-col gap-2 group hover:bg-[var(--surface-card)]/10 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]">Boost Savings</span>
                      <ArrowUpRight className="w-4 h-4 text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Increasing your contribution by just 2% could move your readiness score to 90.
                    </p>
                  </div>

                  <div className="p-4 bg-[var(--surface-card)]/5 rounded-2xl border border-[color-mix(in_srgb,var(--border-default)_40%,transparent)] flex flex-col gap-2 group hover:bg-[var(--surface-card)]/10 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-[color-mix(in_srgb,var(--color-primary)_55%,var(--text-secondary))]">Tax Optimization</span>
                      <ArrowUpRight className="w-4 h-4 text-[color-mix(in_srgb,var(--color-primary)_55%,var(--text-secondary))] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Your current mix is good, but consider increasing Roth contributions for more tax flexibility.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)]/20 rounded-full blur-[80px]" />
            </div>

            <div className="card-standard flex flex-col gap-6 p-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] flex items-center justify-center">
                  <Target className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <h4 className="font-bold text-[var(--text-primary)]">Retirement Goal</h4>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-[var(--text-secondary)]">Target Age</span>
                  <span className="text-xl font-black text-[var(--text-primary)]">65</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-section)]">
                  <div className="h-full bg-[var(--color-primary)] w-[65%]" />
                </div>
                <p className="text-xs text-[var(--text-secondary)] font-medium text-center">32 years until retirement</p>
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
