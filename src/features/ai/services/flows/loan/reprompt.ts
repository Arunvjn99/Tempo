import { assistantMessage } from "../../messageUtils";
import { getUserFinancials } from "../../userFinancials";
import type {
  DocumentUploadCardPayload,
  FeesCardPayload,
  SelectionCardPayload,
} from "../../../store/interactiveTypes";
import {
  LOAN_OTHER_CHARGES,
  LOAN_PROCESSING_FEE,
  netLoanAmount,
  type LoanAIState,
} from "../../../store/loanAIState";
import { buildSimulatorPayload, guidedNextState } from "./calculation";
import { buildSuccessCardPayload, disbursementLabel, logLoanFlow } from "./messages";
import { buildReviewCardPayload } from "./review";

export function wrongStructuredReprompt(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
) {
  const maxLoan = financials.maxLoan;
  const principal = loanAI.data.amount ?? 0;
  const method = (loanAI.data.paymentMethod === "check" ? "check" : "eft") as "eft" | "check";

  switch (loanAI.step) {
    case "eligibility":
      return assistantMessage("Reply **continue** for your live payment preview.", {
        suggestions: ["Continue"],
      });
    case "simulation":
      return assistantMessage("That control doesn’t match this step — adjust **amount** / **term** here, then **Continue**.", {
        interactiveType: "loan_simulator_card",
        interactivePayload: buildSimulatorPayload(loanAI, maxLoan),
      });
    case "configuration": {
      const payload: SelectionCardPayload = {
        title: "How would you like to receive the loan?",
        subtitle: "We’ll use this when you finish in loan configuration.",
        options: [
          { label: "Bank transfer (ACH)", value: "eft" },
          { label: "Check (mailed)", value: "check" },
        ],
        insight: "Bank transfer is fastest. Check takes 5–7 business days.",
      };
      return assistantMessage("That control doesn’t match this step — pick disbursement below.", {
        interactiveType: "selection_card",
        interactivePayload: payload,
      });
    }
    case "fees": {
      const payload: FeesCardPayload = {
        title: "Fees breakdown",
        processingFee: LOAN_PROCESSING_FEE,
        otherCharges: LOAN_OTHER_CHARGES,
        principal,
        netAmount: netLoanAmount(principal),
        disbursementLabel: disbursementLabel(method),
      };
      return assistantMessage("That control doesn’t match this step — continue from the fees card.", {
        interactiveType: "fees_card",
        interactivePayload: payload,
      });
    }
    case "documents": {
      const payload: DocumentUploadCardPayload = {
        title: "Required documents",
        items: ["Bank proof", "Promissory note", "Spousal consent (if applicable)"],
        helper: "Upload now or finish later in the loan center.",
      };
      return assistantMessage("That control doesn’t match this step — use the document card.", {
        interactiveType: "document_upload_card",
        interactivePayload: payload,
      });
    }
    case "review":
      return assistantMessage("That control doesn’t match this step — use **Submit loan** below.", {
        interactiveType: "loan_review_card",
        interactivePayload: buildReviewCardPayload(loanAI),
      });
    case "success":
      return assistantMessage("Tap **Go to loan center** to continue.", {
        interactiveType: "loan_success_card",
        interactivePayload: buildSuccessCardPayload(),
      });
    default:
      return assistantMessage("Continue from the conversation above, or say **apply loan** to restart.");
  }
}

export function wrongStructuredFlowResult(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
  structured: { action: string },
) {
  const maxLoan = financials.maxLoan;
  const wrong = wrongStructuredReprompt(loanAI, financials);
  logLoanFlow("structured → reprompt", {
    step: loanAI.step,
    action: structured.action,
    repromptType: wrong.interactiveType,
  });
  return {
    messages: [wrong],
    nextState: guidedNextState(loanAI, { maxLoan }),
  };
}
