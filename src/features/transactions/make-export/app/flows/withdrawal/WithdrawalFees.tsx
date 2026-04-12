import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWithdrawalFlow } from "./WithdrawalFlowLayout";
import { Separator } from "../../components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../components/ui/collapsible";
import { motion } from "motion/react";
import {
  ChevronDown,
  Settings2,
  AlertTriangle,
  TrendingDown,
  Info,
} from "lucide-react";

export function WithdrawalFees() {
  const navigate = useNavigate();
  const { withdrawalData } = useWithdrawalFlow();

  const withdrawalAmount = withdrawalData.amount || 3000;
  const isEarlyWithdrawal = true; // Simplified: would check age

  // Tax settings
  const [federalWithholding, setFederalWithholding] = useState(20);
  const [stateWithholding, setStateWithholding] = useState(5);
  const [taxSettingsOpen, setTaxSettingsOpen] = useState(false);

  const federalTax = Math.round(withdrawalAmount * (federalWithholding / 100));
  const stateTax = Math.round(withdrawalAmount * (stateWithholding / 100));
  const earlyPenalty = isEarlyWithdrawal
    ? Math.round(withdrawalAmount * 0.1)
    : 0;
  const redemptionFee = 25;
  const totalDeductions = federalTax + stateTax + earlyPenalty + redemptionFee;
  const finalPayout = withdrawalAmount - totalDeductions;

  // Remaining retirement balance
  const currentBalance = 30000;
  const remainingBalance = currentBalance - withdrawalAmount;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Tax Impact & Fees
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Review the taxes, penalties, and fees that will be applied to your
          withdrawal.
        </p>
      </motion.div>

      {/* Fee Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 24 }}>
            Withdrawal Breakdown
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-primary">Withdrawal Amount</p>
                <p className="text-sm text-secondary">
                  Total from selected sources
                </p>
              </div>
              <p className="text-xl font-semibold text-primary">
                ${withdrawalAmount.toLocaleString()}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary">
                    Federal Tax Withholding ({federalWithholding}%)
                  </p>
                  <p className="text-xs text-secondary">
                    Mandatory minimum withholding
                  </p>
                </div>
                <p className="font-medium text-[var(--color-danger)]">
                  -${federalTax.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary">
                    State Tax Withholding ({stateWithholding}%)
                  </p>
                  <p className="text-xs text-secondary">
                    Based on your state of residence
                  </p>
                </div>
                <p className="font-medium text-[var(--color-danger)]">
                  -${stateTax.toLocaleString()}
                </p>
              </div>

              {isEarlyWithdrawal && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-primary">
                        Early Withdrawal Penalty (10%)
                      </p>
                      <p className="text-xs text-secondary">
                        Under age 59½ penalty
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-[var(--color-danger)]">
                    -${earlyPenalty.toLocaleString()}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary">Redemption Fee</p>
                  <p className="text-xs text-secondary">
                    Investment liquidation fee
                  </p>
                </div>
                <p className="font-medium text-[var(--color-danger)]">-${redemptionFee}</p>
              </div>
            </div>

            <Separator className="border-default" />

            <div className="flex items-center justify-between py-3 bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))] -mx-6 px-6 rounded-lg">
              <div>
                <p className="font-semibold text-primary text-lg">
                  Final Payout
                </p>
                <p className="text-sm text-secondary">
                  Amount you will receive
                </p>
              </div>
              <p className="text-2xl font-bold text-[var(--color-success)]">
                ${finalPayout.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Impact Preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="p-5 bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-primary mb-2">
                Remaining Retirement Balance
              </h4>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-semibold text-primary">
                  ${remainingBalance.toLocaleString()}
                </span>
                <span className="text-sm text-secondary">
                  after withdrawal
                </span>
              </div>
              <div className="h-2 bg-[color-mix(in_srgb,var(--color-primary)_22%,var(--surface-card))] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] transition-all"
                  style={{
                    width: `${(remainingBalance / currentBalance) * 100}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-secondary mt-1">
                <span>$0</span>
                <span>
                  ${currentBalance.toLocaleString()} (current balance)
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Advanced: Tax Withholding Settings (Expandable) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <Collapsible open={taxSettingsOpen} onOpenChange={setTaxSettingsOpen}>
          <Card className="rounded-2xl border-default/80 overflow-hidden">
            <CollapsibleTrigger asChild>
              <button className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))] text-[var(--color-accent)]">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary text-sm">
                      Tax Withholding Settings
                    </h3>
                    <p className="text-xs text-secondary mt-0.5">
                      Adjust federal and state withholding percentages
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-secondary transition-transform duration-200 ${
                    taxSettingsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-5 pb-5 border-t border-default space-y-6">
                <div className="pt-4">
                  {/* Federal Withholding */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-primary text-sm">
                          Federal Withholding
                        </p>
                        <p className="text-[10px] text-secondary">
                          Minimum 10% required
                        </p>
                      </div>
                      <span className="text-xl font-semibold text-primary">
                        {federalWithholding}%
                      </span>
                    </div>
                    <Slider
                      value={[federalWithholding]}
                      onValueChange={(v) => setFederalWithholding(v[0])}
                      min={10}
                      max={37}
                      step={1}
                    />
                    <div className="flex justify-between text-[10px] text-secondary mt-1">
                      <span>10% min</span>
                      <span>37% max</span>
                    </div>
                  </div>

                  {/* State Withholding */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium text-primary text-sm">
                          State Withholding
                        </p>
                        <p className="text-[10px] text-secondary">
                          Varies by state (NY shown)
                        </p>
                      </div>
                      <span className="text-xl font-semibold text-primary">
                        {stateWithholding}%
                      </span>
                    </div>
                    <Slider
                      value={[stateWithholding]}
                      onValueChange={(v) => setStateWithholding(v[0])}
                      min={0}
                      max={13}
                      step={1}
                    />
                    <div className="flex justify-between text-[10px] text-secondary mt-1">
                      <span>0%</span>
                      <span>13% max</span>
                    </div>
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      </motion.div>

      {/* Tax Notice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="p-4 bg-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))] border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-primary">
                <span className="font-semibold">Tax Notice:</span> This
                withholding may not cover all tax liabilities. You may owe
                additional taxes when you file your return. The early withdrawal
                penalty may be waived for certain qualifying hardship
                circumstances. Consult with a tax professional for personalized
                advice.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions/withdrawal/source")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Back
        </button>
        <button
          onClick={() => navigate("/transactions/withdrawal/payment")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Continue to Payment Method
        </button>
      </div>
    </div>
  );
}