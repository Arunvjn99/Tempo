import type { ChatMessage } from "./MessageBubble";

export function getWelcomeMessage(t: (key: string) => string): ChatMessage {
  return {
    id: "welcome",
    role: "assistant",
    content: t("coreAi.welcomeMessage"),
    timestamp: new Date(),
    suggestions: [
      t("coreAi.suggestionEnroll"),
      t("coreAi.suggestionLoan"),
      t("coreAi.suggestionWithdraw"),
      t("coreAi.suggestionVested"),
    ],
  };
}
