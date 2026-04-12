import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { TrendingUp, DollarSign, Calendar, AlertTriangle } from "lucide-react";

export function FinancialGuidance() {
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-primary mb-6">
        Financial Guidance
      </h2>

      <div className="space-y-6">
        {/* Retirement Impact Panel */}
        <div className="p-4 bg-gradient-to-r from-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] to-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))] rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] text-[var(--color-primary)]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-primary mb-3">
                Retirement Impact Overview
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-secondary mb-1">Available Loan</p>
                  <p className="text-lg font-semibold text-primary">$10,000</p>
                </div>
                <div>
                  <p className="text-xs text-secondary mb-1">Monthly Repayment</p>
                  <p className="text-lg font-semibold text-primary">$96</p>
                  <p className="text-xs text-secondary">per paycheck</p>
                </div>
                <div>
                  <p className="text-xs text-secondary mb-1">Projected Balance</p>
                  <p className="text-lg font-semibold text-primary">$420,000</p>
                  <p className="text-xs text-secondary">at retirement</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))] rounded-lg border border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]">
            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-1">
                Consider Your Options
              </h4>
              <p className="text-sm text-primary">
                Taking a loan may reduce your retirement savings by up to $8,200. 
                Consider other options if possible before withdrawing from your retirement account.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] rounded-lg border border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]">
            <DollarSign className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-1">
                Maximize Your Contributions
              </h4>
              <p className="text-sm text-primary">
                You're contributing 5% of your salary. Consider increasing to 6% 
                to receive your full employer match of $1,800 annually.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] rounded-lg border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]">
            <Calendar className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-primary mb-1">
                Quarterly Rebalancing
              </h4>
              <p className="text-sm text-primary">
                Your portfolio hasn't been rebalanced in 6 months. Consider reviewing 
                your investment allocation to maintain your target risk profile.
              </p>
              <Button variant="link" className="px-0 h-auto mt-2 text-[var(--color-primary)]">
                Review Portfolio →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
