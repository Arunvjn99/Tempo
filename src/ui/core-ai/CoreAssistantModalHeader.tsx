import type { MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import type { LocalFlowState } from "@/features/ai/store/flowTypes";
import { CoreAiBrandMark } from "./CoreAiBrandMark";

interface CoreAssistantModalHeaderProps {
  flowStateRef: MutableRefObject<LocalFlowState | null>;
  onClose: () => void;
}

export function CoreAssistantModalHeader({ flowStateRef, onClose }: CoreAssistantModalHeaderProps) {
  const { t } = useTranslation();
  const flow = flowStateRef.current;

  return (
    <div className="shrink-0 flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <CoreAiBrandMark />
        <div className="min-w-0">
          <h2 className="truncate text-sm font-semibold text-[var(--color-text)]">{t("coreAi.headerTitle")}</h2>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)]" aria-hidden />
            <span className="text-[11px] text-[var(--color-textSecondary)]">
              {flow
                ? t("coreAi.statusFlow", {
                    type: flow.type.charAt(0).toUpperCase() + flow.type.slice(1),
                  })
                : t("coreAi.statusOnline")}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
        aria-label={t("coreAi.closeAria")}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
