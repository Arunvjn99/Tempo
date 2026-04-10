import * as React from "react";
import { useShallow } from "zustand/react/shallow";
import { CoreAssistantModal } from "@/ui/core-ai/CoreAssistantModal";
import { CORE_AI_SEARCH_EVENT, OPEN_AI_ASSISTANT_EVENT } from "@/core/search/aiBridge";
import { useAIAssistantStore, type OpenAIModalInput } from "@/core/globalStores/aiAssistantStore";

export interface CoreAIModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  openWithPrompt: (prompt: string) => void;
  initialPrompt: string | null;
  clearInitialPrompt: () => void;
  openAIModal: (input?: OpenAIModalInput) => void;
}

export function useCoreAIModal(): CoreAIModalContextValue {
  return useAIAssistantStore(
    useShallow((s) => ({
      isOpen: s.isAIModalOpen,
      open: s.open,
      close: s.close,
      openWithPrompt: s.openWithPrompt,
      initialPrompt: s.initialPrompt,
      clearInitialPrompt: s.clearInitialPrompt,
      openAIModal: s.openAIModal,
    })),
  );
}

export function useCoreAIModalOptional(): CoreAIModalContextValue | null {
  return useCoreAIModal();
}

/** Mounts Core AI modal + window listeners. No React context — state lives in {@link useAIAssistantStore}. */
export function CoreAIModalProvider({ children }: { children: React.ReactNode }) {
  const isOpen = useAIAssistantStore((s) => s.isAIModalOpen);
  const initialPrompt = useAIAssistantStore((s) => s.initialPrompt);
  const composerFocusTick = useAIAssistantStore((s) => s.composerFocusTick);
  const pendingSend = useAIAssistantStore((s) => s.pendingSend);
  const pendingStructured = useAIAssistantStore((s) => s.pendingStructured);
  const close = useAIAssistantStore((s) => s.close);
  const clearInitialPrompt = useAIAssistantStore((s) => s.clearInitialPrompt);
  const consumePendingSend = useAIAssistantStore((s) => s.consumePendingSend);
  const consumePendingStructured = useAIAssistantStore((s) => s.consumePendingStructured);

  React.useEffect(() => {
    const onOpenAssistant = () => {
      useAIAssistantStore.getState().open();
    };

    const onCoreAISearch = (e: Event) => {
      const prompt = (e as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) return;
      useAIAssistantStore.getState().openWithPrompt(prompt.trim());
    };

    window.addEventListener(OPEN_AI_ASSISTANT_EVENT, onOpenAssistant);
    window.addEventListener(CORE_AI_SEARCH_EVENT, onCoreAISearch as EventListener);
    return () => {
      window.removeEventListener(OPEN_AI_ASSISTANT_EVENT, onOpenAssistant);
      window.removeEventListener(CORE_AI_SEARCH_EVENT, onCoreAISearch as EventListener);
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      useAIAssistantStore.setState({ query: "" });
    }
  }, [isOpen]);

  return (
    <>
      {children}
      {isOpen ? (
        <CoreAssistantModal
          isOpen
          onClose={close}
          initialPrompt={initialPrompt}
          onInitialPromptSent={clearInitialPrompt}
          composerFocusSignal={composerFocusTick}
          externalSend={pendingSend}
          onExternalSendConsumed={consumePendingSend}
          pendingStructured={pendingStructured}
          onPendingStructuredConsumed={consumePendingStructured}
        />
      ) : null}
    </>
  );
}
