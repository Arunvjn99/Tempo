import { motion, useReducedMotion } from "framer-motion";

const GLOBE_EMOJI = "\u{1F30E}";

/** Smooth continuous spin for the 🌎 in the location step title (respects reduced motion). */
export function AnimatedLocationGlobe() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className="v2-location-globe"
      aria-hidden
      animate={reduceMotion ? undefined : { rotate: 360 }}
      transition={
        reduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "linear" }
      }
    >
      {GLOBE_EMOJI}
    </motion.span>
  );
}
