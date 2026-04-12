import React from 'react';
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
  Sparkles,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementPlanSelectionProps {
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

export const RetirementPlanSelection: React.FC<RetirementPlanSelectionProps> = ({ onBack, onNext }) => {
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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 1 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id === 1 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id === 1 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
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
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Choose Your Retirement Plan</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Select the retirement plan that fits your tax strategy.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional 401(k) */}
          <div className="card-standard group relative flex flex-col gap-8 overflow-hidden p-10 transition-colors hover:border-[var(--color-primary)]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[color-mix(in_srgb,var(--text-secondary)_10%,var(--surface-card))] text-[var(--text-secondary)] border border-[var(--border-default)] w-fit">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Most Common Choice</span>
                  <HelpCircle className="w-3 h-3" />
                </div>
                <h2 className="text-3xl font-black text-[var(--text-primary)]">Traditional 401(k)</h2>
                <p className="text-[var(--text-secondary)] font-medium leading-relaxed">Lower taxes today and grow savings tax-deferred.</p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  "Lower taxable income today",
                  "Employer match eligible",
                  "Tax-deferred growth"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-auto w-full py-4 bg-[var(--color-primary)] text-[var(--primary-foreground)] rounded-2xl font-bold text-base hover:bg-[var(--color-primary-hover)]  "
            >
              Continue with Traditional 401(k) <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Roth 401(k) */}
          <div className="card-standard group flex flex-col gap-8 p-10 transition-colors hover:border-[var(--color-primary)]">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="h-[26px]" /> {/* Spacer to align with Traditional card */}
                <h2 className="text-3xl font-black text-[var(--text-primary)]">Roth 401(k)</h2>
                <p className="text-[var(--text-secondary)] font-medium leading-relaxed">Pay taxes now and withdraw tax-free in retirement.</p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  "Tax-free withdrawals in retirement",
                  "Flexible retirement income",
                  "No required minimum distributions"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_8%,var(--surface-card))] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-auto w-full py-4 border-2 border-[var(--color-primary)] text-[var(--color-primary)] rounded-2xl font-bold text-base hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))]"
            >
              Choose Roth 401(k) <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AI Helper Section */}
        <div className="card-standard flex flex-col gap-6 p-10">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Not sure which plan is right for you?</h3>
            <p className="text-[var(--text-secondary)] font-medium">Our AI assistant can help explain the differences.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="custom"
              size="custom"
              className="px-6 py-3 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] text-[var(--color-primary)] rounded-xl font-bold text-sm hover:bg-[color-mix(in_srgb,var(--color-primary)_18%,var(--surface-card))]"
            >
              <Sparkles className="w-4 h-4" /> Ask AI
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="custom"
              className="px-6 py-3 rounded-xl font-bold text-sm text-[var(--text-secondary)]"
            >
              <MessageSquare className="w-4 h-4" /> Compare Plans
            </Button>
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
