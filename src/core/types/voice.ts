/**
 * Voice Mode Type Definitions
 * Strict state unions and task types for agentic voice interaction
 */

export const UIState = {
  IDLE: "IDLE",
  LISTENING: "LISTENING",
  THINKING: "THINKING",
  SPEAKING: "SPEAKING",
  AWAITING_INPUT: "AWAITING_INPUT",
  CONFIRMATION_REQUIRED: "CONFIRMATION_REQUIRED",
  COMPLETED: "COMPLETED",
  ERROR: "ERROR",
} as const;
export type UIState = (typeof UIState)[keyof typeof UIState];

export const AgentState = {
  IDLE: "IDLE",
  TASK_SELECTION: "TASK_SELECTION",
  TASK_IN_PROGRESS: "TASK_IN_PROGRESS",
  CONFIRMATION: "CONFIRMATION",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  ERROR: "ERROR",
} as const;
export type AgentState = (typeof AgentState)[keyof typeof AgentState];

export const TaskType = {
  ENROLLMENT: "ENROLLMENT",
  LOAN: "LOAN",
  POST_ENROLLMENT_HELP: "POST_ENROLLMENT_HELP",
  GENERAL_QA: "GENERAL_QA",
} as const;
export type TaskType = (typeof TaskType)[keyof typeof TaskType];

export interface VoiceMessage {
  id: string;
  type: "agent" | "user";
  text: string;
  timestamp: Date;
  quickReplies?: string[];
}

export interface VoiceTask {
  type: TaskType;
  startedAt: Date;
  data?: Record<string, unknown>;
}

export interface VoiceState {
  uiState: UIState;
  agentState: AgentState;
  currentTask: TaskType | null;
  messages: VoiceMessage[];
  lastUserInput: string;
  confirmationPhrase?: string;
  errorMessage?: string;
}
