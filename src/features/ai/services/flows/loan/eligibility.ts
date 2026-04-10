import { assistantMessage } from "../../messageUtils";
import { getUserFinancials } from "../../userFinancials";
import type { LoanAIState } from "../../../store/loanAIState";
import type { LocalAIResult } from "../../../store/flowTypes";
import { guidedNextState, simulatorIntroMessage } from "./calculation";
import { money } from "./messages";
import { isNegative } from "./validators";

export function startGuidedLoanFlow(
  amount: number,
  purpose: string,
  financials: ReturnType<typeof getUserFinancials>,
): LocalAIResult {
  const loanAI: LoanAIState = {
    step: "eligibility",
    data: { amount, purpose },
  };

  return {
    messages: [
      assistantMessage(
        [
          "Here’s what we see on your account:",
          "",
          `**Vested balance:** ${money(financials.vestedBalance)}`,
          `**Max loan (mock rule):** ${money(financials.maxLoan)}`,
          "",
          "You’re **eligible** to request a loan at this amount. Reply **continue** when you’re ready for a **live payment preview**.",
        ].join("\n"),
        { suggestions: ["Continue", "Tell me more"] },
      ),
    ],
    nextState: guidedNextState(loanAI, { maxLoan: financials.maxLoan }),
  };
}

export function runEligibilityTextStep(
  loanAI: LoanAIState,
  trimmed: string,
  financials: ReturnType<typeof getUserFinancials>,
): LocalAIResult | null {
  if (loanAI.step !== "eligibility") return null;

  if (isNegative(trimmed)) {
    return {
      messages: [assistantMessage("No problem — ask about a **loan** anytime and we’ll pick this up again.")],
      nextState: null,
    };
  }
  return {
    messages: [simulatorIntroMessage(loanAI, financials)],
    nextState: guidedNextState({ ...loanAI, step: "simulation" }, { maxLoan: financials.maxLoan }),
  };
}
