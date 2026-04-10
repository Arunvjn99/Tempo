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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Step 5 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 5 ? "bg-blue-600" : "bg-slate-100"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 5 ? "text-blue-600" : "text-slate-400"
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Choose Your Investment Strategy</h1>
          <p className="text-lg text-slate-500 font-medium">Select how you want your savings to be invested.</p>
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
                ? "bg-white border-blue-600 shadow-xl shadow-blue-100"
                : "bg-white border-slate-200 hover:border-slate-300",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'target-date' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              )}>
                <Target className="w-6 h-6" />
              </div>
              {selectedStrategy === 'target-date' && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider w-fit">Recommended</div>
              <h3 className="text-xl font-bold text-slate-900">Target Date Fund</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
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
                ? "bg-white border-blue-600 shadow-xl shadow-blue-100"
                : "bg-white border-slate-200 hover:border-slate-300",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'custom' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              )}>
                <Settings2 className="w-6 h-6" />
              </div>
              {selectedStrategy === 'custom' && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-[21px]" />
              <h3 className="text-xl font-bold text-slate-900">Custom Portfolio</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
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
                ? "bg-white border-blue-600 shadow-xl shadow-blue-100"
                : "bg-white border-slate-200 hover:border-slate-300",
            )}
          >
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                selectedStrategy === 'managed' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
              )}>
                <Briefcase className="w-6 h-6" />
              </div>
              {selectedStrategy === 'managed' && (
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="h-[21px]" />
              <h3 className="text-xl font-bold text-slate-900">Managed Account</h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Get a personalized portfolio managed by professional investment advisors.
              </p>
            </div>
          </Button>
        </div>

        {selectedStrategy === 'target-date' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-bold text-slate-900">Your Recommended Fund</h3>
              <p className="text-slate-500 font-medium">Based on your age, we recommend the 2060 Target Date Fund.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-700">Target Date Fund 2060</span>
                    <span className="text-sm font-black text-blue-600">TDF60</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                    <Info className="w-4 h-4 text-blue-600" />
                    This fund will gradually become more conservative as you approach 2060.
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Asset Allocation</span>
                    <span>90% Stocks / 10% Bonds</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-blue-600 w-[90%]" />
                    <div className="h-full bg-blue-300 w-[10%]" />
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col gap-4 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">AI Insight</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-slate-300">
                    "Target date funds are the most popular choice for retirement savers because they handle the complex rebalancing for you, ensuring your risk level is always appropriate for your timeline."
                  </p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-[40px]" />
              </div>
            </div>
          </motion.div>
        )}
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
