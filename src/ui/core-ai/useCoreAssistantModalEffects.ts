import {
  useEffect,
  useLayoutEffect,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";
import type { CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";
import type { LocalFlowState } from "@/features/ai/store/flowTypes";
import type { ChatMessage } from "./MessageBubble";
import { getWelcomeMessage } from "./coreAssistantWelcome";
import type { useTextToSpeech } from "./useTextToSpeech";
import type { useSpeechRecognition } from "./useSpeechRecognition";

type Tts = ReturnType<typeof useTextToSpeech>;
type Speech = ReturnType<typeof useSpeechRecognition>;

interface UseCoreAssistantModalEffectsParams {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  speech: Speech;
  tts: Tts;
  initialPrompt?: string | null;
  onInitialPromptSent?: () => void;
  externalSend: { id: number; text: string } | null;
  onExternalSendConsumed?: () => void;
  pendingStructured: { id: number; payload: CoreAIStructuredPayload } | null;
  onPendingStructuredConsumed?: () => void;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setIsLoading: (v: boolean) => void;
  isLoadingRef: MutableRefObject<boolean>;
  flowStateRef: MutableRefObject<LocalFlowState | null>;
  handleSendRef: MutableRefObject<(text: string) => void>;
  handleInteractiveActionRef: MutableRefObject<(payload: CoreAIStructuredPayload) => void>;
  initialPromptSentRef: MutableRefObject<boolean>;
  lastExternalSendIdRef: MutableRefObject<number | null>;
  lastPendingStructuredIdRef: MutableRefObject<number | null>;
  prevOpenRef: MutableRefObject<boolean>;
}

export function useCoreAssistantModalEffects(p: UseCoreAssistantModalEffectsParams) {
  const {
    isOpen,
    onClose,
    t,
    speech,
    tts,
    initialPrompt,
    onInitialPromptSent,
    externalSend,
    onExternalSendConsumed,
    pendingStructured,
    onPendingStructuredConsumed,
    setMessages,
    setIsLoading,
    isLoadingRef,
    flowStateRef,
    handleSendRef,
    handleInteractiveActionRef,
    initialPromptSentRef,
    lastExternalSendIdRef,
    lastPendingStructuredIdRef,
    prevOpenRef,
  } = p;

  useLayoutEffect(() => {
    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (isOpen && !wasOpen) {
      initialPromptSentRef.current = false;
      lastExternalSendIdRef.current = null;
      setMessages([getWelcomeMessage(t)]);
      setIsLoading(false);
      isLoadingRef.current = false;
      flowStateRef.current = null;
      lastPendingStructuredIdRef.current = null;
      tts.stop();
    } else if (!isOpen && wasOpen) {
      speech.stopListening();
      tts.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !initialPrompt?.trim() || initialPromptSentRef.current) return;
    const prompt = initialPrompt.trim();
    initialPromptSentRef.current = true;
    onInitialPromptSent?.();
    let cancelled = false;
    const id = window.setTimeout(() => {
      if (!cancelled) handleSendRef.current(prompt);
    }, 10);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [isOpen, initialPrompt, onInitialPromptSent]);

  useEffect(() => {
    if (!isOpen || !externalSend?.text.trim()) return;
    if (lastExternalSendIdRef.current === externalSend.id) return;
    lastExternalSendIdRef.current = externalSend.id;
    onExternalSendConsumed?.();
    const text = externalSend.text.trim();
    const id = window.setTimeout(() => {
      handleSendRef.current(text);
    }, 10);
    return () => window.clearTimeout(id);
  }, [isOpen, externalSend, onExternalSendConsumed]);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !pendingStructured) return;
    if (import.meta.env.DEV) console.log("MODAL RECEIVED", pendingStructured.payload);
    const myId = pendingStructured.id;
    if (lastPendingStructuredIdRef.current === myId) return;
    lastPendingStructuredIdRef.current = myId;
    const payload = pendingStructured.payload;
    let done = false;
    const tid = window.setTimeout(() => {
      handleInteractiveActionRef.current(payload);
      done = true;
      onPendingStructuredConsumed?.();
    }, 100);
    return () => {
      window.clearTimeout(tid);
      if (!done) lastPendingStructuredIdRef.current = null;
    };
  }, [isOpen, pendingStructured, onPendingStructuredConsumed]);
}
