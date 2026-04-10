import { assistantMessage } from "../../messageUtils";
import { getUserFinancials } from "../../userFinancials";
import type { FeesCardPayload, SelectionCardPayload } from "../../../store/interactiveTypes";
import {
  LOAN_OTHER_CHARGES,
  LOAN_PROCESSING_FEE,
  netLoanAmount,
  type LoanAIState,
} from "../../../store/loanAIState";
import type { LocalAIResult } from "../../../store/flowTypes";
import { LOAN_AI_TENURE_MONTHS } from "../../emiCalculator";
import {
  disbursementLabel,
  documentsCardMessage,
  feesCardMessage,
  selectionCardMessage,
} from "./messages";
import { buildSimulatorPayload, clampTenure, guidedNextState } from "./calculation";
import { isAffirmative, isNegative, parseDisbursement } from "./validators";

export function runCalculationTextSteps(
  loanAI: LoanAIState,
  trimmed: string,
  financials: ReturnType<typeof getUserFinancials>,
): LocalAIResult | null {
  if (loanAI.step !== "simulation" && loanAI.step !== "configuration" && loanAI.step !== "fees") {
    return null;
  }

  const maxLoan = financials.maxLoan;
  const amount = loanAI.data.amount ?? 0;

  if (loanAI.step === "simulation") {
    if (isNegative(trimmed) || /^not now\b/i.test(trimmed)) {
      return {
        messages: [assistantMessage("Understood. When you’re ready, say **apply loan** or enter an amount again.")],
        nextState: null,
      };
    }
    if (isAffirmative(trimmed) || /\b(proceed|yes|ok)\b/i.test(trimmed)) {
      const tenureMonths = clampTenure(loanAI.data.tenureMonths ?? LOAN_AI_TENURE_MONTHS);
      const p = buildSimulatorPayload(loanAI, maxLoan);
      const nextLoan: LoanAIState = {
        ...loanAI,
        step: "configuration",
        data: { ...loanAI.data, amount: p.amount, tenureMonths },
      };
      return {
        messages: [selectionCardMessage()],
        nextState: guidedNextState(nextLoan, { maxLoan }),
      };
    }
    return {
      messages: [
        assistantMessage(
          "Adjust the **simulator** below, or reply **continue** to keep your current amount and term.",
          {
            interactiveType: "loan_simulator_card",
            interactivePayload: buildSimulatorPayload(loanAI, maxLoan),
          },
        ),
      ],
      nextState: guidedNextState(loanAI, { maxLoan }),
    };
  }

  if (loanAI.step === "configuration") {
    const method = parseDisbursement(trimmed);
    if (!method) {
      return {
        messages: [
          assistantMessage("Pick an option on the card or type **bank transfer** / **check**.", {
            interactiveType: "selection_card",
            interactivePayload: {
              title: "How would you like to receive the loan?",
              subtitle: "We’ll use this when you finish in loan configuration.",
              options: [
                { label: "Bank transfer (ACH)", value: "eft" },
                { label: "Check (mailed)", value: "check" },
              ],
              insight: "Bank transfer is fastest. Check takes 5–7 business days.",
            } satisfies SelectionCardPayload,
          }),
        ],
        nextState: guidedNextState(loanAI, { maxLoan }),
      };
    }
    const nextLoan: LoanAIState = {
      ...loanAI,
      step: "fees",
      data: { ...loanAI.data, paymentMethod: method },
    };
    return {
      messages: [feesCardMessage(amount, method)],
      nextState: guidedNextState(nextLoan, { maxLoan }),
    };
  }

  if (loanAI.step === "fees") {
    if (isNegative(trimmed)) {
      return {
        messages: [assistantMessage("Okay — we’ve paused here. Say **apply loan** when you want to resume.")],
        nextState: null,
      };
    }
    if (isAffirmative(trimmed) || /\bcontinue\b/i.test(trimmed)) {
      const nextLoan: LoanAIState = { ...loanAI, step: "documents" };
      return {
        messages: [documentsCardMessage()],
        nextState: guidedNextState(nextLoan, { maxLoan }),
      };
    }
    const method = (loanAI.data.paymentMethod === "check" ? "check" : "eft") as "eft" | "check";
    const feesPayload: FeesCardPayload = {
      title: "Fees breakdown",
      processingFee: LOAN_PROCESSING_FEE,
      otherCharges: LOAN_OTHER_CHARGES,
      principal: amount,
      netAmount: netLoanAmount(amount),
      disbursementLabel: disbursementLabel(method),
    };
    return {
      messages: [
        assistantMessage("Tap **Continue** on the fees card when you’re ready.", {
          interactiveType: "fees_card",
          interactivePayload: feesPayload,
        }),
      ],
      nextState: guidedNextState(loanAI, { maxLoan }),
    };
  }

  return null;
}
