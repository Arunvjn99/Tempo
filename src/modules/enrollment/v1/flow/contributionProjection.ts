/** Figma-aligned 30-year projection curve (employer match up to 6%). */
export function generateContributionProjectionData(
  percent: number,
  salary: number,
  /** Annual growth rate, e.g. 0.068 for 6.8%. */
  annualGrowthRate = 0.07,
) {
  const growthMult = 1 + annualGrowthRate;
  const annual = salary * (percent / 100);
  const matchPercent = Math.min(percent, 6);
  const matchAnnual = salary * (matchPercent / 100);
  const data: {
    year: string;
    value: number;
    contributions: number;
    marketGain: number;
  }[] = [];
  let total = 0;
  let contributions = 0;
  for (let year = 0; year <= 30; year++) {
    const yearlyContribution = annual + matchAnnual;
    contributions += yearlyContribution;
    total = (total + yearlyContribution) * growthMult;
    data.push({
      year: `${year}yr`,
      value: Math.round(total),
      contributions: Math.round(contributions),
      marketGain: Math.round(total - contributions),
    });
  }
  return data;
}
