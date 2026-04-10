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

/** Step 1 gradient learning block — RetireWise reference. */
export function PreEnrollmentLearningSection() {
  return (
    <section className="relative z-10">
      <div className="bg-gradient-to-r from-[#2F6BFF] to-[#6FA8FF] rounded-[40px] p-8 md:p-12 text-white shadow-2xl shadow-blue-200/50 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_50%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl text-left flex flex-col items-start gap-8">
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
                "How employer matching impacts your savings",
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

        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-blue-400/20 rounded-full blur-[60px]" />
      </div>
    </section>
  );
}

/** Bento feature grid — RetireWise reference. */
export function PreEnrollmentBentoSection() {
  return (
    <section className="grid md:grid-cols-2 gap-8 relative z-10">
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl transition-all flex flex-col group overflow-hidden"
      >
        <div className="aspect-[16/9] relative bg-[#0d0d0d] flex items-center justify-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)]" />

          <div className="relative z-10 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-600/20 rounded-full blur-3xl absolute" />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 bg-blue-500/30 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.4)] backdrop-blur-sm"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

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

            <svg className="absolute w-64 h-64 opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 4" />
            </svg>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">How much is enough for retirement?</h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Finding the right contribution rate for your goals.
            </p>
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

      <motion.div
        whileHover={{ y: -8 }}
        className="bg-[#0a0a0a] rounded-[32px] border border-white/5 shadow-2xl transition-all flex flex-col group overflow-hidden"
      >
        <div className="aspect-[16/9] relative bg-[#0d0d0d] flex items-center justify-center overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1),transparent_70%)]" />

          <div className="relative z-10 flex flex-col items-center gap-8 w-full px-16">
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
                    zIndex: 10 - i,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-white tracking-tight">Ask Core AI</h3>
            <p className="text-slate-400 text-base leading-relaxed font-medium">
              Get instant answers and personalized retirement guidance.
            </p>
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
  );
}

export function PreEnrollmentFooter() {
  return (
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
        <a href="#" className="hover:text-slate-900 transition-colors">
          Privacy Policy
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Terms of Service
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Help Center
        </a>
        <a href="#" className="hover:text-slate-600 transition-colors">
          Status
        </a>
      </div>
    </footer>
  );
}
