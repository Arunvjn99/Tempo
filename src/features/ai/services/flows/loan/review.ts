import { assistantMessage } from "../../messageUtils";
import { getUserFinancials } from "../../userFinancials";
import type {
  CoreAIStructuredPayload,
  DocumentUploadCardPayload,
  ReviewCardPayload,
} from "../../../store/interactiveTypes";
import { netLoanAmount, type LoanAIState } from "../../../store/loanAIState";
import type { LocalAIResult } from "../../../store/flowTypes";
import { generateSchedule, LOAN_AI_ANNUAL_RATE_PERCENT, LOAN_AI_TENURE_MONTHS } from "../../emiCalculator";
import { buildSuccessCardPayload, disbursementLabel, logLoanFlow, successCardMessage } from "./messages";
import { guidedNextState, loanPayloadFromState } from "./calculation";
import { isAffirmative, isNegative } from "./validators";

export function buildReviewCardPayload(loanAI: LoanAIState): ReviewCardPayload {
  const amt = loanAI.data.amount ?? 0;
  const tenureMonths = loanAI.data.tenureMonths ?? LOAN_AI_TENURE_MONTHS;
  const method = (loanAI.data.paymentMethod === "check" ? "check" : "eft") as "eft" | "check";
  const { emi: monthlyPayment, rows } = generateSchedule(amt, LOAN_AI_ANNUAL_RATE_PERCENT, tenureMonths, 3);
  return {
    title: "Review & submit",
    amount: amt,
    netAmount: netLoanAmount(amt),
    tenureMonths,
    monthlyPayment,
    annualRatePercent: LOAN_AI_ANNUAL_RATE_PERCENT,
    disbursementLabel: disbursementLabel(method),
    schedulePreview: rows,
  };
}

export function reviewCardMessage(loanAI: LoanAIState) {
  return assistantMessage("One last look — submit when you’re ready.", {
    interactiveType: "loan_review_card",
    interactivePayload: buildReviewCardPayload(loanAI),
  });
}

export function processReviewStructured(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
  structured: CoreAIStructuredPayload,
): LocalAIResult | null {
  const maxLoan = financials.maxLoan;

  if (loanAI.step === "documents" && structured.action === "document_upload_card_continue") {
    const nextLoan: LoanAIState = { ...loanAI, step: "review" };
    const reviewMsg = reviewCardMessage(nextLoan);
    logLoanFlow("documents → review", { interactiveType: reviewMsg.interactiveType });
    return {
      messages: [reviewMsg],
      nextState: guidedNextState(nextLoan, { maxLoan }),
      loanApplyPayload: loanPayloadFromState(nextLoan),
    };
  }

  if (
    loanAI.step === "review" &&
    (structured.action === "review_card_submit" || structured.action === "SUBMIT_LOAN")
  ) {
    const nextLoan: LoanAIState = { ...loanAI, step: "success" };
    const successMsg = successCardMessage();
    logLoanFlow("review → success", { interactiveType: successMsg.interactiveType });
    return {
      messages: [successMsg],
      nextState: guidedNextState(nextLoan, { maxLoan }),
      loanApplyPayload: loanPayloadFromState(loanAI),
    };
  }

  if (loanAI.step === "success" && structured.action === "success_card_dismiss") {
    logLoanFlow("success dismiss → navigate", { to: "/transactions/loan/review" });
    return {
      messages: [],
      nextState: null,
      loanApplyPayload: loanPayloadFromState(loanAI),
      navigate: "/transactions/loan/review",
    };
  }

  return null;
}

export function runReviewTextSteps(
  loanAI: LoanAIState,
  trimmed: string,
  financials: ReturnType<typeof getUserFinancials>,
): LocalAIResult | null {
  if (
    loanAI.step !== "documents" &&
    loanAI.step !== "review" &&
    loanAI.step !== "success"
  ) {
    return null;
  }

  const maxLoan = financials.maxLoan;

  if (loanAI.step === "documents") {
    if (isNegative(trimmed)) {
      return {
        messages: [assistantMessage("All set — open **Apply loan** from the menu when you’re ready to finish.")],
        nextState: null,
      };
    }
    if (isAffirmative(trimmed) || /\b(review|continue|later)\b/i.test(trimmed)) {
      const nextLoan: LoanAIState = { ...loanAI, step: "review" };
      return {
        messages: [reviewCardMessage(nextLoan)],
        nextState: guidedNextState(nextLoan, { maxLoan }),
        loanApplyPayload: loanPayloadFromState(nextLoan),
      };
    }
    const docPayload: DocumentUploadCardPayload = {
      title: "Required documents",
      items: ["Bank proof", "Promissory note", "Spousal consent (if applicable)"],
      helper: "Upload now or finish later in the loan center.",
    };
    return {
      messages: [
        assistantMessage("Use the document card to continue — or say **continue to review**.", {
          interactiveType: "document_upload_card",
          interactivePayload: docPayload,
        }),
      ],
      nextState: guidedNextState(loanAI, { maxLoan }),
    };
  }

  if (loanAI.step === "review") {
    if (isNegative(trimmed)) {
      return {
        messages: [assistantMessage("No worries — use **Submit loan** on the card when you’re ready.")],
        nextState: guidedNextState(loanAI, { maxLoan }),
      };
    }
    if (isAffirmative(trimmed) || /^submit\b/i.test(trimmed)) {
      const nextLoan: LoanAIState = { ...loanAI, step: "success" };
      return {
        messages: [successCardMessage()],
        nextState: guidedNextState(nextLoan, { maxLoan }),
        loanApplyPayload: loanPayloadFromState(loanAI),
      };
    }
    return {
      messages: [
        assistantMessage("Tap **Submit loan** on the review card or reply **yes**.", {
          interactiveType: "loan_review_card",
          interactivePayload: buildReviewCardPayload(loanAI),
        }),
      ],
      nextState: guidedNextState(loanAI, { maxLoan }),
      loanApplyPayload: loanPayloadFromState(loanAI),
    };
  }

  if (loanAI.step === "success") {
    if (isAffirmative(trimmed) || /\b(go|continue|ok|done)\b/i.test(trimmed)) {
      return {
        messages: [],
        nextState: null,
        loanApplyPayload: loanPayloadFromState(loanAI),
        navigate: "/transactions/loan/review",
      };
    }
    return {
      messages: [
        assistantMessage("Tap **Go to loan center** below, or say **ok** to continue.", {
          interactiveType: "loan_success_card",
          interactivePayload: buildSuccessCardPayload(),
        }),
      ],
      nextState: guidedNextState(loanAI, { maxLoan }),
    };
  }

  return null;
}
