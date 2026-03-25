import { assistantMessage } from "../messageUtils";
import { getUserFinancials } from "../context/userFinancials";
import type {
  CoreAIStructuredPayload,
  DocumentUploadCardPayload,
  FeesCardPayload,
  LoanSimulatorCardPayload,
  ReviewCardPayload,
  SelectionCardPayload,
  SuccessCardPayload,
} from "../interactive/types";
import {
  LOAN_AI_STATE_KEY,
  LOAN_OTHER_CHARGES,
  LOAN_PROCESSING_FEE,
  netLoanAmount,
  type LoanAIState,
} from "../state/loanAIState";
import type { LocalAIResult, LocalFlowState } from "../types";
import { generateSchedule, LOAN_AI_ANNUAL_RATE_PERCENT, LOAN_AI_TENURE_MONTHS } from "../utils/emiCalculator";
import { purposeToLoanTypeId, type LoanFlowPurpose } from "../utils/parseLoanInput";

const DEBUG_LOAN_FLOW = import.meta.env.DEV;

function logLoanFlow(phase: string, detail?: unknown) {
  if (DEBUG_LOAN_FLOW) {
    console.debug("[CoreAI loan flow]", phase, detail ?? "");
  }
}

function money(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function moneyCents(n: number): string {
  return `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function isAffirmative(input: string): boolean {
  return /^(yes|yeah|yep|sure|ok|okay|proceed|go|continue|start|next)\b/i.test(input.trim());
}

function isNegative(input: string): boolean {
  return /^(no|nope|cancel|stop|never|not now)\b/i.test(input.trim());
}

function parseDisbursement(input: string): "eft" | "check" | null {
  const t = input.toLowerCase();
  if (/\bcheck\b/.test(t)) return "check";
  if (/\b(bank|transfer|eft|ach|deposit|wire)\b/.test(t)) return "eft";
  return null;
}

function loanPayloadFromState(loan: LoanAIState) {
  const amount = loan.data.amount ?? 0;
  const purposeStr = loan.data.purpose ?? "general";
  const purpose = purposeStr as LoanFlowPurpose;
  return {
    amount,
    purpose: purposeStr,
    loanType: purposeToLoanTypeId(purpose),
  };
}

function guidedNextState(loanAI: LoanAIState, extra: Record<string, unknown> = {}): LocalFlowState {
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

function disbursementLabel(method: "eft" | "check"): string {
  return method === "eft" ? "Bank transfer (ACH)" : "Check (mailed)";
}

function clampTenure(months: number, min = 12, max = 60, step = 12): number {
  const s = Math.round(months / step) * step;
  return Math.min(max, Math.max(min, s));
}

function buildSimulatorPayload(loanAI: LoanAIState, maxLoan: number): LoanSimulatorCardPayload {
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

function simulatorIntroMessage(loanAI: LoanAIState, financials: ReturnType<typeof getUserFinancials>) {
  const payload = buildSimulatorPayload(loanAI, financials.maxLoan);
  return assistantMessage(
    "Slide to explore **amount** and **length** — your estimated payment updates instantly. Tap **Continue** when it feels right.",
    {
      interactiveType: "loan_simulator_card",
      interactivePayload: payload,
    },
  );
}

function selectionCardMessage(): ReturnType<typeof assistantMessage> {
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

function feesCardMessage(
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

function documentsCardMessage(): ReturnType<typeof assistantMessage> {
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

function buildReviewCardPayload(loanAI: LoanAIState): ReviewCardPayload {
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

function reviewCardMessage(loanAI: LoanAIState) {
  return assistantMessage("One last look — submit when you’re ready.", {
    interactiveType: "loan_review_card",
    interactivePayload: buildReviewCardPayload(loanAI),
  });
}

function buildSuccessCardPayload(): SuccessCardPayload {
  return {
    title: "Loan request submitted",
    description: "Your application has been received.",
    processingTime: "1–2 business days",
    reassuranceMessage: "We'll send a confirmation email shortly. You can track status in the loan center.",
    actionLabel: "Go to loan center",
  };
}

function successCardMessage() {
  return assistantMessage("Your loan request is in. Here's what to expect.", {
    interactiveType: "loan_success_card",
    interactivePayload: buildSuccessCardPayload(),
  });
}

function processGuidedStructured(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
  structured: CoreAIStructuredPayload,
): LocalAIResult {
  const maxLoan = financials.maxLoan;

  logLoanFlow("structured action", { step: loanAI.step, action: structured.action });

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

  const wrong = wrongStructuredReprompt(loanAI, financials);
  logLoanFlow("structured → reprompt", { step: loanAI.step, action: structured.action, repromptType: wrong.interactiveType });
  return {
    messages: [wrong],
    nextState: guidedNextState(loanAI, { maxLoan }),
  };
}

function wrongStructuredReprompt(
  loanAI: LoanAIState,
  financials: ReturnType<typeof getUserFinancials>,
): ReturnType<typeof assistantMessage> {
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

/** First assistant turn after amount is set — eligibility only. */
export function startGuidedLoanFlow(amount: number, purpose: string, financials: ReturnType<typeof getUserFinancials>): LocalAIResult {
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
  logLoanFlow("runGuidedLoanFlow", { step: loanAI.step, hasStructured: Boolean(structured), text: trimmed.slice(0, 80) });
  const financials = getUserFinancials();
  const maxLoan = financials.maxLoan;
  const amount = loanAI.data.amount ?? 0;

  if (structured) {
    return processGuidedStructured(loanAI, financials, structured);
  }

  if (loanAI.step === "eligibility") {
    if (isNegative(trimmed)) {
      return {
        messages: [assistantMessage("No problem — ask about a **loan** anytime and we’ll pick this up again.")],
        nextState: null,
      };
    }
    return {
      messages: [simulatorIntroMessage(loanAI, financials)],
      nextState: guidedNextState({ ...loanAI, step: "simulation" }, { maxLoan }),
    };
  }

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

  return { messages: [assistantMessage("Something went off track — try **apply loan** again.")], nextState: null };
}

export function isGuidedLoanContext(ctx: Record<string, unknown>): boolean {
  return ctx.guided === true && ctx[LOAN_AI_STATE_KEY] != null;
}

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
