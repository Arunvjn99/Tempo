import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRightLeft,
  Bell,
  Building2,
  ChevronLeft,
  Edit2,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  User,
} from "lucide-react";
import { cn } from "@/core/lib/utils";
import { Button } from "@/ui/components/Button";

interface RetirementReviewProps {
  onBack: () => void;
  onComplete: () => void;
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

export const RetirementReview: React.FC<RetirementReviewProps> = ({ onBack, onComplete }) => {
  const [agreed, setAgreed] = useState(false);

  const summaryItems = [
    { label: 'Retirement Plan', value: 'Traditional 401(k)', step: 1 },
    { label: 'Contribution Rate', value: '6% of pre-tax income', step: 2 },
    { label: 'Contribution Source', value: 'Pre-tax', step: 3 },
    { label: 'Auto Increase', value: 'Enabled (1% annually)', step: 4 },
    { label: 'Investment Strategy', value: 'Target Date Fund 2060', step: 5 },
  ];

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
          <div className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">Step 7 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 7 ? "bg-[var(--color-primary)]" : "bg-[var(--surface-card)] border border-[var(--border-default)]"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 7 ? "text-[var(--color-primary)]" : "text-[var(--text-secondary)]"
                )}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-8 py-16 flex flex-col gap-12">
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Review & Confirm</h1>
          <p className="text-lg text-[var(--text-secondary)] font-medium">Please review your choices before submitting your enrollment.</p>
        </div>

        <div className="flex flex-col gap-6">
          {summaryItems.map((item) => (
            <div key={item.label} className="card-standard flex items-center justify-between p-6 transition-all group hover:border-[color-mix(in_srgb,var(--color-primary)_25%,var(--border-default))]">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">Step {item.step}</span>
                <span className="text-sm font-bold text-[var(--text-secondary)]">{item.label}</span>
                <span className="text-lg font-bold text-[var(--text-primary)]">{item.value}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="custom"
                className="h-auto p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-card)] hover:text-[var(--color-primary)]"
                aria-label={`Edit ${item.label}`}
              >
                <Edit2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-[32px] p-8 border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))] flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-[var(--color-primary)]" />
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Legal Agreements</h3>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="pt-1">
                  <input 
                    type="checkbox" 
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-[var(--border-default)] text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                  />
                </div>
                <span className="text-sm font-medium text-[var(--text-secondary)] leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                  I have read and agree to the <a href="#" className="text-[var(--color-primary)] font-bold hover:underline">Plan Document</a>, <a href="#" className="text-[var(--color-primary)] font-bold hover:underline">Summary Plan Description</a>, and the <a href="#" className="text-[var(--color-primary)] font-bold hover:underline">Investment Disclosures</a>. I understand that my contributions will begin on the next available pay period.
                </span>
              </label>
            </div>
          </div>

          <div className="p-6 bg-[color-mix(in_srgb,var(--text-secondary)_12%,var(--surface-card))] rounded-2xl border border-[var(--border-default)] flex items-start gap-4">
            <AlertCircle className="w-5 h-5 text-[var(--text-secondary)] shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
              Once submitted, your enrollment will be processed. You can make changes to your contribution rate and investment strategy at any time through your dashboard.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-[var(--surface-card)] border-t border-[var(--border-default)] px-8 py-6 sticky bottom-0 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
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
            onClick={onComplete}
            disabled={!agreed}
            className={cn(
              "px-10 py-4 rounded-xl font-bold text-base ",
              agreed
                ? "bg-[var(--color-primary)] text-[var(--primary-foreground)] hover:bg-[var(--color-primary-hover)] "
                : "cursor-not-allowed bg-[var(--surface-section)] text-[var(--text-secondary)] ",
            )}
          >
            <ShieldCheck className="w-5 h-5" /> Submit Enrollment
          </Button>
        </div>
      </footer>
    </div>
  );
};
