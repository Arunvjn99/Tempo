import type { Easing, Transition } from "./framer";

/**
 * Motion tokens — durations, easings, offsets for Framer Motion.
 * Single source for the design system animations layer.
 */

export const motionDuration = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
} as const;

export type MotionDurationName = keyof typeof motionDuration;

export const motionEase = {
  default: [0.4, 0, 0.2, 1] as const,
  smooth: [0.25, 0.46, 0.45, 0.94] as const,
  snappy: [0.33, 1, 0.68, 1] as const,
} as const;

export type MotionEaseName = keyof typeof motionEase;

export const motionScale = {
  hover: 1.03,
  press: 0.97,
} as const;

export const motionOffset = {
  slideUp: 10,
  /** Route transitions — subtle vertical nudge */
  pageY: 6,
  pageExitY: 3,
  headerEnterY: 8,
} as const;

/** Default stagger between list / section children (seconds). */
export const motionStagger = {
  tight: 0.05,
  normal: 0.07,
  relaxed: 0.1,
} as const;

function easeAsEasing(name: MotionEaseName): Easing {
  const tuple = motionEase[name];
  return tuple as unknown as Easing;
}

export function motionTransition(params: {
  duration: MotionDurationName;
  ease?: MotionEaseName;
  delay?: number;
}): Transition {
  const { duration, ease = "smooth", delay = 0 } = params;
  return {
    duration: motionDuration[duration],
    ease: easeAsEasing(ease),
    delay,
  };
}

export const motionInteractionTransition = motionTransition({
  duration: "fast",
  ease: "snappy",
});

export const motionWhileHover = {
  scale: motionScale.hover,
} as const;

export const motionWhileTap = {
  scale: motionScale.press,
} as const;
