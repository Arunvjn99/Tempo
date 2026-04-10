// ─────────────────────────────────────────────
// Transaction Flow — Step-Level Validation
// ─────────────────────────────────────────────

import type {
  LoanData,
  RolloverData,
  TransactionType,
  TransferData,
  TxValidationResult,
  WithdrawalData,
  RebalanceData,
  TransactionFlowState,
} from "./types";

function ok(): TxValidationResult {
  return { valid: true, errors: {} };
}

function fail(errors: Record<string, string>): TxValidationResult {
  return { valid: false, errors };
}

// ── Loan ──────────────────────────────────────
export function validateLoanStep(step: number, data: LoanData): TxValidationResult {
  switch (step) {
    case 0: // eligibility
      if (data.isEligible === false) {
        return fail({ eligibility: data.eligibilityReason || "You are not eligible for a loan." });
      }
      if (data.isEligible === null) {
        return fail({ eligibility: "Eligibility check pending." });
      }
      return ok();

    case 1: // simulator
      if (data.amount < 1000 || data.amount > 50_000) {
        return fail({ amount: "Loan amount must be between $1,000 and $50,000." });
      }
      if (data.term < 1 || data.term > 5) {
        return fail({ term: "Loan term must be between 1 and 5 years." });
      }
      return ok();

    case 2: // configuration
      if (!data.reason.trim()) {
        return fail({ reason: "Please provide a reason for the loan." });
      }
      return ok();

    case 3: // fees — display only
      return ok();

    case 4: // documents
      if (!data.documentsComplete) {
        return fail({ documents: "Please upload all required documents." });
      }
      return ok();

    case 5: // review
      return ok();

    case 6: // confirmation
      return ok();

    default:
      return ok();
  }
}

// ── Withdrawal ────────────────────────────────
export function validateWithdrawalStep(step: number, data: WithdrawalData): TxValidationResult {
  switch (step) {
    case 0: // eligibility
      if (data.isEligible === false) {
        return fail({ eligibility: data.eligibilityReason || "Not eligible for withdrawal." });
      }
      if (data.isEligible === null) {
        return fail({ eligibility: "Eligibility check pending." });
      }
      return ok();

    case 1: // type
      if (!data.withdrawalType) {
        return fail({ withdrawalType: "Please select a withdrawal type." });
      }
      return ok();

    case 2: { // source
      const total =
        data.selectedSources.preTax +
        data.selectedSources.roth +
        data.selectedSources.employer +
        data.selectedSources.afterTax;
      if (total <= 0) {
        return fail({ sources: "Please specify amounts to withdraw." });
      }
      // Check against available
      const errors: Record<string, string> = {};
      if (data.selectedSources.preTax > data.availableSources.preTax) {
        errors.preTax = "Amount exceeds available pre-tax balance.";
      }
      if (data.selectedSources.roth > data.availableSources.roth) {
        errors.roth = "Amount exceeds available Roth balance.";
      }
      if (data.selectedSources.employer > data.availableSources.employer) {
        errors.employer = "Amount exceeds available employer balance.";
      }
      if (data.selectedSources.afterTax > data.availableSources.afterTax) {
        errors.afterTax = "Amount exceeds available after-tax balance.";
      }
      return Object.keys(errors).length ? fail(errors) : ok();
    }

    case 3: // fees — display only
      return ok();

    case 4: // payment
      if (!data.paymentMethod) {
        return fail({ paymentMethod: "Please select a payment method." });
      }
      if (data.paymentMethod === "ach" && !data.bankAccountLast4) {
        return fail({ bankAccount: "Please enter bank account details." });
      }
      if (data.paymentMethod === "check" && !data.mailingAddress.trim()) {
        return fail({ mailingAddress: "Please enter a mailing address." });
      }
      return ok();

    case 5: // review
      return ok();

    case 6: // confirmation
      return ok();

    default:
      return ok();
  }
}

// ── Transfer ──────────────────────────────────
export function validateTransferStep(step: number, data: TransferData): TxValidationResult {
  switch (step) {
    case 0: // type
      if (!data.transferType) {
        return fail({ transferType: "Please select a transfer type." });
      }
      return ok();

    case 1: // source
      if (!data.sourceFundId) {
        return fail({ sourceFund: "Please select a source fund." });
      }
      return ok();

    case 2: { // amount
      if (data.mode === "dollar" && data.amount <= 0) {
        return fail({ amount: "Please enter a transfer amount." });
      }
      if (data.mode === "percent" && (data.percentage <= 0 || data.percentage > 100)) {
        return fail({ percentage: "Percentage must be between 1% and 100%." });
      }
      return ok();
    }

    case 3: // destination
      if (!data.destinationFundId) {
        return fail({ destinationFund: "Please select a destination fund." });
      }
      if (data.destinationFundId === data.sourceFundId) {
        return fail({ destinationFund: "Source and destination funds must be different." });
      }
      return ok();

    case 4: // impact — display only
      return ok();

    case 5: // review
      return ok();

    case 6: // confirmation
      return ok();

    default:
      return ok();
  }
}

// ── Rollover ──────────────────────────────────
export function validateRolloverStep(step: number, data: RolloverData): TxValidationResult {
  switch (step) {
    case 0: { // plan details
      const errors: Record<string, string> = {};
      if (!data.previousEmployer.trim()) errors.previousEmployer = "Previous employer is required.";
      if (!data.planAdministrator.trim()) errors.planAdministrator = "Plan administrator is required.";
      if (!data.accountNumber.trim()) errors.accountNumber = "Account number is required.";
      if (data.estimatedAmount <= 0) errors.estimatedAmount = "Please enter an estimated amount.";
      return Object.keys(errors).length ? fail(errors) : ok();
    }

    case 1: // validation
      if (data.accountValidated === false) {
        return fail({ validation: data.validationError || "Account validation failed." });
      }
      if (data.accountValidated === null) {
        return fail({ validation: "Account validation pending." });
      }
      return ok();

    case 2: // documents
      if (!data.documentsComplete) {
        return fail({ documents: "Please upload all required documents." });
      }
      return ok();

    case 3: { // allocation
      if (data.allocationMethod === "custom") {
        const total = Object.values(data.customAllocations).reduce((s, v) => s + v, 0);
        if (Math.round(total) !== 100) {
          return fail({ allocations: `Allocations must sum to 100% (currently ${total}%).` });
        }
      }
      return ok();
    }

    case 4: // review
      return ok();

    case 5: // confirmation
      return ok();

    default:
      return ok();
  }
}

// ── Rebalance ─────────────────────────────────
export function validateRebalanceStep(step: number, data: RebalanceData): TxValidationResult {
  switch (step) {
    case 0: // current — display only
      return ok();

    case 1: // adjust
      if (!data.isValid) {
        return fail({
          allocations: `Target allocations must sum to 100% (currently ${data.totalTargetAllocation}%).`,
        });
      }
      return ok();

    case 2: // trade preview — display only
      return ok();

    case 3: // review
      return ok();

    default:
      return ok();
  }
}

// ── Dispatch ──────────────────────────────────
export function validateTransactionStep(
  type: TransactionType,
  step: number,
  state: TransactionFlowState,
): TxValidationResult {
  switch (type) {
    case "loan":       return validateLoanStep(step, state.loanData);
    case "withdrawal": return validateWithdrawalStep(step, state.withdrawalData);
    case "transfer":   return validateTransferStep(step, state.transferData);
    case "rollover":   return validateRolloverStep(step, state.rolloverData);
    case "rebalance":  return validateRebalanceStep(step, state.rebalanceData);
  }
}
