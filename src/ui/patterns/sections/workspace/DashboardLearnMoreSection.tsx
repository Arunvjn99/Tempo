import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { FadeIn } from "@/ui/animations";
import { motionTransition } from "@/ui/animations/motionTokens";
import { cn } from "@/core/lib/utils";

export function DashboardLearnMoreSection() {
  return (
    <FadeIn duration="normal" ease="smooth">
      <motion.section
        id="learn-more"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={motionTransition({ duration: "normal", ease: "smooth" })}
        className={cn(
          "relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-lg shadow-primary/[0.06] backdrop-blur-sm",
          "sm:flex-row sm:items-stretch sm:gap-8 sm:p-8",
        )}
        aria-labelledby="dashboard-learning-title"
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-56 rounded-full bg-primary/[0.08] blur-3xl"
          aria-hidden
        />
        <div className="relative flex w-full shrink-0 flex-col justify-center sm:w-[40%]">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Learning
          </span>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border/60 bg-muted/40">
            <BookOpen className="h-16 w-16 text-primary/35" aria-hidden />
          </div>
        </div>
        <div className="relative flex min-w-0 flex-1 flex-col justify-center gap-2 sm:gap-3">
          <h2
            id="dashboard-learning-title"
            className="text-balance text-lg font-semibold leading-snug tracking-tight text-foreground sm:text-xl"
          >
            How much is enough for retirement?
          </h2>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
            Finding the right contribution rate for your goals starts with a few simple steps in enrollment.
          </p>
          <Link
            to="/enrollment"
            className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5"
          >
            Start enrollment
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </motion.section>
    </FadeIn>
  );
}
