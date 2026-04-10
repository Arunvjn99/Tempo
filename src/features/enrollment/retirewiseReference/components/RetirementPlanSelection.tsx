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
    <div className="min-h-screen bg-slate-50/50 font-sans selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">RetireWell</span>
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
                  item.active ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.active && (
                  <motion.div 
                    layoutId="navUnderline"
                    className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-blue-600"
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
            className="relative rounded-full bg-slate-50 text-slate-400 hover:text-slate-900"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </Button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm border-2 border-white shadow-sm">
            JD
          </div>
        </div>
      </header>

      {/* Progress Sub-header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col gap-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Step 1 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id === 1 ? "bg-blue-600" : "bg-slate-100"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id === 1 ? "text-blue-600" : "text-slate-400"
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Choose Your Retirement Plan</h1>
          <p className="text-lg text-slate-500 font-medium">Select the retirement plan that fits your tax strategy.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Traditional 401(k) */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm flex flex-col gap-8 relative overflow-hidden group hover:border-blue-500 transition-colors">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100 w-fit">
                  <span className="text-[10px] font-bold uppercase tracking-wider">Most Common Choice</span>
                  <HelpCircle className="w-3 h-3" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Traditional 401(k)</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Lower taxes today and grow savings tax-deferred.</p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  "Lower taxable income today",
                  "Employer match eligible",
                  "Tax-deferred growth"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-auto w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 shadow-lg shadow-blue-100"
            >
              Continue with Traditional 401(k) <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Roth 401(k) */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm flex flex-col gap-8 group hover:border-blue-500 transition-colors">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <div className="h-[26px]" /> {/* Spacer to align with Traditional card */}
                <h2 className="text-3xl font-black text-slate-900">Roth 401(k)</h2>
                <p className="text-slate-500 font-medium leading-relaxed">Pay taxes now and withdraw tax-free in retirement.</p>
              </div>

              <div className="flex flex-col gap-4">
                {[
                  "Tax-free withdrawals in retirement",
                  "Flexible retirement income",
                  "No required minimum distributions"
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="custom"
              size="custom"
              className="mt-auto w-full py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-bold text-base hover:bg-blue-50"
            >
              Choose Roth 401(k) <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* AI Helper Section */}
        <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-bold text-slate-900">Not sure which plan is right for you?</h3>
            <p className="text-slate-500 font-medium">Our AI assistant can help explain the differences.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="custom"
              size="custom"
              className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm hover:bg-blue-100"
            >
              <Sparkles className="w-4 h-4" /> Ask AI
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="custom"
              className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600"
            >
              <MessageSquare className="w-4 h-4" /> Compare Plans
            </Button>
          </div>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="bg-white border-t border-slate-200 px-8 py-6 sticky bottom-0 z-50">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Button
            type="button"
            variant="secondary"
            size="custom"
            onClick={onBack}
            className="px-8 py-3 rounded-xl font-bold text-sm"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={onNext}
            className="px-8 py-3 bg-blue-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-200"
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
};
