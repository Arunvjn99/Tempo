import { useCallback } from "react";
import type { NavigateFunction } from "react-router-dom";
import { CORE_AI_LOAN_APPLY_ROUTE } from "@/features/ai/store/flowTypes";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";
import type { ChatMessage } from "./MessageBubble";
import type { useTextToSpeech } from "./useTextToSpeech";
import type { useSpeechRecognition } from "./useSpeechRecognition";

type Tts = ReturnType<typeof useTextToSpeech>;
type Speech = ReturnType<typeof useSpeechRecognition>;

interface HandlersParams {
  navigate: NavigateFunction;
  pathname: string;
  onClose: () => void;
  messages: ChatMessage[];
  tts: Tts;
  speech: Speech;
  handleSend: (text: string) => void;
}

export function useCoreAssistantModalHandlers({
  navigate,
  pathname,
  onClose,
  messages,
  tts,
  speech,
  handleSend,
}: HandlersParams) {
  const handleAction = useCallback(
    (route: string) => {
      if (route === CORE_AI_LOAN_APPLY_ROUTE) {
        const v = getRoutingVersion(pathname);
        navigate(withVersionIfEnrollment(v, "/transactions/loan/configuration"));
        onClose();
        return;
      }
      navigate(route);
      onClose();
    },
    [navigate, onClose, pathname],
  );

  const handleMicClick = useCallback(() => {
    if (speech.isListening) speech.stopListening();
    else speech.startListening();
  }, [speech]);

  const handlePlay = useCallback(
    (messageId: string) => {
      const msg = messages.find((m) => m.id === messageId);
      if (!msg) return;
      tts.speak(messageId, msg.content);
    },
    [messages, tts],
  );

  const handleSuggestion = useCallback(
    (text: string) => {
      handleSend(text);
    },
    [handleSend],
  );

  return { handleAction, handleMicClick, handlePlay, handleSuggestion };
}
