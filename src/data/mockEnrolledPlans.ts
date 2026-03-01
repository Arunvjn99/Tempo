/**
 * Mock data for enrolled plans in the Enrollment Management system
 */

export type PlanStatus = "enrolled" | "eligible" | "ineligible";

export interface EnrolledPlan {
  id: string;
  planName: string;
  planType: "Traditional 401(k)" | "Roth 401(k)" | "Roth IRA" | "403(b)" | "457(b)";
  status: PlanStatus;
  planId: string; // Plan identifier (e.g., "PLAN-001")
  /** Short description for eligible plans (list card). */
  description?: string;
  enrollmentDate?: string; // ISO date string
  optOutDate?: string; // ISO date string if opted out
  ineligibilityReason?: string; // Required if status is "ineligible"
  
  // Balance snapshot
  balance?: number;
  vestedBalance?: number;
  lastContributionDate?: string;
  
  // Contribution election
  contributionElection?: {
    pretaxPercentage?: number;
    rothPercentage?: number;
    afterTaxPercentage?: number;
    catchUpPercentage?: number;
    totalPercentage: number;
  };
  
  // Investment election
  investmentElection?: {
    pretax: {
      totalPercentage: number;
      funds: Array<{
        fundName: string;
        percentage: number;
      }>;
    };
    roth: {
      totalPercentage: number;
      funds: Array<{
        fundName: string;
        percentage: number;
      }>;
    };
    afterTax: {
      totalPercentage: number;
      funds: Array<{
        fundName: string;
        percentage: number;
      }>;
    };
    catchUp: {
      totalPercentage: number;
      funds: Array<{
        fundName: string;
        percentage: number;
      }>;
    };
  };
  
  // Auto-features
  autoFeatures?: {
    autoIncrease: {
      enabled: boolean;
      increasePercentage: number;
      maxPercentage: number;
      frequency: "annual" | "semi-annual";
    };
    limits: {
      annualLimit: number;
      catchUpLimit: number;
      employerMatchCap: number;
    };
    lastModified?: string;
  };
  
  // Beneficiaries
  beneficiaries?: {
    primary: Array<{
      name: string;
      relationship: string;
      percentage: number;
    }>;
    contingent: Array<{
      name: string;
      relationship: string;
      percentage: number;
    }>;
  };
  
  // Activity log
  activityLog?: Array<{
    date: string;
    action: string;
    description: string;
  }>;
}

export const MOCK_ENROLLED_PLANS: EnrolledPlan[] = [
  {
    id: "plan-1",
    planName: "Roth 401(k)",
    planType: "Roth 401(k)",
    status: "enrolled",
    planId: "PLAN-ROTH-401K-001",
    enrollmentDate: "2024-01-15",
    balance: 125000,
    vestedBalance: 125000,
    lastContributionDate: "2024-12-01",
    contributionElection: {
      pretaxPercentage: 0,
      rothPercentage: 10,
      afterTaxPercentage: 0,
      catchUpPercentage: 0,
      totalPercentage: 10,
    },
    investmentElection: {
      pretax: { totalPercentage: 0, funds: [] },
      roth: {
        totalPercentage: 100,
        funds: [
          { fundName: "S&P 500 Index Fund", percentage: 60 },
          { fundName: "International Stock Fund", percentage: 25 },
          { fundName: "Bond Index Fund", percentage: 15 },
        ],
      },
      afterTax: { totalPercentage: 0, funds: [] },
      catchUp: { totalPercentage: 0, funds: [] },
    },
    autoFeatures: {
      autoIncrease: {
        enabled: true,
        increasePercentage: 1,
        maxPercentage: 15,
        frequency: "annual",
      },
      limits: {
        annualLimit: 23000,
        catchUpLimit: 7500,
        employerMatchCap: 6,
      },
      lastModified: "2024-06-01",
    },
    beneficiaries: {
      primary: [
        { name: "Jane Doe", relationship: "Spouse", percentage: 100 },
      ],
      contingent: [],
    },
    activityLog: [
      { date: "2024-01-15", action: "Enrolled", description: "Enrolled in Roth 401(k) plan" },
      { date: "2024-06-01", action: "Contribution Changed", description: "Updated contribution from 8% to 10%" },
      { date: "2024-09-15", action: "Investment Changed", description: "Rebalanced portfolio allocation" },
    ],
  },
  {
    id: "plan-2",
    planName: "Traditional 401(k)",
    planType: "Traditional 401(k)",
    status: "eligible",
    planId: "PLAN-TRAD-401K-001",
    description:
      "Maximize your savings with pre-tax contributions. This plan allows you to defer taxes on your contributions and earnings until withdrawal.",
  },
  {
    id: "plan-3",
    planName: "Roth IRA",
    planType: "Roth IRA",
    status: "eligible",
    planId: "PLAN-ROTH-IRA-001",
    description:
      "Tax-free growth and tax-free withdrawals in retirement. Perfect for those who expect to be in a higher tax bracket later in life.",
  },
  {
    id: "plan-4",
    planName: "403(b) Plan",
    planType: "403(b)",
    status: "ineligible",
    planId: "PLAN-403B-001",
    ineligibilityReason:
      "Not available for your current employment classification. Please contact HR for more information regarding eligibility requirements.",
  },
];
