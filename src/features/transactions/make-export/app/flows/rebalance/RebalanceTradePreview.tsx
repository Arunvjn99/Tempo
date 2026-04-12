import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useRebalanceFlow } from "./RebalanceFlowLayout";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Shield,
  TrendingUp,
  Clock,
} from "lucide-react";

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "var(--color-warning)"];

export function RebalanceTradePreview() {
  const navigate = useNavigate();
  const { rebalanceData } = useRebalanceFlow();

  const funds = rebalanceData.funds || [];
  const totalValue = funds.reduce((s, f) => s + f.currentValue, 0);

  const trades = funds
    .map((fund, idx) => {
      const change = fund.targetAllocation - fund.currentAllocation;
      const tradeAmount = Math.round((Math.abs(change) / 100) * totalValue);
      return {
        ...fund,
        change,
        tradeAmount,
        action:
          change > 0
            ? ("Buy" as const)
            : change < 0
              ? ("Sell" as const)
              : ("Hold" as const),
        color: COLORS[idx],
      };
    })
    .filter((t) => t.change !== 0);

  const totalBuy = trades
    .filter((t) => t.action === "Buy")
    .reduce((s, t) => s + t.tradeAmount, 0);
  const totalSell = trades
    .filter((t) => t.action === "Sell")
    .reduce((s, t) => s + t.tradeAmount, 0);

  // Risk analysis
  const equityAlloc =
    (funds[0]?.targetAllocation || 0) + (funds[1]?.targetAllocation || 0);
  const currentEquity =
    (funds[0]?.currentAllocation || 0) + (funds[1]?.currentAllocation || 0);
  const riskChange =
    equityAlloc > currentEquity
      ? "slightly higher"
      : equityAlloc < currentEquity
        ? "slightly lower"
        : "unchanged";

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Trade Preview
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Review the buy and sell trades that will be executed to achieve your
          target allocation.
        </p>
      </motion.div>

      {/* Trade Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        >
          <Card
            className="p-5 rounded-2xl border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))]/60 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]/50 to-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]/30"
            style={{ boxShadow: "0 1px 3px rgba(16,185,129,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowUpRight className="w-4 h-4 text-[var(--color-success)]" />
              <span className="text-xs font-semibold text-[var(--color-success)]">
                Total Buys
              </span>
            </div>
            <p className="text-2xl font-bold text-[var(--color-success)]">
              ${totalBuy.toLocaleString()}
            </p>
            <p className="text-[10px] text-[var(--color-success)]/70 mt-1">
              {trades.filter((t) => t.action === "Buy").length} fund
              {trades.filter((t) => t.action === "Buy").length !== 1
                ? "s"
                : ""}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card
            className="p-5 rounded-2xl border-[color-mix(in_srgb,var(--color-danger)_22%,var(--border-default))]/60 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))]/50 to-[color-mix(in_srgb,var(--color-danger)_6%,var(--surface-card))]/30"
            style={{ boxShadow: "0 1px 3px rgba(244,63,94,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowDownRight className="w-4 h-4 text-[var(--color-danger)]" />
              <span className="text-xs font-semibold text-[color-mix(in_srgb,var(--color-danger)_60%,var(--text-primary))]">
                Total Sells
              </span>
            </div>
            <p className="text-2xl font-bold text-[color-mix(in_srgb,var(--color-danger)_60%,var(--text-primary))]">
              ${totalSell.toLocaleString()}
            </p>
            <p className="text-[10px] text-[var(--color-danger)]/70 mt-1">
              {trades.filter((t) => t.action === "Sell").length} fund
              {trades.filter((t) => t.action === "Sell").length !== 1
                ? "s"
                : ""}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <Card
            className="p-5 rounded-2xl border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]/60 bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]/50 to-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))]/30"
            style={{ boxShadow: "0 1px 3px rgba(59,130,246,0.06)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs font-semibold text-[var(--color-primary)]">
                Risk Impact
              </span>
            </div>
            <p className="text-lg font-bold text-[var(--color-primary)] capitalize">
              {riskChange}
            </p>
            <p className="text-[10px] text-[var(--color-primary)]/70 mt-1">
              Equity: {currentEquity}% → {equityAlloc}%
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Trade Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card
          className="p-6 rounded-2xl border-default/80"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <h3 className="font-semibold text-primary text-sm mb-5">
            Trade Details
          </h3>

          <div className="space-y-3">
            {trades.map((trade, idx) => (
              <motion.div
                key={trade.ticker}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 + idx * 0.06, duration: 0.3 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                  trade.action === "Buy"
                    ? "bg-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]/30 border-[color-mix(in_srgb,var(--color-success)_22%,var(--border-default))]/60"
                    : "bg-[color-mix(in_srgb,var(--color-danger)_8%,var(--surface-card))]/30 border-[color-mix(in_srgb,var(--color-danger)_22%,var(--border-default))]/60"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      trade.action === "Buy"
                        ? "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))] text-[var(--color-success)]"
                        : "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))] text-[var(--color-danger)]"
                    }`}
                  >
                    {trade.action === "Buy" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          trade.action === "Buy"
                            ? "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))] text-[var(--color-success)]"
                            : "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-danger)_60%,var(--text-primary))]"
                        }`}
                      >
                        {trade.action}
                      </span>
                      <p className="text-sm font-medium text-primary">
                        {trade.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-secondary font-mono">
                        {trade.ticker}
                      </span>
                      <span className="text-[10px] text-secondary">
                        {trade.currentAllocation}% → {trade.targetAllocation}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      trade.action === "Buy"
                        ? "text-[var(--color-success)]"
                        : "text-[color-mix(in_srgb,var(--color-danger)_60%,var(--text-primary))]"
                    }`}
                  >
                    {trade.action === "Buy" ? "+" : "-"}$
                    {trade.tradeAmount.toLocaleString()}
                  </p>
                  <p
                    className={`text-[10px] font-medium ${
                      trade.change > 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                    }`}
                  >
                    {trade.change > 0 ? "+" : ""}
                    {trade.change}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Processing Info */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="p-4 rounded-2xl card-standard border-default/60">
          <div className="flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-secondary font-medium mb-1">
                Trade Execution
              </p>
              <p className="text-[11px] text-secondary leading-relaxed">
                Trades will be executed at the next market close. No fees apply
                to portfolio rebalancing within your 401(k) plan. Your updated
                allocation will be reflected within 1-2 business days.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions/rebalance/adjust")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Back
        </button>
        <button
          onClick={() => navigate("/transactions/rebalance/review")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Continue to Review
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}