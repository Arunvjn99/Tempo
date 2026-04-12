import { motion } from "motion/react";
import {
  FileEdit,
  Clock,
  HandCoins,
  DollarSign,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Draft {
  id: string;
  type: "Loan" | "Withdrawal" | "Transfer" | "Rollover";
  icon: React.ReactNode;
  description: string;
  savedDate: string;
  progress: number;
  resumePath: string;
}

const mockDrafts: Draft[] = [
  {
    id: "draft-1",
    type: "Loan",
    icon: <HandCoins className="h-[13px] w-[13px]" />,
    description: "General Purpose Loan — $3,500",
    savedDate: "March 7, 2026",
    progress: 40,
    resumePath: "/transactions/loan",
  },
  {
    id: "draft-2",
    type: "Withdrawal",
    icon: <DollarSign className="h-[13px] w-[13px]" />,
    description: "Hardship Withdrawal — Medical",
    savedDate: "March 4, 2026",
    progress: 20,
    resumePath: "/transactions/withdrawal",
  },
];

export function DraftTransactions() {
  const navigate = useNavigate();

  if (mockDrafts.length === 0) {
    return (
      <div className="py-6 text-center">
        <FileEdit className="mx-auto mb-2 h-8 w-8 text-border" />
        <p className="text-[13px] font-medium text-secondary">No draft transactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mockDrafts.map((draft, idx) => (
        <motion.div
          key={draft.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, duration: 0.3 }}
          className="group flex items-center gap-3.5 rounded-xl border border-default bg-background px-4 py-3.5 transition-all duration-200"
        >
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[var(--color-primary)]">
            {draft.icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-center gap-2">
              <p className="truncate text-[13px] font-semibold text-primary">{draft.description}</p>
              <span className="shrink-0 rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-[var(--color-primary)]">
                Draft
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-border" />
              <span className="text-[11px] font-medium text-secondary">{draft.savedDate}</span>
              <span className="text-[11px] font-medium text-secondary">
                · {draft.progress}% complete
              </span>
            </div>

            <div className="mt-2.5 h-1.5 overflow-hidden rounded-sm bg-border">
              <div
                className="h-full rounded-sm bg-gradient-to-r from-primary to-primary/80 transition-all duration-[400ms] ease-in-out"
                style={{ width: `${draft.progress}%` }}
              />
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={() => navigate(draft.resumePath)}
              title="Resume"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-default bg-background text-[var(--color-primary)] transition-colors hover:bg-primary/10"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              title="Delete"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-default bg-background text-secondary transition-colors hover:text-primary"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
