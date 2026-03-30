import { motion, useReducedMotion } from "framer-motion";

const MONEY_BAG = "\u{1F4B0}";

/** Very gentle pulse for 💰 in savings wizard copy (respects reduced motion). */
export function AnimatedMoneyBag() {
  const reduceMotion = useReducedMotion();
  return (
    <motion.span
      className="v2-savings-money-emoji"
      aria-hidden
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.03, 1],
              y: [0, -0.75, 0],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 4.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.85 }
      }
    >
      {MONEY_BAG}
    </motion.span>
  );
}
