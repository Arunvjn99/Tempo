import type { CoreAIInteractiveMessageType, CoreAIStructuredPayload ,
  BalanceCardPayload,
  DocumentUploadCardPayload,
  EnrollmentReviewPayload,
  EnrollmentSetupPayload,
  FeesCardPayload,
  InfoCardPayload,
  LoanSimulatorCardPayload,
  ReviewCardPayload,
  SelectionCardPayload,
  SuccessCardPayload,
  WithdrawalReviewPayload,
  WithdrawalSliderPayload,
} from "@/features/ai/store/interactiveTypes";
import { BalanceCard } from "./BalanceCard";
import { DocumentUploadCard } from "./DocumentUploadCard";
import { EnrollmentReviewCard } from "./EnrollmentReviewCard";
import { EnrollmentSetupCard } from "./EnrollmentSetupCard";
import { FeesCard } from "./FeesCard";
import { InfoCard } from "./InfoCard";
import { LoanSimulatorCard } from "./LoanSimulatorCard";
import { LoanSuccessCard } from "./LoanSuccessCard";
import { ReviewCard } from "./ReviewCard";
import { SelectionCard } from "./SelectionCard";
import { WithdrawalReviewCard } from "./WithdrawalReviewCard";
import { WithdrawalSliderCard } from "./WithdrawalSliderCard";

export interface CoreAiInteractiveHostProps {
  type: CoreAIInteractiveMessageType;
  payload: unknown;
  onStructuredAction: (payload: CoreAIStructuredPayload) => void;
}

function InteractiveFallback({ type }: { type: string }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-[var(--color-danger)]/40 bg-[var(--color-background)] p-4 text-sm text-[var(--color-text)]"
    >
      <p className="font-semibold text-[var(--color-danger)]">Something went wrong</p>
      <p className="mt-1 text-[var(--color-textSecondary)]">
        This step could not load (unknown or missing UI: <code className="text-xs">{type || "(none)"}</code>). Try
        closing and reopening Core AI, or continue in the loan center.
      </p>
    </div>
  );
}

export function CoreAiInteractiveHost({ type, payload, onStructuredAction }: CoreAiInteractiveHostProps) {
  switch (type) {
    case "loan_simulator_card":
      return <LoanSimulatorCard payload={payload as LoanSimulatorCardPayload} onAction={onStructuredAction} />;
    case "selection_card":
      return <SelectionCard payload={payload as SelectionCardPayload} onAction={onStructuredAction} />;
    case "fees_card":
      return <FeesCard payload={payload as FeesCardPayload} onAction={onStructuredAction} />;
    case "document_upload_card":
      return <DocumentUploadCard payload={payload as DocumentUploadCardPayload} onAction={onStructuredAction} />;
    case "review_card":
    case "loan_review_card":
      return <ReviewCard payload={payload as ReviewCardPayload} onAction={onStructuredAction} />;
    case "success_card":
    case "loan_success_card":
      return (
        <LoanSuccessCard
          payload={payload as SuccessCardPayload}
          onAction={onStructuredAction}
          enableConfetti
        />
      );
    case "enrollment_setup_card":
      return <EnrollmentSetupCard payload={payload as EnrollmentSetupPayload} onAction={onStructuredAction} />;
    case "enrollment_review_card":
      return <EnrollmentReviewCard payload={payload as EnrollmentReviewPayload} onAction={onStructuredAction} />;
    case "withdrawal_slider_card":
      return <WithdrawalSliderCard payload={payload as WithdrawalSliderPayload} onAction={onStructuredAction} />;
    case "withdrawal_review_card":
      return <WithdrawalReviewCard payload={payload as WithdrawalReviewPayload} onAction={onStructuredAction} />;
    case "info_card":
      return <InfoCard payload={payload as InfoCardPayload} onAction={onStructuredAction} />;
    case "balance_card":
      return <BalanceCard payload={payload as BalanceCardPayload} />;
    default:
      if (import.meta.env.DEV) {
        console.warn("[CoreAiInteractiveHost] Unhandled interactive type:", type);
      }
      return <InteractiveFallback type={String(type)} />;
  }
}
