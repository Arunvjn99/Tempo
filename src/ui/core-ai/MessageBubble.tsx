import { motion, useReducedMotion } from "framer-motion";
import { CoreAiInteractiveHost } from "./interactive/CoreAiInteractiveHost";
import { MessageActions } from "./MessageActions";
import type { MessageBubbleProps } from "./messageBubbleTypes";
import { AssistantAvatarRow } from "./MessageBubbleAssistantChrome";
import { MessageBubbleContentCard } from "./MessageBubbleContentCard";

export type { ChatAction, ChatMessage } from "./messageBubbleTypes";

export function MessageBubble({
  message,
  speakingId,
  onPlay,
  onAction,
  onSuggestion,
  onInteractiveAction,
}: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isComponent = message.type === "component";
  const wantsInteractive = Boolean(message.interactiveType && onInteractiveAction);
  const hasInteractivePayload = message.interactivePayload != null;
  const interactiveBroken = !isUser && !isComponent && wantsInteractive && !hasInteractivePayload;
  const isInteractive = wantsInteractive && hasInteractivePayload;
  const isSpeaking = speakingId === message.id;
  const reduced = useReducedMotion();

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} group`}>
      <div
        className={`max-w-[85%] sm:max-w-[80%] ${
          isUser
            ? "rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground"
            : "space-y-1 w-full max-w-[85%] sm:max-w-[80%]"
        }`}
      >
        {isUser && (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}

        {!isUser && isComponent && (
          <>
            <AssistantAvatarRow className="mb-1.5" />
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {message.component}
            </motion.div>
          </>
        )}

        {interactiveBroken && message.interactiveType && (
          <>
            <AssistantAvatarRow />
            <div
              role="alert"
              className="rounded-2xl border border-[var(--color-danger)]/40 bg-[var(--color-background)] px-4 py-3 text-sm text-[var(--color-text)]"
            >
              <p className="font-semibold text-[var(--color-danger)]">Could not load this step</p>
              <p className="mt-1 text-xs text-[var(--color-textSecondary)]">
                Missing UI data for{" "}
                <code className="rounded bg-[var(--color-background-tertiary)] px-1">{message.interactiveType}</code>.
                Please try again or use the loan center.
              </p>
            </div>
          </>
        )}

        {!isUser && !isComponent && isInteractive && message.interactiveType && (
          <>
            <AssistantAvatarRow />
            {message.content.trim().length > 0 && (
              <MessageBubbleContentCard
                className="mb-2"
                dataSnippet={message.dataSnippet}
                content={message.content}
                disclaimer={message.disclaimer}
                primaryAction={message.primaryAction}
                secondaryAction={message.secondaryAction}
                suggestions={message.suggestions}
                onAction={onAction}
                onSuggestion={onSuggestion}
              />
            )}

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="w-full"
            >
              <CoreAiInteractiveHost
                type={message.interactiveType}
                payload={message.interactivePayload}
                onStructuredAction={onInteractiveAction!}
              />
            </motion.div>

            {message.content.trim().length > 0 && (
              <MessageActions messageId={message.id} text={message.content} isSpeaking={isSpeaking} onPlay={onPlay} />
            )}
          </>
        )}

        {!isUser && !isComponent && !isInteractive && !interactiveBroken && (
          <>
            <AssistantAvatarRow />
            <MessageBubbleContentCard
              suggestionHoverClass="hover:bg-[var(--color-background)]"
              dataSnippet={message.dataSnippet}
              content={message.content}
              disclaimer={message.disclaimer}
              primaryAction={message.primaryAction}
              secondaryAction={message.secondaryAction}
              suggestions={message.suggestions}
              onAction={onAction}
              onSuggestion={onSuggestion}
            />
            <MessageActions messageId={message.id} text={message.content} isSpeaking={isSpeaking} onPlay={onPlay} />
          </>
        )}
      </div>
    </div>
  );
}
