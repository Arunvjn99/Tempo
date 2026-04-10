import type { ReactNode } from "react";
import type { CoreAIInteractiveMessageType, CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";

export interface ChatAction {
  label: string;
  route: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  type?: "text" | "component";
  content: string;
  timestamp: Date;
  dataSnippet?: string;
  disclaimer?: string;
  primaryAction?: ChatAction;
  secondaryAction?: ChatAction;
  suggestions?: string[];
  component?: ReactNode;
  interactiveType?: CoreAIInteractiveMessageType;
  interactivePayload?: unknown;
}

export interface MessageBubbleProps {
  message: ChatMessage;
  speakingId: string | null;
  onPlay: (messageId: string) => void;
  onAction: (route: string) => void;
  onSuggestion?: (text: string) => void;
  onInteractiveAction?: (payload: CoreAIStructuredPayload) => void;
}
