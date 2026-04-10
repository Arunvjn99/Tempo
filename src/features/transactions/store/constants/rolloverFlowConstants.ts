import type { AllocationMethod, RolloverType } from "../types";

export const ROLLOVER_TYPES: { id: RolloverType; label: string }[] = [
  { id: "traditional", label: "Traditional" },
  { id: "roth", label: "Roth" },
  { id: "ira", label: "IRA" },
];

export const ALLOCATION_OPTIONS: { id: AllocationMethod; label: string; sub: string }[] = [
  { id: "match", label: "Match current plan", sub: "Mirror your existing allocation" },
  { id: "target", label: "Target date default", sub: "Use QDIA-style glide path" },
  { id: "custom", label: "Custom", sub: "Set your own percentages" },
];
