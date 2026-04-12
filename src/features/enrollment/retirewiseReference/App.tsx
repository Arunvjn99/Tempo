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
    <nav className="mx-auto flex max-w-fit items-center gap-10 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-8 py-3">
      <EnrollmentNavBrand />
      
      <div className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[var(--text-secondary)]">
        <a href="#" className="text-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors">Dashboard</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Transactions</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Investment Portfolio</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Plans</a>
        <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Profile</a>
      </div>

      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={onStartEnroll}
        className="bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] px-6 py-2.5 rounded-full text-[13px] font-bold flex items-center gap-2 hover:bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]/90 transition-all"
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
      <div className="flex min-h-screen items-center justify-center bg-[var(--surface-page)] p-8">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="max-w-md w-full text-center flex flex-col gap-8"
        >
          <div className="w-24 h-24 bg-[color-mix(in_srgb,var(--color-primary)_12%,var(--surface-card))] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12 text-[var(--color-primary)]" />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">Enrollment Complete!</h1>
            <p className="text-lg text-[var(--text-secondary)] font-medium leading-relaxed">
              Congratulations! You've successfully enrolled in your retirement plan. Your future self will thank you.
            </p>
          </div>
          <Button
            type="button"
            variant="custom"
            size="custom"
            onClick={() => setView('landing')}
            className="w-full py-4 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] rounded-2xl font-bold text-base hover:bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]/90 transition-all "
          >
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--surface-page)] font-sans selection:bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] selection:text-[var(--surface-page)]">
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
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-8"
          >
            <h1 className="text-6xl md:text-7xl font-bold tracking-[-0.04em] text-[var(--text-primary)] leading-[1.05]">
              Let’s build your <br />
              <span className="text-[var(--color-primary)]">future</span>, together.
            </h1>

            <p className="text-xl text-[var(--text-secondary)] max-w-lg leading-relaxed font-medium">
              You're one step away from activating your 401(k). We've simplified everything so you can focus on what matters.
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <Button
                type="button"
                variant="custom"
                size="custom"
                onClick={() => setIsFormOpen(true)}
                className="px-10 py-4.5 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] text-[var(--surface-page)] rounded-2xl font-bold text-base flex items-center gap-2.5 hover:bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]/90 hover:scale-[1.02] active:scale-[0.98] transition-all  group"
              >
                Start my enrollment →
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="custom"
                className="px-10 py-4.5 text-[var(--text-secondary)] font-bold rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Learn about the plan
              </Button>
            </div>

            <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)]" />
              It only takes 5 minutes
            </div>
          </motion.div>

          {/* Right Side: Illustration Style */}
          <motion.div
            initial={{ x: 20 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-8 items-center lg:items-end"
          >
            <div className="relative flex aspect-[4/3] w-full max-w-md items-center justify-center overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--surface-card)]">
              {/* Stylized Illustration using Lucide and Motion */}
              <div className="relative w-full h-full flex items-center justify-center">
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-10 top-20 flex h-64 w-48 flex-col gap-3 rounded-xl border-2 border-[var(--border-default)] bg-[var(--surface-card)] p-4"
                >
                  <div className="w-8 h-8 bg-[var(--surface-section)] rounded-lg" />
                  <div className="h-2 w-full bg-[var(--surface-section)] rounded" />
                  <div className="h-2 w-2/3 bg-[var(--surface-section)] rounded" />
                  <div className="mt-auto h-24 w-full border border-[var(--border-default)] rounded-xl flex items-end p-2 gap-1">
                    <div className="h-1/2 w-full bg-[var(--surface-section)] rounded-sm" />
                    <div className="h-3/4 w-full bg-[var(--surface-section)] rounded-sm" />
                    <div className="h-full w-full bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] rounded-sm" />
                  </div>
                </motion.div>
                <motion.div 
                   animate={{ y: [0, 10, 0] }}
                   transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                   className="absolute bottom-10 right-10 flex h-72 w-56 flex-col gap-4 rounded-xl border-2 border-[var(--border-default)] bg-[var(--surface-card)] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full" />
                    <div className="flex flex-col gap-1">
                      <div className="h-2 w-20 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] rounded" />
                      <div className="h-1.5 w-12 bg-[var(--surface-section)] rounded" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="h-2 w-full bg-[var(--surface-section)] rounded" />
                    <div className="h-2 w-full bg-[var(--surface-section)] rounded" />
                    <div className="h-2 w-3/4 bg-[var(--surface-section)] rounded" />
                  </div>
                  <div className="mt-auto flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                      <div className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Growth</div>
                      <div className="text-xl font-black text-[var(--text-primary)]">+24%</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Learning Section */}
        <section className="relative z-10">
          <div className="rounded-[40px] bg-gradient-to-r from-[var(--color-primary)] to-[color-mix(in_srgb,var(--color-primary)_60%,var(--surface-card))] p-8 text-[var(--primary-foreground)] md:p-12">
            <div className="flex max-w-3xl flex-col items-start gap-8 text-left">
              <div className="flex flex-col items-start gap-6">
                <div className="inline-flex w-fit items-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-4 py-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-primary)]">
                    Step 1
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <h2 className="text-3xl font-bold tracking-tight leading-[1.1] text-[var(--primary-foreground)] md:text-4xl">
                    Learn how your <br />
                    retirement plan works
                  </h2>
                  <p className="max-w-md text-base font-medium leading-relaxed text-[var(--primary-foreground)]">
                    Understand contributions, employer match, and how your savings grow over time.
                  </p>
                </div>

                <div className="flex flex-col gap-6 pt-4 sm:flex-row">
                  {[
                    "What is a 401(k) and how it works",
                    "How much you should contribute",
                    "How employer matching impacts your savings",
                  ].map((item, i) => (
                    <div key={i} className="group/item flex items-center gap-3">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card)]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[var(--text-primary)]" />
                      </div>
                      <span className="text-sm font-semibold text-[var(--primary-foreground)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section (Bento Grid) */}
        <section className="relative z-10 grid gap-8 md:grid-cols-2">
          <motion.div
            whileHover={{ y: -8 }}
            className="group flex flex-col overflow-hidden rounded-[32px] border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] transition-all"
          >
            <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-[var(--border-default)] bg-[var(--surface-soft)]">
              <div className="relative z-10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card)]"
                >
                  <Sparkles className="h-10 w-10 text-[var(--text-primary)]" />
                </motion.div>

                {[BookOpen, Calculator, TrendingUp, ShieldCheck].map((Icon, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute flex h-full w-full items-center justify-center"
                    style={{ rotate: `${i * 90}deg` }}
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface-card)]"
                      style={{ transform: `rotate(-${i * 90}deg) translateY(-80px)` }}
                    >
                      <Icon className="h-6 w-6 text-[var(--text-secondary)]" />
                    </div>
                  </motion.div>
                ))}

                <svg className="absolute h-64 w-64 text-[var(--border-default)]" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--primary-foreground)]">How much is enough for retirement?</h3>
                <p className="text-base font-medium leading-relaxed text-[var(--text-secondary)]">
                  Finding the right contribution rate for your goals.
                </p>
              </div>
              <Button
                type="button"
                variant="custom"
                size="custom"
                className="group/btn flex w-fit items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary-foreground)]"
              >
                Know more
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -8 }}
            className="group flex flex-col overflow-hidden rounded-[32px] border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] transition-all"
          >
            <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-[var(--border-default)] bg-[var(--surface-soft)]">
              <div className="relative z-10 flex w-full flex-col items-center gap-8 px-16">
                <motion.div
                  initial={{ y: 20 }}
                  animate={{ y: 0 }}
                  className="flex h-14 w-full items-center gap-4 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-5"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_70%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-primary)_45%,var(--text-primary))]">
                    <Sparkles className="h-4 w-4 text-[var(--primary-foreground)]" />
                  </div>
                  <div className="h-2.5 w-40 rounded-full bg-[var(--surface-soft)]" />
                </motion.div>

                <div className="flex w-full max-w-[280px] flex-col gap-3">
                  {[100, 88, 76].map((widthPct, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20 }}
                      animate={{ x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="h-12 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-card)]"
                      style={{ width: `${widthPct}%`, zIndex: 10 - i }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-8">
              <div className="flex flex-col gap-2">
                <h3 className="text-2xl font-bold tracking-tight text-[var(--primary-foreground)]">Ask Core AI</h3>
                <p className="text-base font-medium leading-relaxed text-[var(--text-secondary)]">
                  Get instant answers and personalized retirement guidance.
                </p>
              </div>
              <Button
                type="button"
                variant="custom"
                size="custom"
                className="group/btn flex w-fit items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--primary-foreground)]"
              >
                Start chatting
                <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 border-t border-[var(--border-default)] px-6 py-20 md:flex-row">
        <div className="flex flex-col gap-4 items-center md:items-start">
          <div className="flex items-center gap-2.5 text-[var(--text-secondary)] grayscale">
            <div className="w-7 h-7 bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)] rounded-lg flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-[var(--surface-card)] rounded-sm rotate-45" />
            </div>
            <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">RetireWise</span>
          </div>
          <p className="text-[13px] text-[var(--text-secondary)] font-medium">© 2026 RetireWise Technologies Inc. All rights reserved.</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-10 text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.15em]">
          <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Help Center</a>
          <a href="#" className="hover:text-[var(--text-secondary)] transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
}
