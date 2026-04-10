import { useState } from "react";

const RANGES = ["1M", "3M", "6M", "YTD", "1Y", "3Y", "All"] as const;

export function formatInvestmentCurrency(v: number, d = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  }).format(v);
}

export const INVESTMENTS_DEMO = {
  totalBalance: 52_100,
  totalGain: 4_280,
  gainPct: 8.9,
  ytdReturn: 6.2,
  benchmarkReturn: 5.5,
  alpha: 0.7,
  holdings: [
    {
      id: "target-2045",
      name: "Target Date 2045",
      ticker: "VTTSX",
      balance: 23_500,
      allocation: 45,
      targetAllocation: 45,
      drift: 0,
      ytdReturn: 7.2,
      assetClass: "Target Date",
    },
    {
      id: "large-cap",
      name: "Large Cap Index",
      ticker: "VFIAX",
      balance: 15_600,
      allocation: 30,
      targetAllocation: 30,
      drift: 0,
      ytdReturn: 9.1,
      assetClass: "US Stocks",
    },
    {
      id: "stable-value",
      name: "Stable Value",
      ticker: "SVFXX",
      balance: 7_800,
      allocation: 15,
      targetAllocation: 15,
      drift: 0,
      ytdReturn: 2.8,
      assetClass: "Stable Value",
    },
    {
      id: "intl-equity",
      name: "International Equity",
      ticker: "VTIAX",
      balance: 5_200,
      allocation: 10,
      targetAllocation: 10,
      drift: 0,
      ytdReturn: 4.5,
      assetClass: "Int'l Stocks",
    },
  ],
  health: {
    risk: 78,
    diversification: 85,
    onTrack: true,
  },
} as const;

export type InvestmentRange = (typeof RANGES)[number];

export function useInvestmentsPage() {
  const [range, setRange] = useState<InvestmentRange>("1Y");
  return {
    range,
    setRange,
    ranges: RANGES,
    data: INVESTMENTS_DEMO,
    formatCurrency: formatInvestmentCurrency,
  };
}

export type InvestmentsPageViewModel = ReturnType<typeof useInvestmentsPage>;
