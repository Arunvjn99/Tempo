import type { IncrementCycle } from "../types";

export const CYCLE_OPTIONS: { value: IncrementCycle; label: string; sub: string }[] = [
  { value: "calendar", label: "Calendar Year", sub: "Every Jan 1st" },
  { value: "participant", label: "Participant Date", sub: "On enrollment date" },
  { value: "plan", label: "Plan Year", sub: "Every April 1" },
];
