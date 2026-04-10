import type { WithdrawalType, PaymentMethod } from "../types";

export const WD_TYPES: { id: WithdrawalType; label: string; hint: string }[] = [
  { id: "hardship", label: "Hardship", hint: "IRS rules apply; may include penalty" },
  { id: "in-service", label: "In-service", hint: "While still employed" },
  { id: "termination", label: "Termination", hint: "After separation" },
  { id: "rmd", label: "RMD", hint: "Required minimum distribution" },
  { id: "one-time", label: "One-time", hint: "Single distribution" },
  { id: "full-balance", label: "Full balance", hint: "Close account" },
];

export const PAY: { id: PaymentMethod; label: string }[] = [
  { id: "ach", label: "ACH to bank" },
  { id: "check", label: "Check by mail" },
];
