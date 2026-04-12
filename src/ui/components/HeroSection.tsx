import { motion } from "motion/react";
import { CheckCircle2, TrendingUp } from "lucide-react";
import { cn } from "@/core/lib/utils";
import { typography } from "@/ui/tokens/typography";
import { Button } from "./Button";
import { FloatingCard } from "./FloatingCard";

export type HeroSectionProps = {
  onStartEnroll: () => void;
};

/**
 * RetireWise marketing hero — pixel-matched to AI Studio reference (landing column + illustration).
 */
export function HeroSection({ onStartEnroll }: HeroSectionProps) {
  return (
    <section className="grid items-center gap-12 rounded-2xl bg-[var(--surface-elevated)] px-6 py-10 opacity-100 text-[var(--color-text-inverse)] shadow-[var(--shadow-gradient-block)] md:gap-16 md:px-10 md:py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-12">
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 opacity-100 text-[var(--color-text-inverse)]"
      >
        <h1 className={cn(typography.h1, "text-[var(--color-text-inverse)]")}>
          Let’s build your <br />
          <span className="text-brand">future</span>, together.
        </h1>

        <p className={cn(typography.body, "max-w-lg font-medium text-[var(--color-text-inverse)] opacity-100")}>
          You&apos;re one step away from activating your 401(k). We&apos;ve simplified everything so you can focus on
          what matters.
        </p>

        <div className="flex flex-wrap items-center gap-5 pt-2">
          <Button
            type="button"
            variant="custom"
            size="lg"
            onClick={onStartEnroll}
            className="group rounded-2xl border-0 bg-[var(--surface-card)] px-10 text-base font-bold text-brand opacity-100 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-[var(--text-primary)]"
          >
            Start Enrollment →
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="rounded-2xl border border-[var(--border-default)] bg-transparent px-10 font-bold text-[var(--color-text-inverse)] opacity-100 hover:scale-[1.02] active:scale-[0.98]"
          >
            Learn about the plan
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold text-[var(--color-text-inverse)] opacity-100">
          <CheckCircle2 className="h-4 w-4 text-success" />
          It only takes 5 minutes
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 20 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center gap-8 opacity-100 lg:items-end"
      >
        <div className="relative flex aspect-[4/3] w-full max-w-md items-center justify-center overflow-hidden rounded-3xl border border-[var(--border-default)] bg-[color-mix(in_srgb,var(--surface-card)_88%,var(--color-primary))] opacity-100">
          <div className="relative w-full h-full flex items-center justify-center">
            <FloatingCard
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-10 top-20 flex h-64 w-48 flex-col gap-3 rounded-2xl border-2 border-[var(--border-default)] bg-[var(--surface-card)] p-4 dark:bg-[var(--surface-page)]"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--border-default)]" />
              <div className="h-2 w-full rounded bg-[var(--border-default)]" />
              <div className="h-2 w-2/3 rounded bg-[var(--border-default)]" />
              <div className="mt-auto h-24 w-full rounded-xl border border-default flex items-end gap-1 p-2">
                <div className="h-1/2 w-full rounded-sm bg-[var(--border-default)]" />
                <div className="h-3/4 w-full rounded-sm bg-[var(--border-default)]" />
                <div className="h-full w-full rounded-sm bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]" />
              </div>
            </FloatingCard>
            <FloatingCard
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 right-10 flex h-72 w-56 flex-col gap-4 rounded-2xl border-2 border-[var(--border-default)] bg-[var(--surface-card)] p-6 shadow-2xl dark:bg-[var(--surface-page)]"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary" />
                <div className="flex flex-col gap-1">
                  <div className="h-2 w-20 rounded bg-[color-mix(in_srgb,var(--text-primary)_50%,transparent)]" />
                  <div className="h-1.5 w-12 rounded bg-border" />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <div className="h-2 w-full rounded bg-[var(--border-default)]" />
                <div className="h-2 w-full rounded bg-[var(--border-default)]" />
                <div className="h-2 w-3/4 rounded bg-[var(--border-default)]" />
              </div>
              <div className="mt-auto flex items-end justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold uppercase text-[var(--text-secondary)] opacity-100">Growth</div>
                  <div className="text-xl font-black text-primary opacity-100">+24%</div>
                </div>
                <TrendingUp className="h-8 w-8 text-brand" />
              </div>
            </FloatingCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
