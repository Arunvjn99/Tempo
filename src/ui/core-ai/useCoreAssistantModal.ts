import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";
import type { LocalFlowState } from "@/features/ai/store/flowTypes";
import { useSpeechRecognition } from "./useSpeechRecognition";
import { useTextToSpeech } from "./useTextToSpeech";
import { runCoreAssistantTurn } from "./coreAssistantTurn";
import { useCoreAssistantModalEffects } from "./useCoreAssistantModalEffects";
import { useCoreAssistantModalHandlers } from "./coreAssistantModalHandlers";
import type { ChatMessage } from "./MessageBubble";
import type { CoreAssistantModalProps } from "./CoreAssistantModal.types";

export function useCoreAssistantModal({
  isOpen,
  onClose,
  initialPrompt,
  onInitialPromptSent,
  composerFocusSignal = 0,
  externalSend = null,
  onExternalSendConsumed,
  pendingStructured = null,
  onPendingStructuredConsumed,
}: CoreAssistantModalProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const flowStateRef = useRef<LocalFlowState | null>(null);
  const prevOpenRef = useRef(false);
  const initialPromptSentRef = useRef(false);
  const lastExternalSendIdRef = useRef<number | null>(null);
  const lastPendingStructuredIdRef = useRef<number | null>(null);
  const handleInteractiveActionRef = useRef<(payload: CoreAIStructuredPayload) => void>(() => {});
  const handleSendRef = useRef<(text: string) => void>(() => {});
  const isLoadingRef = useRef(false);

  const tts = useTextToSpeech();
  const speech = useSpeechRecognition({
    onResult: (transcript: string) => {
      handleSendRef.current(transcript);
    },
  });

  useCoreAssistantModalEffects({
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
  });

  const runTurn = useCallback(
    (text: string, structured: CoreAIStructuredPayload | null) => {
      runCoreAssistantTurn({
        text,
        structured,
        pathname: location.pathname,
        navigate,
        onClose,
        flowStateRef,
        setMessages,
        setIsLoading,
        isLoadingRef,
      });
    },
    [navigate, onClose, location.pathname],
  );

  const handleSend = useCallback(
    (text: string) => {
      runTurn(text, null);
    },
    [runTurn],
  );

  const handleInteractiveAction = useCallback(
    (structured: CoreAIStructuredPayload) => {
      runTurn("", structured);
    },
    [runTurn],
  );

  useEffect(() => {
    handleInteractiveActionRef.current = handleInteractiveAction;
  }, [handleInteractiveAction]);

  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const { handleAction, handleMicClick, handlePlay, handleSuggestion } = useCoreAssistantModalHandlers({
    navigate,
    pathname: location.pathname,
    onClose,
    messages,
    tts,
    speech,
    handleSend,
  });

  return {
    t,
    messages,
    isLoading,
    flowStateRef,
    tts,
    speech,
    handleSend,
    handleInteractiveAction,
    handleAction,
    handleMicClick,
    handlePlay,
    handleSuggestion,
    composerFocusSignal,
  };
}
