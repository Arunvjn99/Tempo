import { motion, useReducedMotion } from "framer-motion";

const WAVE_EMOJI = "\u{1F44B}";

/** Small looping wave motion for the 👋 in wizard header greetings (respects reduced motion). */
export function AnimatedHeaderWave() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className="v2-header-wave"
      aria-hidden
      animate={reduceMotion ? undefined : { rotate: [0, 10, -7, 9, -5, 8, 0] }}
      transition={
        reduceMotion ? undefined : { duration: 2.75, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 }
      }
    >
      {WAVE_EMOJI}
    </motion.span>
  );
}
