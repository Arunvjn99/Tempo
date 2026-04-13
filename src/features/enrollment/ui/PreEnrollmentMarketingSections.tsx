import { motion } from "motion/react";
import { Button } from "@/ui/components/Button";
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";

/** Step 1 gradient learning block — left column + open right, horizontal feature row (reference layout). */
export function PreEnrollmentLearningSection() {
  const bullets = [
    "What is a 401(k) and how it works",
    "How much you should contribute",
    "How employer matching impacts your savings",
  ];

  return (
    <section className="relative z-10 w-full">
      <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(90deg,var(--color-primary)_0%,color-mix(in_srgb,var(--color-primary)_68%,#7dd3fc)_100%)] p-8 text-[var(--primary-foreground)] shadow-[var(--shadow-lg)] md:rounded-[28px] md:p-10 lg:rounded-[32px] lg:p-12">
        <div className="relative z-10 flex w-full flex-col gap-8 md:gap-10 lg:max-w-[58%] lg:pr-8">
          <span className="inline-flex w-fit items-center rounded-full bg-[color-mix(in_srgb,var(--surface-page)_22%,transparent)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--primary-foreground)] backdrop-blur-[2px]">
            Step 1
          </span>

          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight text-[var(--primary-foreground)] md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Learn how your retirement plan works
            </h2>
            <p className="max-w-xl text-base font-normal leading-relaxed text-[color-mix(in_srgb,var(--primary-foreground)_88%,transparent)] md:text-[17px]">
              Understand contributions, employer match, and how your savings grow over time.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 border-t border-[color-mix(in_srgb,var(--primary-foreground)_18%,transparent)] pt-6 sm:grid-cols-3 sm:gap-6 md:gap-8">
            {bullets.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--primary-foreground)_55%,transparent)] bg-[color-mix(in_srgb,var(--surface-page)_12%,transparent)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--primary-foreground)]" />
                </div>
                <span className="text-left text-[13px] font-medium leading-snug text-[var(--primary-foreground)] sm:text-sm">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Bento feature grid — RetireWise reference. */
export function PreEnrollmentBentoSection() {
  return (
    <section className="relative z-10 grid gap-8 md:grid-cols-2">
      <motion.div
        whileHover={{ y: -8 }}
        className="group flex flex-col overflow-hidden rounded-[32px] border border-[var(--border-default)] bg-[var(--surface-section)] transition-all"
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

            <svg
              className="absolute h-64 w-64 text-[var(--border-default)]"
              viewBox="0 0 100 100"
            >
              <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 4" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">How much is enough for retirement?</h3>
            <p className="text-base font-medium leading-relaxed text-[var(--text-secondary)]">
              Finding the right contribution rate for your goals.
            </p>
          </div>
          <Button
            type="button"
            variant="custom"
            size="custom"
            className="group/btn flex w-fit items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Know more
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </motion.div>

      <motion.div
        whileHover={{ y: -8 }}
        className="group flex flex-col overflow-hidden rounded-[32px] border border-[var(--border-default)] bg-[var(--surface-section)] transition-all"
      >
        <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden border-b border-[var(--border-default)] bg-[var(--surface-soft)]">
          <div className="relative z-10 flex w-full flex-col items-center gap-8 px-16">
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="flex h-14 w-full items-center gap-4 rounded-full border border-[var(--border-default)] bg-[var(--surface-card)] px-5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-primary)_85%,var(--surface-card))]">
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
            <h3 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">Ask Core AI</h3>
            <p className="text-base font-medium leading-relaxed text-[var(--text-secondary)]">
              Get instant answers and personalized retirement guidance.
            </p>
          </div>
          <Button
            type="button"
            variant="custom"
            size="custom"
            className="group/btn flex w-fit items-center gap-2 text-sm font-bold text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            Start chatting
            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

export function PreEnrollmentFooter() {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 border-t border-[var(--border-default)] bg-[var(--surface-section)] px-6 py-20 md:flex-row">
      <div className="flex flex-col gap-4 items-center md:items-start">
        <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]">
            <div className="h-3.5 w-3.5 rotate-45 rounded-sm bg-[var(--surface-page)]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-[var(--text-primary)]">RetireWise</span>
        </div>
        <p className="text-[13px] font-medium text-[var(--text-secondary)]">
          © 2026 RetireWise Technologies Inc. All rights reserved.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)]">
        <a href="#" className="transition-colors hover:text-[var(--text-primary)]">
          Privacy Policy
        </a>
        <a href="#" className="transition-colors hover:text-[var(--text-primary)]">
          Terms of Service
        </a>
        <a href="#" className="transition-colors hover:text-[var(--text-primary)]">
          Help Center
        </a>
        <a href="#" className="transition-colors hover:text-[var(--text-primary)]">
          Status
        </a>
      </div>
    </footer>
  );
}
