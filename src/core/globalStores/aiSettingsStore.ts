import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const STORAGE_KEY = "participant_portal_ai_settings";

export interface AISettingsState {
  coreAIEnabled: boolean;
  insightsEnabled: boolean;
}

const DEFAULT_STATE: AISettingsState = {
  coreAIEnabled: true,
  insightsEnabled: true,
};

type AISettingsStore = AISettingsState & {
  setCoreAIEnabled: (enabled: boolean) => void;
  setInsightsEnabled: (enabled: boolean) => void;
};

export const useAISettingsStore = create<AISettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_STATE,
      setCoreAIEnabled: (coreAIEnabled: boolean) => set({ coreAIEnabled }),
      setInsightsEnabled: (insightsEnabled: boolean) => set({ insightsEnabled }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
