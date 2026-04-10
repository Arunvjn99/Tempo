import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import type { NavigateFunction } from "react-router-dom";
import { getRoutingVersion, withVersionIfEnrollment } from "@/core/version";
import { buildActionHandlers } from "@/core/search/actionHandlers";
import { handleLocalAI } from "@/features/ai/services/handleLocalAI";
import { formatStructuredUserLine, type CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";
import { assistantMessage } from "@/features/ai/services/messageUtils";
import type { LocalFlowState } from "@/features/ai/store/flowTypes";
import { useTransactionStore } from "@/features/transactions/store";
import { nextMessageId } from "./coreAssistantIds";
import type { ChatMessage } from "./MessageBubble";

export interface RunCoreAssistantTurnParams {
  text: string;
  structured: CoreAIStructuredPayload | null;
  pathname: string;
  navigate: NavigateFunction;
  onClose: () => void;
  flowStateRef: MutableRefObject<LocalFlowState | null>;
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  setIsLoading: (v: boolean) => void;
  isLoadingRef: MutableRefObject<boolean>;
}

export function runCoreAssistantTurn({
  text,
  structured,
  pathname,
  navigate,
  onClose,
  flowStateRef,
  setMessages,
  setIsLoading,
  isLoadingRef,
}: RunCoreAssistantTurnParams): void {
  const trimmed = text.trim();
  if (isLoadingRef.current) return;
  if (!structured && !trimmed) return;

  if (import.meta.env.DEV && structured) {
    console.log("DISPATCHING ACTION", structured);
  }

  const userContent = structured ? formatStructuredUserLine(structured) : trimmed;

  const userMsg: ChatMessage = {
    id: nextMessageId(),
    role: "user",
    content: userContent,
    timestamp: new Date(),
  };

  setMessages((prev) => {
    const updated = prev.map((m) => (m.suggestions ? { ...m, suggestions: undefined } : m));
    return [...updated, userMsg];
  });

  setIsLoading(true);
  isLoadingRef.current = true;

  const routeVersion = getRoutingVersion(pathname);
  const local = handleLocalAI(structured ? "" : trimmed, flowStateRef.current, structured);
  flowStateRef.current = local.nextState;

      if (local.loanApplyPayload) {
        const p = local.loanApplyPayload;
        useTransactionStore.getState().applyLoanAssistantPrefill({
          amount: p.amount,
          purpose: p.purpose,
          loanType: p.loanType,
          targetActiveStep: 2,
        });
      }

  let toAppend = local.messages;
  if (toAppend.length === 0 && !local.navigate && !local.action && (structured || trimmed)) {
    toAppend = [
      assistantMessage(
        "I couldn’t show that step in chat. Say **apply loan** to continue here, or open **Transactions** → **Loan**.",
        { suggestions: ["Apply for a loan"] },
      ),
    ];
  }
  if (import.meta.env.DEV) {
    console.log(
      "UPDATED MESSAGES",
      toAppend.length,
      toAppend.map((m) => ({ id: m.id, role: m.role, contentLen: m.content?.length ?? 0 })),
    );
  }
  setMessages((prev) => [...prev, ...toAppend]);

  if (import.meta.env.DEV && local.messages.length > 0) {
    console.debug(
      "[CoreAI] response messages",
      local.messages.map((m) => ({
        id: m.id,
        interactiveType: m.interactiveType,
        contentLen: m.content?.length ?? 0,
      })),
    );
  }

  const handlers = buildActionHandlers(navigate, routeVersion);
  if (local.navigate) {
    navigate(withVersionIfEnrollment(routeVersion, local.navigate));
    onClose();
  } else if (local.action && handlers[local.action]) {
    handlers[local.action]();
    onClose();
  }

  setIsLoading(false);
  isLoadingRef.current = false;
}
