import { useTranslation } from "react-i18next";

export function CoreAssistantModalFooter() {
  const { t } = useTranslation();
  return (
    <div className="shrink-0 border-t border-[var(--color-border)] px-5 py-2">
      <p className="text-[10px] text-[var(--color-textSecondary)] text-center">{t("coreAi.disclaimer")}</p>
    </div>
  );
}
