import type { IncrementCycle } from "../store/useEnrollmentStore";

/**
 * Logical auto-increase form (maps to `useEnrollmentStore`):
 * - autoIncreaseEnabled → `autoIncrease`
 * - incrementType → `incrementCycle`
 * - increasePercent → `autoIncreaseRate`
 * - maxLimit → `autoIncreaseMax`
 */
export type AutoIncreaseEnrollmentState = {
  autoIncreaseEnabled: boolean;
  incrementType: IncrementCycle;
  increasePercent: number;
  maxLimit: number;
};
