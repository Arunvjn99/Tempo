import { motion } from "motion/react";
import { CheckCircle2, TrendingUp } from "lucide-react";
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
          You&apos;re one step away from activating your 401(k). We&apos;ve simplified everything so you can focus on
          what matters.
        </p>

        <div className="flex flex-wrap items-center gap-5 pt-2">
          <Button
            type="button"
            variant="custom"
            size="lg"
            onClick={onStartEnroll}
            className="rounded-2xl border-0 bg-slate-900 px-10 text-base font-bold text-white shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] hover:bg-slate-800 active:scale-[0.98] group"
          >
            Start my enrollment →
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="rounded-2xl border-slate-200 px-10 font-bold text-slate-600 hover:scale-[1.02] active:scale-[0.98]"
          >
            Learn about the plan
          </Button>
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-400 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          It only takes 5 minutes
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col gap-8 items-center lg:items-end"
      >
        <div className="relative w-full max-w-md aspect-[4/3] bg-white rounded-3xl overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <FloatingCard
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
            </FloatingCard>
            <FloatingCard
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
            </FloatingCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
