import { create } from "zustand";
import type { CoreAIStructuredPayload } from "@/core/ai/interactive/types";

/** `string` and `{ prompt }` open Core AI with auto-send; `undefined` / empty opens empty composer. */
export type OpenAIModalInput =
  | string
  | undefined
  | {
      prompt?: string;
      query?: string;
      /** Default true; reserved for future “prefill only” behavior. */
      autoSend?: boolean;
      /** After the modal opens, dispatch once (e.g. `START_LOAN_REVIEW`) so chat state is never blank. */
      structuredAfterOpen?: CoreAIStructuredPayload;
    };

/**
 * Global entry for opening Core AI from the hero search bar (and similar surfaces).
 * Methods are bound from `CoreAIModalProvider` — safe to call after app mount.
 */
export interface AIAssistantStoreState {
  isAIModalOpen: boolean;
  /** Last query passed to `openAIModal` (trimmed), for debugging or UI; cleared on close. */
  query: string;
  openAIModal: (input?: OpenAIModalInput) => void;
  closeAIModal: () => void;
}

export const useAIAssistantStore = create<AIAssistantStoreState>(() => ({
  isAIModalOpen: false,
  query: "",
  openAIModal: () => {},
  closeAIModal: () => {},
}));

export function normalizeOpenAIModalInput(raw?: OpenAIModalInput): {
  text: string;
  openEmpty: boolean;
  structuredAfterOpen?: CoreAIStructuredPayload;
} {
  if (raw === undefined || raw === null) {
    return { text: "", openEmpty: true };
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    return t === "" ? { text: "", openEmpty: true } : { text: t, openEmpty: false };
  }
  const structuredAfterOpen = raw.structuredAfterOpen;
  const t = (raw.prompt ?? raw.query ?? "").trim();
  if (structuredAfterOpen && t === "") {
    return { text: "", openEmpty: true, structuredAfterOpen };
  }
  return {
    text: t,
    openEmpty: t === "",
    ...(structuredAfterOpen ? { structuredAfterOpen } : {}),
  };
}
