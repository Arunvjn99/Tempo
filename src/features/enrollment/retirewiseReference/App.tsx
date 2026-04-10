/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { EnrollmentForm } from './components/EnrollmentForm';
import { RetirementPlanSelection } from './components/RetirementPlanSelection';
import { RetirementContribution } from './components/RetirementContribution';
import { RetirementSource } from './components/RetirementSource';
import { RetirementAutoIncrease } from './components/RetirementAutoIncrease';
import { RetirementInvestment } from './components/RetirementInvestment';
import { RetirementReadiness } from './components/RetirementReadiness';
import { RetirementReview } from './components/RetirementReview';
import { useState } from 'react';
import { Button } from "@/ui/components/Button";
import { EnrollmentNavBrand } from "@/features/enrollment/ui/EnrollmentNavBrand";

const Navbar = ({ onStartEnroll }: { onStartEnroll: () => void }) => (
  <div className="fixed top-6 left-0 right-0 z-50 px-6">
    <nav className="max-w-fit mx-auto bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-full px-8 py-3 flex items-center gap-10 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
      <EnrollmentNavBrand />
      
      <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-slate-500">
        <a href="#" className="text-slate-900 hover:text-slate-900 transition-colors">Dashboard</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Transactions</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Investment Portfolio</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Plans</a>
        <a href="#" className="hover:text-slate-900 transition-colors">Profile</a>
      </div>

      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={onStartEnroll}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
      >
        Start Enroll <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </nav>
  </div>
);

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState<'landing' | 'plan-selection' | 'contribution' | 'source' | 'auto-increase' | 'investment' | 'readiness' | 'review' | 'success'>('landing');

  if (view === 'plan-selection') {
    return (
      <RetirementPlanSelection 
        onBack={() => setView('landing')} 
        onNext={() => setView('contribution')} 
      />
    );
  }

  if (view === 'contribution') {
    return (
      <RetirementContribution 
        onBack={() => setView('plan-selection')} 
        onNext={() => setView('source')} 
      />
    );
  }

  if (view === 'source') {
    return (
      <RetirementSource 
        onBack={() => setView('contribution')} 
        onNext={() => setView('auto-increase')} 
      />
    );
  }

  if (view === 'auto-increase') {
    return (
      <RetirementAutoIncrease 
        onBack={() => setView('source')} 
        onNext={() => setView('investment')} 
      />
    );
  }

  if (view === 'investment') {
    return (
      <RetirementInvestment 
        onBack={() => setView('auto-increase')} 
        onNext={() => setView('readiness')} 
      />
    );
  }

  if (view === 'readiness') {
    return (
      <RetirementReadiness 
        onBack={() => setView('investment')} 
        onNext={() => setView('review')} 
      />
    );
  }

  if (view === 'review') {
    return (
      <RetirementReview 
        onBack={() => setView('readiness')} 
        onComplete={() => setView('success')} 
      />
    );
  }

  if (view === 'success') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center flex flex-col gap-8"
        >
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Enrollment Complete!</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed">
              Congratulations! You've successfully enrolled in your retirement plan. Your future self will thank you.
            </p>
          </div>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setView('landing')}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-slate-900 selection:text-white relative overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-white -z-20" />
      
      {/* Soft Blue Glow from Bottom - Elliptical Gradient */}
      <div className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[140%] h-[50%] bg-[radial-gradient(ellipse_at_center,#DCE8FF_0%,#EAF2FF_50%,transparent_100%)] opacity-50 blur-[120px] -z-10" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_20%,transparent_100%)] opacity-20 -z-10" />

      <Navbar onStartEnroll={() => setIsFormOpen(true)} />

      <EnrollmentForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onComplete={() => setView('plan-selection')}
      />

      <main className="max-w-6xl mx-auto px-6 pt-48 pb-20 flex flex-col gap-32">
        
        {/* Hero Section */}
        <section className="grid lg:grid-cols-[1.1fr_1fr] gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.04em] text-slate-900 leading-[1.05]">
              Let’s build your <br />
              <span className="text-blue-600">future</span>, together.
            </h1>

            <p className="text-xl text-slate-500 max-w-lg leading-relaxed font-medium">
              You're one step away from activating your 401(k). We've simplified everything so you can focus on what matters.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button
                type="button"
                variant="custom"
                size="custom"
                onClick={() => setIsFormOpen(true)}
                className="px-10 py-4.5 bg-slate-900 text-white rounded-2xl font-bold text-base flex items-center gap-2.5 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-200 group"
              >
                Start my enrollment →
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="custom"
                className="px-10 py-4.5 text-slate-600 font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Learn about the plan
              </Button>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              It only takes 5 minutes
            </div>
          </motion.div>

          {/* Right Side: Illustration Style */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-8 items-center lg:items-end"
          >
            <div className="relative w-full max-w-md aspect-[4/3] bg-white rounded-3xl overflow-hidden flex items-center justify-center">
              {/* Stylized Illustration using Lucide and Motion */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-10 top-20 w-48 h-64 border-2 border-slate-900 rounded-2xl bg-white flex flex-col p-4 gap-3"
                >
                  <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                  <div className="h-2 w-full bg-slate-100 rounded" />
                  <div className="h-2 w-2/3 bg-slate-100 rounded" />
                  <div className="mt-auto h-24 w-full border border-slate-100 rounded-xl flex items-end p-2 gap-1">
                    <div className="h-1/2 w-full bg-slate-100 rounded-sm" />
                    <div className="h-3/4 w-full bg-slate-100 rounded-sm" />
                    <div className="h-full w-full bg-slate-900 rounded-sm" />
                  </div>
                </motion.div>
                <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute right-10 bottom-10 w-56 h-72 border-2 border-slate-900 rounded-2xl bg-white flex flex-col p-6 gap-4 shadow-2xl shadow-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <div className="h-2 w-20 bg-slate-900 rounded" />
                      <div className="h-1.5 w-12 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-3/4 bg-slate-100 rounded" />
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Growth</div>
                      <div className="text-xl font-black text-slate-900">+24%</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Learning Section */}
        <section className="relative z-10">
          <div className="bg-gradient-to-r from-[#2F6BFF] to-[#6FA8FF] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl text-left flex flex-col items-start gap-8">
              {/* Content */}
              <div className="flex flex-col gap-6 items-start">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 w-fit">
                  <span className="text-[11px] font-bold text-white uppercase tracking-[0.15em]">Step 1</span>
                </div>
                
                <div className="flex flex-col gap-3">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-[1.1]">
                    Learn how your <br />
                    retirement plan works
                  </h2>
                  <p className="text-base text-blue-50/80 max-w-md font-medium leading-relaxed">
                    Understand contributions, employer match, and how your savings grow over time.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  {[
                    "What is a 401(k) and how it works",
                    "How much you should contribute",
                    "How employer matching impacts your savings"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group/item">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover/item:bg-white/30 transition-colors shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative Glows */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-400/20 rounded-full blur-[60px]" />
          </div>
        </section>

        {/* Features Section (Bento Grid) */}
        <section className="grid md:grid-cols-2 gap-8 relative z-10">
          {/* Card 1: Retirement Insights */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl transition-all flex flex-col group overflow-hidden"
          >
            <div className="aspect-[16/9] relative bg-[#0d0d0d] flex items-center justify-center overflow-hidden border-b border-white/5">
              {/* Background Grid & Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />
              
              {/* Illustration: Integrations Style */}
              <div className="relative z-10 flex items-center justify-center">
                {/* Central Glow */}
                <div className="w-32 h-32 bg-blue-600/20 rounded-full blur-3xl absolute" />
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.4)] backdrop-blur-sm"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                
                {/* Orbiting Icons */}
                {[BookOpen, Calculator, TrendingUp, ShieldCheck].map((Icon, i) => (
                  <motion.div 
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full flex items-center justify-center"
                    style={{ rotate: `${i * 90}deg` }}
                  >
                    <div 
                      className="w-12 h-12 bg-white/5 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md shadow-xl"
                      style={{ transform: `rotate(-${i * 90}deg) translateY(-80px)` }}
                    >
                      <Icon className="w-6 h-6 text-slate-400" />
                    </div>
                  </motion.div>
                ))}

                {/* Arcs */}
                <svg className="absolute w-64 h-64 opacity-20" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
                </svg>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">How much is enough for retirement?</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">Finding the right contribution rate for your goals.</p>
              </div>
              <Button
                type="button"
                variant="custom"
                size="custom"
                className="flex items-center gap-2 text-white/60 hover:text-white font-bold text-sm transition-colors group/btn w-fit"
              >
                Know more
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>

          {/* Card 2: Ask Core AI */}
          <motion.div 
            whileHover={{ y: -8 }}
            className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl transition-all flex flex-col group overflow-hidden"
          >
            <div className="aspect-[16/9] relative bg-[#0d0d0d] flex items-center justify-center overflow-hidden border-b border-white/5">
              {/* Background Grid & Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
              
              {/* Illustration: AI Conversations Style */}
              <div className="relative z-10 flex flex-col items-center gap-8 w-full px-16">
                {/* Search Bar */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="w-full h-14 bg-white/5 rounded-full border border-white/10 flex items-center px-5 gap-4 backdrop-blur-xl shadow-2xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="h-2.5 w-40 bg-white/20 rounded-full" />
                </motion.div>

                {/* Stacked Response Layers */}
                <div className="flex flex-col gap-3 w-full max-w-[280px]">
                  {[1, 0.6, 0.3].map((opacity, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity }}
                      transition={{ delay: i * 0.1 }}
                      className="h-12 bg-white/5 rounded-2xl border border-white/10 w-full backdrop-blur-sm"
                      style={{ 
                        transform: `scale(${1 - i * 0.05}) translateY(${i * 4}px)`,
                        zIndex: 10 - i
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold text-white tracking-tight">Ask Core AI</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium">Get instant answers and personalized retirement guidance.</p>
              </div>
              <Button
                type="button"
                variant="custom"
                size="custom"
                className="flex items-center gap-2 text-white/60 hover:text-white font-bold text-sm transition-colors group/btn w-fit"
              >
                Start chatting
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-10">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="flex items-center gap-2.5 opacity-40 grayscale">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-white rounded-sm rotate-45" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">RetireWise</span>
          </div>
          <p className="text-[13px] text-slate-400 font-medium">© 2026 RetireWise Technologies Inc. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em]">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Help Center</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
