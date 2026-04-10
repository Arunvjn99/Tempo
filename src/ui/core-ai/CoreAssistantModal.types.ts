import type { CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";

export interface CoreAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** When set, modal sends this as the first user message and then clears it (e.g. "Ask AI about this plan"). */
  initialPrompt?: string | null;
  /** Called after the initial prompt has been submitted so the parent can clear it. */
  onInitialPromptSent?: () => void;
  /** Increment to focus the composer (hero search → open empty). */
  composerFocusSignal?: number;
  /** When modal is already open, send this message immediately (e.g. second hero search submit). */
  externalSend?: { id: number; text: string } | null;
  onExternalSendConsumed?: () => void;
  /** After open, dispatch structured action once (e.g. `START_LOAN_REVIEW`). */
  pendingStructured?: { id: number; payload: CoreAIStructuredPayload } | null;
  onPendingStructuredConsumed?: () => void;
}
