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
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">Step 6 of 7</div>
          <div className="flex items-center gap-2">
            {steps.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col gap-2">
                <div className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  step.id <= 6 ? "bg-blue-600" : "bg-slate-100"
                )} />
                <span className={cn(
                  "text-[10px] font-bold text-center transition-colors",
                  step.id <= 6 ? "text-blue-600" : "text-slate-400"
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Retirement Readiness</h1>
          <p className="text-lg text-slate-500 font-medium">See how your current choices impact your future lifestyle.</p>
        </div>

        <div className="grid lg:grid-cols-[1fr_0.7fr] gap-12">
          {/* Readiness Score & Chart */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-200 shadow-sm flex flex-col gap-10">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Readiness Score</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-emerald-600">82</span>
                  <span className="text-xl font-bold text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm border border-emerald-100">
                On Track
              </div>
            </div>

            {/* Stylized Chart Placeholder */}
            <div className="h-64 bg-slate-50 rounded-2xl border border-slate-100 p-8 flex flex-col justify-end gap-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-end px-8 pb-8 gap-4">
                {[40, 55, 45, 70, 65, 85, 80, 95].map((height, i) => (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="flex-1 bg-blue-600/20 rounded-t-lg relative group"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      ${(i + 1) * 10}k
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="relative z-10 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-200/50">
                <span>Current</span>
                <span>Age 40</span>
                <span>Age 50</span>
                <span>Retirement</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Est. Monthly Income</span>
                <div className="text-2xl font-black text-slate-900">$6,450</div>
                <p className="text-xs text-slate-500 font-medium">In today's dollars</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Goal Replacement</span>
                <div className="text-2xl font-black text-slate-900">85%</div>
                <p className="text-xs text-slate-500 font-medium">Of your current income</p>
              </div>
            </div>
          </div>

          {/* AI Insights & Recommendations */}
          <div className="flex flex-col gap-8">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white flex flex-col gap-8 relative overflow-hidden">
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold">AI Recommendations</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-400">Boost Savings</span>
                      <ArrowUpRight className="w-4 h-4 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Increasing your contribution by just 2% could move your readiness score to 90.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 flex flex-col gap-2 group hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-emerald-400">Tax Optimization</span>
                      <ArrowUpRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Your current mix is good, but consider increasing Roth contributions for more tax flexibility.
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/20 rounded-full blur-[80px]" />
            </div>

            <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-900">Retirement Goal</h4>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm font-medium text-slate-500">Target Age</span>
                  <span className="text-xl font-black text-slate-900">65</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-[65%]" />
                </div>
                <p className="text-xs text-slate-400 font-medium text-center">32 years until retirement</p>
              </div>
            </div>
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
