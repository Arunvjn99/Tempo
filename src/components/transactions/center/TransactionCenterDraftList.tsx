import { useMemo } from "react";
import { motion } from "framer-motion";
import { FileEdit, Clock, HandCoins, DollarSign, Trash2, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type TransactionCenterDraft = {
  id: string;
  icon: ReactNode;
  description: string;
  savedDate: string;
  progress: number;
  resumeRelativePath: string;
};

export function TransactionCenterDraftList({
  drafts,
  onResume,
}: {
  drafts?: TransactionCenterDraft[];
  onResume: (relativePath: string) => void;
}) {
  const { t } = useTranslation();
  const TC = "transactions.center.";

  const defaultDrafts = useMemo<TransactionCenterDraft[]>(
    () => [
      {
        id: "draft-1",
        icon: <HandCoins className="w-[13px] h-[13px]" />,
        description: t(`${TC}draftLoanDesc`),
        savedDate: "March 7, 2026",
        progress: 40,
        resumeRelativePath: "loan/configuration",
      },
      {
        id: "draft-2",
        icon: <DollarSign className="w-[13px] h-[13px]" />,
        description: t(`${TC}draftWithdrawDesc`),
        savedDate: "March 4, 2026",
        progress: 20,
        resumeRelativePath: "withdraw/type",
      },
    ],
    [t],
  );

  const resolved = drafts ?? defaultDrafts;

  if (resolved.length === 0) {
    return (
      <div className="text-center py-6">
        <FileEdit className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--border)" }} />
        <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", fontWeight: 500 }}>{t(`${TC}draftEmpty`)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {resolved.map((draft, idx) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          className="flex items-center gap-3.5 group transition-all duration-200"
          style={{
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--card-bg)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-text-tertiary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
              color: "var(--color-primary)",
            }}
          >
            {draft.icon}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <p className="truncate" style={{ fontSize: 13, fontWeight: 600, color: "var(--foreground)" }}>
                {draft.description}
              </p>
              <span
                className="flex-shrink-0"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: "color-mix(in srgb, var(--color-primary) 14%, var(--background))",
                  color: "var(--color-primary)",
                }}
              >
                {t(`${TC}draftBadge`)}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Clock className="w-3 h-3" style={{ color: "var(--color-text-tertiary)" }} />
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 500 }}>{draft.savedDate}</span>
              <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontWeight: 500 }}>
                · {t(`${TC}draftProgress`, { progress: draft.progress })}
              </span>
            </div>

            <div className="mt-2.5 overflow-hidden" style={{ height: 6, borderRadius: 3, background: "var(--border)" }}>
              <div
                className="h-full transition-all duration-[400ms] ease-in-out"
                style={{
                  width: `${draft.progress}%`,
                  borderRadius: 3,
                  background: "linear-gradient(90deg, var(--color-primary), var(--color-primary))",
                }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              type="button"
              onClick={() => onResume(draft.resumeRelativePath)}
              className="flex items-center justify-center transition-all duration-200"
              title={t(`${TC}resumeAria`)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                color: "var(--color-primary)",
              }}
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center transition-all duration-200"
              title={t(`${TC}deleteAria`)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg)",
                color: "var(--color-text-secondary)",
              }}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
