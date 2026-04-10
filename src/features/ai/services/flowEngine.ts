import type { CoreAIStructuredPayload } from "../store/interactiveTypes";
import type { LocalAIResult, LocalFlowState } from "../store/flowTypes";
import { enrollmentFlow } from "./flows/enrollmentFlow";
import { loanFlow } from "./flows/loanFlow";
import { vestingFlow } from "./flows/vestingFlow";
import { withdrawalFlow } from "./flows/withdrawalFlow";

export function runFlow(
  state: LocalFlowState,
  input: string,
  structured: CoreAIStructuredPayload | null = null,
): LocalAIResult {
  switch (state.type) {
    case "loan":
      return loanFlow(state, input, structured);
    case "withdrawal":
      return withdrawalFlow(state, input, structured);
    case "enrollment":
      return enrollmentFlow(state, input, structured);
    case "vesting":
      return vestingFlow(state, input, structured);
    default:
      return { messages: [], nextState: null };
  }
}
