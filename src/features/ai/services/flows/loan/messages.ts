import { assistantMessage } from "../../messageUtils";
import type {
  DocumentUploadCardPayload,
  FeesCardPayload,
  SelectionCardPayload,
  SuccessCardPayload,
} from "../../../store/interactiveTypes";
import {
  LOAN_OTHER_CHARGES,
  LOAN_PROCESSING_FEE,
  netLoanAmount,
} from "../../../store/loanAIState";

export const DEBUG_LOAN_FLOW = import.meta.env.DEV;

export function logLoanFlow(phase: string, detail?: unknown) {
  if (DEBUG_LOAN_FLOW) {
    console.debug("[CoreAI loan flow]", phase, detail ?? "");
  }
}

export function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function disbursementLabel(method: "eft" | "check"): string {
  return method === "eft" ? "Bank transfer (ACH)" : "Check (mailed)";
}

export function selectionCardMessage(): ReturnType<typeof assistantMessage> {
  const payload: SelectionCardPayload = {
    title: "How would you like to receive the loan?",
    subtitle: "We’ll use this when you finish in loan configuration.",
    options: [
      { label: "Bank transfer (ACH)", value: "eft" },
      { label: "Check (mailed)", value: "check" },
    ],
    insight: "Bank transfer is fastest. Check takes 5–7 business days.",
  };
  return assistantMessage("Choose how you’d like to receive the funds.", {
    interactiveType: "selection_card",
    interactivePayload: payload,
  });
}

export function feesCardMessage(
  principal: number,
  method: "eft" | "check",
): ReturnType<typeof assistantMessage> {
  const net = netLoanAmount(principal);
  const payload: FeesCardPayload = {
    title: "Fees breakdown",
    processingFee: LOAN_PROCESSING_FEE,
    otherCharges: LOAN_OTHER_CHARGES,
    principal,
    netAmount: net,
    disbursementLabel: disbursementLabel(method),
  };
  return assistantMessage("Here’s how fees affect what hits your account.", {
    interactiveType: "fees_card",
    interactivePayload: payload,
  });
}

export function documentsCardMessage(): ReturnType<typeof assistantMessage> {
  const payload: DocumentUploadCardPayload = {
    title: "Required documents",
    items: ["Bank proof", "Promissory note", "Spousal consent (if applicable)"],
    helper: "Upload now or finish later in the loan center.",
  };
  return assistantMessage("Documents checklist — upload now or finish in the loan center.", {
    interactiveType: "document_upload_card",
    interactivePayload: payload,
  });
}

export function buildSuccessCardPayload(): SuccessCardPayload {
  return {
    title: "Loan request submitted",
    description: "Your application has been received.",
    processingTime: "1–2 business days",
    reassuranceMessage: "We'll send a confirmation email shortly. You can track status in the loan center.",
    actionLabel: "Go to loan center",
  };
}

export function successCardMessage() {
  return assistantMessage("Your loan request is in. Here's what to expect.", {
    interactiveType: "loan_success_card",
    interactivePayload: buildSuccessCardPayload(),
  });
}
