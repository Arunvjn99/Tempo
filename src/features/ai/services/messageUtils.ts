import type { ChatMessage } from "@/ui/core-ai/MessageBubble";

let localCounter = 0;

export function assistantMessage(content: string, extra?: Partial<ChatMessage>): ChatMessage {
  return {
    id: `local-ai-${++localCounter}-${Date.now()}`,
    role: "assistant",
    content,
    timestamp: new Date(),
    ...extra,
  };
}
