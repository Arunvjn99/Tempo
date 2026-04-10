import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { useCoreAssistantModal } from "./useCoreAssistantModal";
import { CoreAssistantModalHeader } from "./CoreAssistantModalHeader";
import { CoreAssistantModalFooter } from "./CoreAssistantModalFooter";
import type { CoreAssistantModalProps } from "./CoreAssistantModal.types";

export type { CoreAssistantModalProps };

export function CoreAssistantModal(props: CoreAssistantModalProps) {
  const { isOpen } = props;
  const { t } = useTranslation();
  const m = useCoreAssistantModal(props);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center">
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={props.onClose}
            aria-hidden
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10 flex flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl bg-[var(--color-surface)] text-[var(--color-text)] shadow-2xl w-full sm:w-[min(640px,calc(100vw-2rem))] md:w-[min(720px,calc(100vw-2rem))] h-[calc(100dvh-1rem)] sm:h-[min(620px,calc(100dvh-3rem))]"
            role="dialog"
            aria-modal="true"
            aria-label={t("coreAi.modalAria")}
          >
            <CoreAssistantModalHeader flowStateRef={m.flowStateRef} onClose={props.onClose} />
            <MessageList
              messages={m.messages}
              speakingId={m.tts.speakingId}
              isLoading={m.isLoading}
              onPlay={m.handlePlay}
              onAction={m.handleAction}
              onSuggestion={m.handleSuggestion}
              onInteractiveAction={m.handleInteractiveAction}
            />
            <MessageInput
              onSend={m.handleSend}
              isListening={m.speech.isListening}
              isProcessing={m.speech.isProcessing}
              onMicClick={m.handleMicClick}
              disabled={m.isLoading}
              composerFocusSignal={m.composerFocusSignal}
            />
            <CoreAssistantModalFooter />
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
