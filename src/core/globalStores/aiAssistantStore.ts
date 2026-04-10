import { create } from "zustand";
import type { CoreAIStructuredPayload } from "@/features/ai/store/interactiveTypes";

/** `string` and `{ prompt }` open Core AI with auto-send; `undefined` / empty opens empty composer. */
export type OpenAIModalInput =
  | string
  | undefined
  | {
      prompt?: string;
      query?: string;
      autoSend?: boolean;
      structuredAfterOpen?: CoreAIStructuredPayload;
    };

export function normalizeOpenAIModalInput(raw?: OpenAIModalInput): {
  text: string;
  openEmpty: boolean;
  structuredAfterOpen?: CoreAIStructuredPayload;
} {
  if (raw === undefined || raw === null) {
    return { text: "", openEmpty: true };
  }
  if (typeof raw === "string") {
    const t = raw.trim();
    return t === "" ? { text: "", openEmpty: true } : { text: t, openEmpty: false };
  }
  const structuredAfterOpen = raw.structuredAfterOpen;
  const t = (raw.prompt ?? raw.query ?? "").trim();
  if (structuredAfterOpen && t === "") {
    return { text: "", openEmpty: true, structuredAfterOpen };
  }
  return {
    text: t,
    openEmpty: t === "",
    ...(structuredAfterOpen ? { structuredAfterOpen } : {}),
  };
}

type PendingOpen = {
  text: string;
  openEmpty: boolean;
  structuredAfterOpen?: CoreAIStructuredPayload;
};

export interface AIAssistantStoreState {
  isAIModalOpen: boolean;
  query: string;
  initialPrompt: string | null;
  composerFocusTick: number;
  pendingSend: { id: number; text: string } | null;
  pendingStructured: { id: number; payload: CoreAIStructuredPayload } | null;
  openDebounceId: ReturnType<typeof setTimeout> | null;
  pendingOpen: PendingOpen | null;

  open: () => void;
  close: () => void;
  openWithPrompt: (prompt: string) => void;
  clearInitialPrompt: () => void;
  openAIModal: (input?: OpenAIModalInput) => void;
  closeAIModal: () => void;
  consumePendingSend: () => void;
  consumePendingStructured: () => void;
}

let isOpenRef = false;

export const useAIAssistantStore = create<AIAssistantStoreState>((set, get) => {
  const closeModal = () => {
    const id = get().openDebounceId;
    if (id) clearTimeout(id);
    isOpenRef = false;
    set({
      isAIModalOpen: false,
      openDebounceId: null,
      initialPrompt: null,
      pendingSend: null,
      pendingStructured: null,
      pendingOpen: null,
      query: "",
    });
  };

  return {
    isAIModalOpen: false,
    query: "",
    initialPrompt: null,
    composerFocusTick: 0,
    pendingSend: null,
    pendingStructured: null,
    openDebounceId: null,
    pendingOpen: null,

    clearInitialPrompt: () => set({ initialPrompt: null }),

    close: closeModal,
    closeAIModal: closeModal,

    open: () => {
      set({ initialPrompt: null });
      if (isOpenRef) {
        set((s) => ({ composerFocusTick: s.composerFocusTick + 1 }));
        return;
      }
      isOpenRef = true;
      set({ isAIModalOpen: true });
    },

    openWithPrompt: (prompt: string) => {
      const p = prompt.trim();
      if (!p) return;
      if (isOpenRef) {
        set({ pendingSend: { id: Date.now(), text: p } });
      } else {
        isOpenRef = true;
        set({ initialPrompt: p, isAIModalOpen: true });
      }
    },

    openAIModal: (raw?: OpenAIModalInput) => {
      const { text, openEmpty, structuredAfterOpen } = normalizeOpenAIModalInput(raw);
      if (import.meta.env.DEV) {
        console.log("OPEN AI MODAL PAYLOAD", structuredAfterOpen);
      }
      set({ query: text, pendingOpen: { text, openEmpty, structuredAfterOpen } });

      const prev = get().openDebounceId;
      if (prev) clearTimeout(prev);
      const tid = setTimeout(() => {
        const pending = get().pendingOpen;
        set({ openDebounceId: null, pendingOpen: null });
        const q = pending?.text ?? "";
        const empty = pending?.openEmpty ?? true;
        const struct = pending?.structuredAfterOpen;
        const openNow = isOpenRef;

        if (empty && q === "" && struct) {
          if (import.meta.env.DEV) {
            console.log("MODAL RECEIVED", struct);
          }
          set({
            initialPrompt: null,
            pendingSend: null,
            pendingStructured: { id: Date.now(), payload: struct },
          });
          if (openNow) {
            set((s) => ({ composerFocusTick: s.composerFocusTick + 1 }));
          } else {
            isOpenRef = true;
            set({ isAIModalOpen: true });
          }
          return;
        }

        set({ pendingStructured: null });

        if (empty) {
          set({ initialPrompt: null });
          if (openNow) {
            set((s) => ({ composerFocusTick: s.composerFocusTick + 1 }));
          } else {
            isOpenRef = true;
            set({ isAIModalOpen: true });
            queueMicrotask(() => {
              useAIAssistantStore.setState((s) => ({ composerFocusTick: s.composerFocusTick + 1 }));
            });
          }
          return;
        }

        if (openNow) {
          set({ pendingSend: { id: Date.now(), text: q } });
        } else {
          isOpenRef = true;
          set({ initialPrompt: q, isAIModalOpen: true });
        }
      }, 0);
      set({ openDebounceId: tid });
    },

    consumePendingSend: () => set({ pendingSend: null }),
    consumePendingStructured: () => set({ pendingStructured: null }),
  };
});

useAIAssistantStore.subscribe((s) => {
  isOpenRef = s.isAIModalOpen;
});
