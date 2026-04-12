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
  Target,
  Settings2,
  Briefcase,
  Sparkles,
  Info
} from 'lucide-react';
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementInvestmentProps {
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

export const RetirementInvestment: React.FC<RetirementInvestmentProps> = ({ onBack, onNext }) => {
  const [selectedStrategy, setSelectedStrategy] = useState<'target-date' | 'custom' | 'managed'>('target-date');

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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 5 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 5 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 5 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
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
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Choose Your Investment Strategy</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Select how you want your savings to be invested.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Target Date Fund */}
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setSelectedStrategy('target-date')}
            className={cn(
              "h-auto justify-start p-8 rounded-[32px] border-2 transition-all flex flex-col gap-6 text-left font-normal relative",
              selectedStrategy === 'target-date'
                ? "bg-[var(--surface-card)] border-[var(--color-primary)]  "
                : "bg-[var(--surface-card)] border-[var(--border-default)] hover:border-[var(--border-default)]/80",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'target-date' ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              )}>
                <Target className="w-6 h-6" />
              </div>
              {selectedStrategy === 'target-date' && (
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider w-fit">Recommended</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Target Date Fund</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                A diversified portfolio that automatically adjusts as you get closer to retirement.
              </p>
            </div>
          </Button>

          {/* Custom Portfolio */}
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setSelectedStrategy('custom')}
            className={cn(
              "h-auto justify-start p-8 rounded-[32px] border-2 transition-all flex flex-col gap-6 text-left font-normal relative",
              selectedStrategy === 'custom'
                ? "bg-[var(--surface-card)] border-[var(--color-primary)]  "
                : "bg-[var(--surface-card)] border-[var(--border-default)] hover:border-[var(--border-default)]/80",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'custom' ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              )}>
                <Settings2 className="w-6 h-6" />
              </div>
              {selectedStrategy === 'custom' && (
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-[21px]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Custom Portfolio</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Choose your own mix of individual funds from our curated list of options.
              </p>
            </div>
          </Button>

          {/* Managed Account */}
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setSelectedStrategy('managed')}
            className={cn(
              "h-auto justify-start p-8 rounded-[32px] border-2 transition-all flex flex-col gap-6 text-left font-normal relative",
              selectedStrategy === 'managed'
                ? "bg-[var(--surface-card)] border-[var(--color-primary)]  "
                : "bg-[var(--surface-card)] border-[var(--border-default)] hover:border-[var(--border-default)]/80",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'managed' ? "bg-[var(--color-primary)] text-[var(--primary-foreground)]" : "bg-[var(--surface-card)] border border-[var(--border-default)] text-[var(--text-secondary)]"
              )}>
                <Briefcase className="w-6 h-6" />
              </div>
              {selectedStrategy === 'managed' && (
                <div className="w-6 h-6 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-foreground)]" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-[21px]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Managed Account</h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                Get a personalized portfolio managed by professional investment advisors.
              </p>
            </div>
          </Button>
        </div>

        {selectedStrategy === 'target-date' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-standard flex flex-col gap-8 p-10"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-[var(--text-primary)]">Your Recommended Fund</h3>
              <p className="text-[var(--text-secondary)] font-medium">Based on your age, we recommend the 2060 Target Date Fund.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--surface-card)] border border-[var(--border-default)] rounded-xl">
                    <span className="text-sm font-bold text-[var(--text-primary)]">Target Date Fund 2060</span>
                    <span className="text-sm font-black text-[var(--color-primary)]">TDF60</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-[var(--text-secondary)]">
                    <Info className="w-4 h-4 text-[var(--color-primary)]" />
                    This fund will gradually become more conservative as you approach 2060.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                    <span>Asset Allocation</span>
                    <span>90% Stocks / 10% Bonds</span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded-full bg-[var(--surface-section)]">
                    <div className="h-full bg-[var(--color-primary)] w-[90%]" />
                    <div className="h-full bg-[color-mix(in_srgb,var(--color-primary)_35%,var(--surface-card))] w-[10%]" />
                  </div>
                </div>
              </div>

              <div className="bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] rounded-2xl p-8 text-[var(--primary-foreground)] flex flex-col gap-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[color-mix(in_srgb,var(--color-primary)_60%,var(--text-secondary))]">AI Insight</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-[var(--text-secondary)]">
                    "Target date funds are the most popular choice for retirement savers because they handle the complex rebalancing for you, ensuring your risk level is always appropriate for your timeline."
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-[40px]" />
              </div>
            </div>
          </motion.div>
        )}
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
