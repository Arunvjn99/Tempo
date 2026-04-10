import type {
  LoanData,
  RebalanceData,
  RebalanceFund,
  RolloverData,
  TransactionFlowState,
  TransferData,
  WithdrawalData,
} from "./types";

export const DEFAULT_LOAN_DATA: LoanData = {
  isEligible: null,
  eligibilityReason: "",
  amount: 5_000,
  term: 3,
  loanType: "general",
  reason: "",
  disbursementMethod: "eft",
  repaymentFrequency: "monthly",
  repaymentMethod: "payroll",
  interestRate: 0.08,
  monthlyPayment: 0,
  totalInterest: 0,
  totalPayback: 0,
  documentsUploaded: [],
  documentsComplete: false,
};

export const DEFAULT_WITHDRAWAL_DATA: WithdrawalData = {
  isEligible: null,
  eligibilityReason: "",
  availableSources: { preTax: 45_000, roth: 12_000, employer: 8_500, afterTax: 2_000 },
  withdrawalType: null,
  selectedSources: { preTax: 0, roth: 0, employer: 0, afterTax: 0 },
  totalAmount: 0,
  taxWithholding: 0.2,
  penaltyAmount: 0,
  netAmount: 0,
  paymentMethod: null,
  bankAccountLast4: "",
  mailingAddress: "",
};

export const DEFAULT_TRANSFER_DATA: TransferData = {
  transferType: null,
  sourceFundId: "",
  sourceFundName: "",
  destinationFundId: "",
  destinationFundName: "",
  amount: 0,
  percentage: 0,
  mode: "percent",
  impactCalculated: false,
  projectedNewAllocation: {},
};

export const DEFAULT_ROLLOVER_DATA: RolloverData = {
  previousEmployer: "",
  planAdministrator: "",
  accountNumber: "",
  estimatedAmount: 0,
  rolloverType: "traditional",
  accountValidated: null,
  validationError: "",
  allocationMethod: "match",
  customAllocations: {},
  documentsUploaded: [],
  documentsComplete: false,
};

export const DEFAULT_REBALANCE_FUNDS: RebalanceFund[] = [
  { id: "target-2045", name: "Target Date 2045", ticker: "VTTSX", currentAllocation: 45, targetAllocation: 45, currentBalance: 23_500, color: "var(--chart-1)" },
  { id: "large-cap", name: "Large Cap Index", ticker: "VFIAX", currentAllocation: 30, targetAllocation: 30, currentBalance: 15_600, color: "var(--chart-2)" },
  { id: "stable-value", name: "Stable Value", ticker: "SVFXX", currentAllocation: 15, targetAllocation: 15, currentBalance: 7_800, color: "var(--chart-5)" },
  { id: "intl-equity", name: "International Equity", ticker: "VTIAX", currentAllocation: 10, targetAllocation: 10, currentBalance: 5_200, color: "var(--chart-3)" },
];

export const DEFAULT_REBALANCE_DATA: RebalanceData = {
  funds: DEFAULT_REBALANCE_FUNDS,
  trades: [],
  isValid: true,
  totalTargetAllocation: 100,
};

export const DEFAULT_FLOW_STATE: TransactionFlowState = {
  activeType: null,
  activeStep: 0,
  loanData: DEFAULT_LOAN_DATA,
  withdrawalData: DEFAULT_WITHDRAWAL_DATA,
  transferData: DEFAULT_TRANSFER_DATA,
  rolloverData: DEFAULT_ROLLOVER_DATA,
  rebalanceData: DEFAULT_REBALANCE_DATA,
  completedAt: null,
  drafts: [],
  loanAssistantPrefill: null,
  loanAssistantBanner: false,
};
