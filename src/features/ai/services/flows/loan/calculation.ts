import { assistantMessage } from "../../messageUtils";
import { getUserFinancials } from "../../userFinancials";
import type { CoreAIStructuredPayload, LoanSimulatorCardPayload } from "../../../store/interactiveTypes";
import { LOAN_AI_STATE_KEY, type LoanAIState } from "../../../store/loanAIState";
import type { LocalAIResult, LocalFlowState } from "../../../store/flowTypes";
import { LOAN_AI_ANNUAL_RATE_PERCENT, LOAN_AI_TENURE_MONTHS } from "../../emiCalculator";
import { purposeToLoanTypeId, type LoanFlowPurpose } from "../../parseLoanInput";
import { documentsCardMessage, feesCardMessage, selectionCardMessage } from "./messages";

export function clampTenure(months: number, min = 12, max = 60, step = 12): number {
  const s = Math.round(months / step) * step;
  return Math.min(max, Math.max(min, s));
}

export function buildSimulatorPayload(loanAI: LoanAIState, maxLoan: number): LoanSimulatorCardPayload {
  const maxAmount = maxLoan;
  const minAmount = maxAmount < 500 ? maxAmount : 500;
  const step = 100;
  const rawAmt = loanAI.data.amount ?? maxAmount;
  const snapped = Math.round(rawAmt / step) * step;
  const amount = Math.min(maxAmount, Math.max(minAmount, snapped));
  const tenureMonths = clampTenure(loanAI.data.tenureMonths ?? LOAN_AI_TENURE_MONTHS);
  return {
    amount,
    minAmount,
    maxAmount,
    annualRatePercent: LOAN_AI_ANNUAL_RATE_PERCENT,
    tenureMonths,
    minTenureMonths: 12,
    maxTenureMonths: 60,
    tenureStep: 12,
    amountStep: step,
  };
}

export function simulatorIntroMessage(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
) {
  const payload = buildSimulatorPayload(loanAI, financials.maxLoan);
  return assistantMessage(
    "Slide to explore **amount** and **length** — your estimated payment updates instantly. Tap **Continue** when it feels right.",
    {
      interactiveType: "loan_simulator_card",
      interactivePayload: payload,
    },
  );
}

export function loanPayloadFromState(loan: LoanAIState) {
  const amount = loan.data.amount ?? 0;
  const purposeStr = loan.data.purpose ?? "general";
  const purpose = purposeStr as LoanFlowPurpose;
  return {
    amount,
    purpose: purposeStr,
    loanType: purposeToLoanTypeId(purpose),
  };
}

export function guidedNextState(loanAI: LoanAIState, extra: Record<string, unknown> = {}): LocalFlowState {
  return {
    type: "loan",
    step: 2,
    context: {
      guided: true,
      [LOAN_AI_STATE_KEY]: loanAI,
      ...extra,
    },
  };
}

export function processCalculationStructured(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
  structured: CoreAIStructuredPayload,
): LocalAIResult | null {
  const maxLoan = financials.maxLoan;

  if (loanAI.step === "simulation" && structured.action === "loan_simulator_continue") {
    const p = buildSimulatorPayload(loanAI, maxLoan);
    const step = p.amountStep ?? 100;
    let amount = Math.round(structured.amount / step) * step;
    amount = Math.min(p.maxAmount, Math.max(p.minAmount, amount));
    const tenureMonths = clampTenure(structured.tenureMonths);
    const nextLoan: LoanAIState = {
      ...loanAI,
      step: "configuration",
      data: { ...loanAI.data, amount, tenureMonths },
    };
    return {
      messages: [selectionCardMessage()],
      nextState: guidedNextState(nextLoan, { maxLoan }),
    };
  }

  if (loanAI.step === "configuration" && structured.action === "selection_card_pick") {
    const method = structured.value;
    const amount = loanAI.data.amount ?? 0;
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

  if (loanAI.step === "fees" && structured.action === "fees_card_continue") {
    const nextLoan: LoanAIState = { ...loanAI, step: "documents" };
    return {
      messages: [documentsCardMessage()],
      nextState: guidedNextState(nextLoan, { maxLoan }),
    };
  }

  return null;
}
