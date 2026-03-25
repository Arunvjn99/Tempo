import { PiggyBank, Landmark } from "lucide-react";
import { useEnrollmentStore } from "@/modules/enrollment/v1/store/useEnrollmentStore";

export type SearchSmartInsightProps = {
  query: string;
};

/**
 * Contextual insight strip driven by query keywords (POC copy; no change to answer engine).
 */
export function SearchSmartInsight({ query }: SearchSmartInsightProps) {
  const contributionPct = useEnrollmentStore((s) => s.contribution);
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const loanish = /\bloans?\b|\bborrow\b|\b401k loan\b/.test(q);
  const contributionish = /\bcontribution\b|\bdeferral\b|\bcontribute\b/.test(q);

  if (loanish) {
    return (
      <div className="search-smart-insight" role="status">
        <div className="search-smart-insight__icon-wrap" aria-hidden>
          <Landmark className="search-smart-insight__icon" />
        </div>
        <div className="search-smart-insight__body">
          <p className="search-smart-insight__eyebrow">Loan insight</p>
          <p className="search-smart-insight__text">
            You can borrow up to <strong>$10,000</strong> based on your vested balance (illustrative — your plan may
            differ).
          </p>
        </div>
      </div>
    );
  }

  if (contributionish) {
    return (
      <div className="search-smart-insight" role="status">
        <div className="search-smart-insight__icon-wrap" aria-hidden>
          <PiggyBank className="search-smart-insight__icon" />
        </div>
        <div className="search-smart-insight__body">
          <p className="search-smart-insight__eyebrow">Your plan</p>
          <p className="search-smart-insight__text">
            Your current contribution is set to <strong>{contributionPct}%</strong> of pay in this session’s
            enrollment preview.
          </p>
        </div>
      </div>
    );
  }

  return null;
}
