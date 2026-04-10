import { motion, useReducedMotion } from "framer-motion";
import type { CoreAIStructuredPayload, SuccessCardPayload } from "@/features/ai/store/interactiveTypes";

const BURST_PARTICLES = 12;
const PARTICLE_ANGLES = Array.from({ length: BURST_PARTICLES }, (_, i) => (i / BURST_PARTICLES) * 360);
const BURST_COLORS = [
  "bg-[var(--color-success)]",
  "bg-[var(--color-success)]/80",
  "bg-[var(--color-success)]/60",
];

export interface LoanSuccessCardProps {
  payload: SuccessCardPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
  enableConfetti?: boolean;
}

export function LoanSuccessCard({ payload, onAction, enableConfetti = true }: LoanSuccessCardProps) {
  const reduced = useReducedMotion();
  const showConfetti = enableConfetti && !reduced;

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[var(--color-success)]/40 bg-gradient-to-br from-[var(--color-success)]/8 to-[var(--color-background)] p-4 shadow-lg"
    >
      {/* Optional confetti burst */}
      {showConfetti &&
        PARTICLE_ANGLES.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const distance = 48 + (i % 3) * 16;
          const x = Math.cos(rad) * distance;
          const y = Math.sin(rad) * distance;
          const size = 4 + (i % 2) * 2;
          const delay = 0.2 + i * 0.02;
          const duration = 0.5 + (i % 3) * 0.06;
          const colorClass = BURST_COLORS[i % BURST_COLORS.length];
          return (
            <motion.div
              key={i}
              className={`absolute left-1/2 top-12 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 ${colorClass}`}
              style={{ width: size, height: size }}
              initial={{ opacity: 0.9, scale: 0.2 }}
              animate={{ opacity: 0, scale: 1.2, x, y }}
              transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
              aria-hidden
            />
          );
        })}

      {/* Success icon */}
      <div className="relative flex items-start gap-4">
        <motion.div
          initial={reduced ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.05 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-semibold text-[var(--color-success)]">{payload.title}</h4>
          {payload.description && (
            <p className="mt-0.5 text-sm text-[var(--color-text)]">{payload.description}</p>
          )}
          <p className="mt-2 text-xs text-[var(--color-textSecondary)]">
            <strong>Processing time:</strong> {payload.processingTime}
          </p>
          <p className="mt-1 text-sm text-[var(--color-text)]">{payload.reassuranceMessage}</p>
        </div>
      </div>

      {payload.actionLabel && (
        <div className="mt-4 border-t border-[var(--color-success)]/20 pt-3">
          <button
            type="button"
            onClick={() => onAction({ action: "success_card_dismiss" })}
            className="w-full rounded-xl bg-[var(--color-success)] py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            {payload.actionLabel}
          </button>
        </div>
      )}
    </motion.div>
  );
}
