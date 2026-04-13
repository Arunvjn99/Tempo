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
 * RetireWise marketing hero — light two-column layout + full-width primary band (reference layout).
 */
export function HeroSection({ onStartEnroll }: HeroSectionProps) {
  return (
    <section className="flex w-full flex-col bg-[var(--surface-page)]">
      {/* Upper: white page, headline + illustration */}
      <div className="mx-auto w-full max-w-6xl px-6 pb-6 pt-12 md:pb-10 md:pt-16">
        <div className="grid items-center gap-10 md:gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex min-w-0 flex-col gap-6 md:gap-8"
          >
            <h1 className={cn(typography.h1, "text-[var(--text-primary)]")}>
              Let’s build your <br />
              <span className="text-[var(--color-primary)]">future</span>, together.
            </h1>

            <p
              className={cn(
                typography.body,
                "max-w-lg font-medium leading-relaxed text-[var(--text-secondary)]",
              )}
            >
              You&apos;re one step away from activating your 401(k). We&apos;ve simplified everything so you can focus on
              what matters.
            </p>

            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button
                type="button"
                variant="custom"
                size="lg"
                onClick={onStartEnroll}
                className={cn(
                  "h-14 rounded-full border-0 px-8 text-base font-bold shadow-[var(--shadow-lg)]",
                  "bg-[var(--text-primary)] text-[var(--surface-page)]",
                  "transition-transform hover:scale-[1.02] active:scale-[0.98]",
                )}
              >
                Start Enrollment →
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className={cn(
                  "h-14 rounded-full border border-[var(--border-default)] bg-[var(--surface-page)] px-8 font-bold",
                  "text-[var(--text-primary)] shadow-sm",
                  "hover:bg-[color-mix(in_srgb,var(--color-primary)_4%,var(--surface-page))]",
                )}
              >
                Learn about the plan
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden />
              It only takes 5 minutes
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0.92, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="relative flex min-h-[280px] w-full items-center justify-center lg:min-h-[340px]"
          >
            <div className="relative aspect-[4/3] w-full max-w-lg">
              {/* Back card — bar chart peek */}
              <FloatingCard
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-4 left-0 z-0 flex h-[58%] w-[55%] flex-col gap-3 rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--surface-card)] p-4 shadow-[var(--shadow-lg)] md:bottom-6 md:left-2"
              >
                <div className="mt-auto flex h-20 items-end justify-center gap-1.5 px-1">
                  <div className="h-[45%] w-3 rounded-md bg-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))]" />
                  <div className="h-[70%] w-3 rounded-md bg-[color-mix(in_srgb,var(--color-primary)_55%,var(--border-default))]" />
                  <div className="h-full w-3 rounded-md bg-[var(--color-primary)]" />
                </div>
              </FloatingCard>

              {/* Front card — profile + growth */}
              <FloatingCard
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute right-0 top-2 z-10 flex w-[72%] flex-col gap-4 rounded-[1.75rem] border border-[var(--border-default)] bg-[var(--surface-card)] p-5 shadow-[var(--shadow-xl)] md:top-4 md:w-[68%]"
              >
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  <div className="flex flex-col gap-1.5">
                    <div className="h-2 w-24 rounded bg-[var(--border-default)]" />
                    <div className="h-1.5 w-14 rounded bg-[color-mix(in_srgb,var(--text-secondary)_40%,var(--surface-page))]" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-full rounded bg-[var(--border-default)]" />
                  <div className="h-2 w-full rounded bg-[var(--border-default)]" />
                  <div className="h-2 w-3/4 rounded bg-[var(--border-default)]" />
                </div>
                <div className="mt-1 flex items-end justify-between">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-[var(--text-secondary)]">
                      Growth
                    </div>
                    <div className="text-xl font-black text-[var(--color-primary)]">+24%</div>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[var(--color-primary)]" aria-hidden />
                </div>
              </FloatingCard>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
