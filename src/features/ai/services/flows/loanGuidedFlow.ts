import { assistantMessage } from "../messageUtils";
import { getUserFinancials } from "../userFinancials";
import type { CoreAIStructuredPayload } from "../../store/interactiveTypes";
import { LOAN_AI_STATE_KEY, type LoanAIState } from "../../store/loanAIState";
import type { LocalAIResult, LocalFlowState } from "../../store/flowTypes";
import {
  guidedNextState,
  loanPayloadFromState,
  processCalculationStructured,
} from "./loan/calculation";
import { runCalculationTextSteps } from "./loan/calculationText";
import { runEligibilityTextStep } from "./loan/eligibility";
import { logLoanFlow } from "./loan/messages";
import { wrongStructuredFlowResult } from "./loan/reprompt";
import { processReviewStructured, reviewCardMessage, runReviewTextSteps } from "./loan/review";

function processGuidedStructured(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
  structured: CoreAIStructuredPayload,
): LocalAIResult {
  logLoanFlow("structured action", { step: loanAI.step, action: structured.action });

  const fromCalculation = processCalculationStructured(loanAI, financials, structured);
  if (fromCalculation) return fromCalculation;

  const fromReview = processReviewStructured(loanAI, financials, structured);
  if (fromReview) return fromReview;

  return wrongStructuredFlowResult(loanAI, financials, structured);
}

/**
 * Handles guided 6-step loan chat. Caller must ensure `context.guided` and `loanAI` exist.
 */
export function runGuidedLoanFlow(
  state: LocalFlowState,
  input: string,
  structured: CoreAIStructuredPayload | null = null,
): LocalAIResult {
  const trimmed = input.trim();
  const ctx = state.context;
  const loanAI = ctx[LOAN_AI_STATE_KEY] as LoanAIState;
  logLoanFlow("runGuidedLoanFlow", {
    step: loanAI.step,
    hasStructured: Boolean(structured),
    text: trimmed.slice(0, 80),
  });
  const financials = getUserFinancials();

  if (structured) {
    return processGuidedStructured(loanAI, financials, structured);
  }

  const eligibility = runEligibilityTextStep(loanAI, trimmed, financials);
  if (eligibility) return eligibility;

  const calculation = runCalculationTextSteps(loanAI, trimmed, financials);
  if (calculation) return calculation;

  const review = runReviewTextSteps(loanAI, trimmed, financials);
  if (review) return review;

  return { messages: [assistantMessage("Something went off track — try **apply loan** again.")], nextState: null };
}

export function isGuidedLoanContext(ctx: Record<string, unknown>): boolean {
  return ctx.guided === true && ctx[LOAN_AI_STATE_KEY] != null;
}

export { startGuidedLoanFlow } from "./loan/eligibility";

/**
 * Bootstraps the guided loan flow directly at the **review** card (Core AI modal).
 * Used when chat session state was lost or user taps **Review** with amount/term.
 */
export function bootstrapLoanReviewResponse(
  amount: number,
  tenureMonths: number,
  options?: { paymentMethod?: "eft" | "check"; purpose?: string },
): LocalAIResult {
  const financials = getUserFinancials();
  const maxLoan = financials.maxLoan;
  const paymentMethod = options?.paymentMethod ?? "eft";
  const purpose = options?.purpose ?? "general";
  const loanAI: LoanAIState = {
    step: "review",
    data: { amount, tenureMonths, paymentMethod, purpose },
  };
  return {
    messages: [reviewCardMessage(loanAI)],
    nextState: guidedNextState(loanAI, { maxLoan }),
    loanApplyPayload: loanPayloadFromState(loanAI),
  };
}
