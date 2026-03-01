/**
 * Plan display config for the redesigned Plan Selection page.
 * Icons from Iconify solar set. personalizedInsight uses profile data.
 */
export interface PlanDisplayConfig {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  simpleDescription: string;
  features: string[];
  personalizedInsight: (age: number, salary: number, yearsToRetire: number) => string;
}

export const PLANS_DISPLAY: PlanDisplayConfig[] = [
  {
    id: "roth-401k",
    name: "Roth 401(k)",
    icon: "solar:chart-bold-duotone",
    tagline: "Pay taxes now, retire tax-free",
    simpleDescription:
      "You pay taxes on your contributions now. When you retire, everything you withdraw — including all the growth — is completely tax-free.",
    features: ["Grows tax-free", "Withdraw tax-free", "Employer matches you"],
    personalizedInsight: (age, salary, years) =>
      `At ${age} with ${years} years ahead, Roth contributions let your money compound tax-free. By retirement, the tax savings could be worth tens of thousands.`,
  },
  {
    id: "traditional-401k",
    name: "Traditional 401(k)",
    icon: "solar:shield-bold-duotone",
    tagline: "Save on taxes today",
    simpleDescription:
      "Your contributions skip taxes today, reducing your tax bill right now. You pay taxes later when you withdraw in retirement.",
    features: ["Lower taxes now", "Reduce what you owe", "Employer matches you"],
    personalizedInsight: (age, salary, years) =>
      `Contributing pre-tax on a $${salary?.toLocaleString()} salary could save you $${Math.round(salary * 0.06 * 0.22).toLocaleString()} in taxes this year alone.`,
  },
];

export const COMPARE_ROWS: { feature: string; roth: string; traditional: string }[] = [
  { feature: "Tax on contributions", roth: "After-tax (pay now)", traditional: "Pre-tax (pay later)" },
  { feature: "Tax on withdrawals", roth: "✅ Tax-free", traditional: "⚠️ Taxed as income" },
  { feature: "Employer match", roth: "✅ Yes", traditional: "✅ Yes" },
  { feature: "Best if taxes go...", roth: "Up in future", traditional: "Down in future" },
  { feature: "Best starting age", roth: "Under 40", traditional: "40 and above" },
];
