/**
 * Interactive Core AI message kinds — rendered as inline UI in the chat stream.
 * Payloads are JSON-serializable (built in flow layer, consumed by React cards).
 */
export type CoreAIInteractiveMessageType =
  | "loan_simulator_card"
  | "selection_card"
  | "fees_card"
  | "document_upload_card"
  | "review_card"
  | "loan_review_card"
  | "success_card"
  | "loan_success_card"
  | "enrollment_setup_card"
  | "enrollment_review_card"
  | "withdrawal_slider_card"
  | "withdrawal_review_card"
  | "info_card"
  | "balance_card";

/** User → flow: structured actions from cards (no network). */
export type CoreAIStructuredPayload =
  | { action: "START_LOAN_REVIEW"; amount: number; tenureMonths: number }
  | { action: "loan_simulator_continue"; amount: number; tenureMonths: number }
  | { action: "selection_card_pick"; value: "eft" | "check"; label: string }
  | { action: "fees_card_continue" }
  | { action: "document_upload_card_continue"; deferred?: boolean }
  | { action: "review_card_submit" }
  | { action: "SUBMIT_LOAN" }
  | { action: "success_card_dismiss" }
  | { action: "enrollment_setup_continue"; plan: string; contribution: number; investment: string }
  | { action: "enrollment_review_submit" }
  | { action: "withdrawal_amount_continue"; value: number }
  | { action: "withdrawal_review_submit" }
  | { action: "vested_dismiss" }
  | { action: "info_card_suggestion"; suggestion: string }
  /** Search “Know more” → inject full FAQ answer as assistant message. */
  | { action: "FAQ_DETAIL"; faqId: string; question: string }
  | { action: "enrollment_contribution_continue"; value: number }
  | { action: "enrollment_investment_pick"; value: string; label: string }
  | { action: "enrollment_plan_pick"; value: string; label: string };

export type LoanSimulatorCardPayload = {
  amount: number;
  minAmount: number;
  maxAmount: number;
  annualRatePercent: number;
  tenureMonths: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  tenureStep: number;
  amountStep?: number;
  /** Optional initial insight; component recalculates dynamically */
  insight?: string;
};

export type SelectionCardPayload = {
  title: string;
  subtitle?: string;
  options: { label: string; value: "eft" | "check" }[];
  /** Contextual guidance */
  insight?: string;
};

export type FeesCardPayload = {
  title: string;
  processingFee: number;
  otherCharges: number;
  principal: number;
  netAmount: number;
  disbursementLabel: string;
};

export type DocumentUploadCardPayload = {
  title: string;
  items: string[];
  helper?: string;
};

export type SchedulePreviewRow = {
  month: number;
  dueDateLabel: string;
  payment: number;
  principal: number;
  interest: number;
  balanceAfter: number;
};

export type ReviewCardPayload = {
  title: string;
  amount: number;
  netAmount: number;
  tenureMonths: number;
  monthlyPayment: number;
  annualRatePercent: number;
  disbursementLabel: string;
  /** First 3 payments from generateSchedule (EMI schedule preview). */
  schedulePreview?: SchedulePreviewRow[];
};

export type SuccessCardPayload = {
  title: string;
  description?: string;
  /** e.g. "1–2 business days" */
  processingTime: string;
  /** Reassurance line, e.g. "We’ll send a confirmation email shortly." */
  reassuranceMessage: string;
  actionLabel?: string;
};

export type EnrollmentSetupPayload = {
  planOptions: { label: string; value: string }[];
  contributionMin: number;
  contributionMax: number;
  contributionValue: number;
  investmentOptions: string[];
  /** Optional initial insight; component recalculates dynamically */
  insight?: string;
};

export type EnrollmentReviewPayload = {
  plan: string;
  contribution: number;
  investment: string;
  insight?: string;
};

export type WithdrawalSliderPayload = {
  min: number;
  max: number;
  value: number;
  tax: number;
  net: number;
  /** Optional initial insight; component recalculates dynamically */
  insight?: string;
};

/** @deprecated Use WithdrawalSliderPayload for withdrawal flow. */
export type AmountSliderPayload = { min: number; max: number; value: number };

export type InfoCardPayload = {
  message: string;
  /** Optional CTA label. */
  actionLabel?: string;
  /** Structured action to emit when button clicked. */
  action?: CoreAIStructuredPayload;
  /** e.g. 80 for "80% vested" */
  vestedPercent?: number;
  /** Suggestion chips for quick actions. */
  suggestions?: string[];
  /** Contextual guidance (rendered as InsightBox) */
  insight?: string;
};
export type WithdrawalReviewPayload = { amount: number; tax: number; net: number; insight?: string };
export type BalanceCardPayload = {
  total: number;
  vested: number;
  unvested: number;
  insight?: string;
};

/** Bar chart breakdown (vested vs unvested). */
export type ChartCardPayload = Pick<BalanceCardPayload, "vested" | "unvested">;

export type ContributionSliderPayload = {
  min: number;
  max: number;
  value: number;
};

export type InvestmentCardPayload = {
  options: string[];
};

export type PlanSelectionPayload = {
  title: string;
  options: { label: string; value: string }[];
};

export function formatStructuredUserLine(payload: CoreAIStructuredPayload): string {
  switch (payload.action) {
    case "START_LOAN_REVIEW":
      return `Loan review: $${payload.amount.toLocaleString()} · ${payload.tenureMonths} mo`;
    case "loan_simulator_continue":
      return `Loan preview: $${payload.amount.toLocaleString()} · ${payload.tenureMonths} mo`;
    case "selection_card_pick":
      return payload.label;
    case "fees_card_continue":
      return "Continue to documents";
    case "document_upload_card_continue":
      return payload.deferred ? "I'll upload documents later" : "Ready to review";
    case "review_card_submit":
      return "Submit loan application";
    case "SUBMIT_LOAN":
      return "Submit loan application";
    case "success_card_dismiss":
      return "Go to loan center";
    case "enrollment_setup_continue":
      return `${payload.plan} · ${payload.contribution}% · ${payload.investment}`;
    case "enrollment_review_submit":
      return "Submit enrollment";
    case "withdrawal_amount_continue":
      return `Withdraw $${payload.value.toLocaleString()}`;
    case "withdrawal_review_submit":
      return "Submit withdrawal";
    case "vested_dismiss":
      return "Done";
    case "info_card_suggestion":
      return payload.suggestion;
    case "FAQ_DETAIL":
      return `Know more: ${payload.question}`;
    case "enrollment_contribution_continue":
      return `Contribution: ${payload.value}%`;
    case "enrollment_investment_pick":
      return payload.label;
    case "enrollment_plan_pick":
      return payload.label;
  }
}
