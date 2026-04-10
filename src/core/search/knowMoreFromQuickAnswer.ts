import type { QuickAnswerResult } from "./answerEngine";
import { useAIAssistantStore } from "@/core/globalStores/aiAssistantStore";

/**
 * Hero / command palette “Know more”: FAQ → Core AI full answer; otherwise auto-send prompt.
 */
export function openKnowMoreForQuickAnswer(answer: QuickAnswerResult, queryTrimmed: string): void {
  if (answer.source === "faq" && answer.faqId) {
    useAIAssistantStore.getState().openAIModal({
      structuredAfterOpen: {
        action: "FAQ_DETAIL",
        faqId: answer.faqId,
        question: answer.question,
      },
    });
    return;
  }
  const prompt = queryTrimmed || answer.question;
  useAIAssistantStore.getState().openAIModal({ prompt, autoSend: true });
}
