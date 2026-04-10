import { motion } from "framer-motion";
import { Button } from "@/ui/components/Button";
import type { CoreAIStructuredPayload, EnrollmentReviewPayload } from "@/features/ai/store/interactiveTypes";
import { getPlanInsight } from "@/features/ai/services/insights";
import { InsightBox } from "./InsightBox";

function planLabel(v: string): string {
  if (v === "roth") return "Roth 401k";
  if (v === "traditional") return "Pre-tax (Traditional 401k)";
  return v;
}
function invLabel(v: string): string {
  if (v === "target") return "Target Date Fund";
  if (v === "manual") return "Manual Allocation";
  if (v === "advisor") return "Advisor Recommended";
  return v;
}

export interface EnrollmentReviewCardProps {
  payload: EnrollmentReviewPayload;
  onAction: (payload: CoreAIStructuredPayload) => void;
}

export function EnrollmentReviewCard({ payload, onAction }: EnrollmentReviewCardProps) {
  const insight =
    payload.insight ?? getPlanInsight(payload.plan);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-4 shadow-sm"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-textSecondary)]">
        Review enrollment
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Plan</dt>
          <dd className="font-medium text-[var(--color-text)]">{planLabel(payload.plan)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Contribution</dt>
          <dd className="font-medium text-[var(--color-text)]">{payload.contribution}%</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-[var(--color-textSecondary)]">Investment</dt>
          <dd className="font-medium text-[var(--color-text)]">{invLabel(payload.investment)}</dd>
        </div>
      </dl>
      <InsightBox insight={insight} />
      <Button
        type="button"
        variant="custom"
        size="custom"
        onClick={() => onAction({ action: "enrollment_review_submit" })}
        className="mt-5 w-full rounded-xl bg-primary py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
      >
        Submit enrollment
      </Button>
    </motion.div>
  );
}
