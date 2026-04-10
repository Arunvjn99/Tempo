import type { PlanType } from "./store/types";

export const PLAN_COPY: Record<
  PlanType,
  { label: string; short: string; benefits: string[]; singleBlurb: string }
> = {
  traditional: {
    label: "Traditional 401(k)",
    short: "Lower taxes today and grow savings tax-deferred.",
    benefits: ["Lower taxable income today", "Employer match eligible", "Tax-deferred growth"],
    singleBlurb:
      "This plan allows tax-deferred retirement savings. Your contributions reduce your taxable income today.",
  },
  roth: {
    label: "Roth 401(k)",
    short: "Pay taxes now and withdraw tax-free in retirement.",
    benefits: [
      "Tax-free withdrawals in retirement",
      "Flexible retirement income",
      "No required minimum distributions",
    ],
    singleBlurb:
      "This plan allows you to contribute after-tax dollars and withdraw tax-free in retirement.",
  },
};

export const COMPARE_ROWS: { feature: string; traditional: string; roth: string }[] = [
  { feature: "Contributions", traditional: "Pre-tax", roth: "After-tax" },
  { feature: "Withdrawals", traditional: "Taxed as income", roth: "Tax-free" },
  { feature: "RMDs", traditional: "Required at 73", roth: "None" },
  { feature: "Best for", traditional: "Higher earners now", roth: "Lower earners now" },
];
