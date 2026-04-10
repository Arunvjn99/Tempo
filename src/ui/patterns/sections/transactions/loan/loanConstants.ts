import type { LoanType, DisbursementMethod, RepaymentFrequency, RepaymentMethod } from "@/features/transactions/store/types";

export const LOAN_TYPES: { id: LoanType; label: string }[] = [
  { id: "general", label: "General purpose" },
  { id: "residential", label: "Residential" },
  { id: "refinance", label: "Refinance" },
];

export const DISBURSE: { id: DisbursementMethod; label: string }[] = [
  { id: "eft", label: "Electronic transfer (EFT)" },
  { id: "check", label: "Check" },
];

export const FREQ: { id: RepaymentFrequency; label: string }[] = [
  { id: "weekly", label: "Weekly" },
  { id: "biweekly", label: "Bi-weekly" },
  { id: "monthly", label: "Monthly" },
];

export const REPAY: { id: RepaymentMethod; label: string }[] = [
  { id: "payroll", label: "Payroll deduction" },
  { id: "ach", label: "ACH" },
  { id: "manual", label: "Manual payment" },
];
