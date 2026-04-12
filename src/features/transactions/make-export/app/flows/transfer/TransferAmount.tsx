import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTransferFlow } from "./TransferFlowLayout";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft, DollarSign, Percent, Info } from "lucide-react";

export function TransferAmount() {
  const navigate = useNavigate();
  const { updateTransferData } = useTransferFlow();

  const [method, setMethod] = useState<"dollar" | "percent">("dollar");
  const [amount, setAmount] = useState("");
  const [percentage, setPercentage] = useState("");

  const maxBalance = 12000;
  const parsedAmount =
    method === "dollar"
      ? parseFloat(amount.replace(/,/g, "")) || 0
      : (parseFloat(percentage) / 100) * maxBalance || 0;
  const effectivePercent =
    method === "percent"
      ? parseFloat(percentage) || 0
      : ((parsedAmount / maxBalance) * 100) || 0;

  const isValid =
    parsedAmount > 0 &&
    parsedAmount <= maxBalance &&
    effectivePercent <= 100;

  const handleContinue = () => {
    // Update transfer data with allocation info
    const funds = [
      {
        name: "Large Cap Equity Fund",
        currentAllocation: 40,
        newAllocation: Math.max(0, 40 - Math.round(effectivePercent * 0.4)),
      },
      {
        name: "International Growth Fund",
        currentAllocation: 25,
        newAllocation:
          25 + Math.round(effectivePercent * 0.6),
      },
      {
        name: "Stable Value Bond Fund",
        currentAllocation: 20,
        newAllocation: 20,
      },
      {
        name: "Target Date 2050 Fund",
        currentAllocation: 15,
        newAllocation: 15,
      },
    ];
    updateTransferData({ funds });
    navigate("/transactions/transfer/impact");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Transfer Amount
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Specify how much you'd like to transfer by dollar amount or
          percentage.
        </p>
      </motion.div>

      {/* Method Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div className="flex items-center gap-1 p-1 w-fit rounded-xl border border-default bg-muted">
          {([["dollar", "Dollar Amount", <DollarSign key="d" className="w-3.5 h-3.5" />], ["percent", "Percentage", <Percent key="p" className="w-3.5 h-3.5" />]] as const).map(([id, label, icon]) => (
            <button
              key={id}
              onClick={() => setMethod(id as "dollar" | "percent")}
              className={`flex items-center gap-1.5 transition-all duration-200 ${
                method === id
                  ? "border border-default bg-surface-card text-[var(--color-primary)] shadow-sm"
                  : "border border-transparent text-secondary"
              }`}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: method === id ? 700 : 500,
              }}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Amount Input */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          {method === "dollar" ? (
            <div>
              <label className="text-sm font-medium text-primary mb-3 block">
                Transfer Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-secondary font-medium">
                  $
                </span>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value.replace(/[^0-9.,]/g, ""))
                  }
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-4 text-3xl font-semibold rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-secondary">
                  {effectivePercent.toFixed(1)}% of source balance
                </span>
                <button
                  onClick={() => setAmount(maxBalance.toString())}
                  className="text-xs text-[var(--color-primary)] font-medium hover:underline"
                >
                  Transfer All (${maxBalance.toLocaleString()})
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium text-primary mb-3 block">
                Transfer Percentage
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={percentage}
                  onChange={(e) =>
                    setPercentage(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  placeholder="0"
                  className="w-full pr-10 pl-4 py-4 text-3xl font-semibold rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl text-secondary font-medium">
                  %
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-secondary">
                  ≈ ${parsedAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setPercentage(pct.toString())}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-surface-card border border-default text-secondary hover:bg-primary/5 hover:text-brand transition-colors font-medium"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Balance Bar */}
          <div className="mt-5 border-t border-default pt-5">
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Source Balance</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>
                ${maxBalance.toLocaleString()}
              </span>
            </div>
            <div className="overflow-hidden bg-border" style={{ height: 8, borderRadius: 4 }}>
              <div
                className="h-full transition-all duration-200"
                style={{
                  width: `${Math.min(100, effectivePercent)}%`,
                  borderRadius: 4,
                  background: effectivePercent <= 100 ? "var(--color-primary)" : "var(--color-danger)",
                }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {parsedAmount > maxBalance && (
        <div
          className="flex items-center gap-2"
          style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-danger) 8%, var(--surface-card)), color-mix(in srgb, var(--color-danger) 12%, var(--surface-card)))", border: "1px solid color-mix(in srgb, var(--color-danger) 35%, var(--border-default))", borderRadius: 14, padding: "14px 16px" }}
        >
          <Info className="flex-shrink-0" style={{ width: 16, height: 16, color: "var(--color-danger)" }} />
          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--color-danger)" }}>
            Transfer amount exceeds available balance of $
            {maxBalance.toLocaleString()}.
          </p>
        </div>
      )}

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions/transfer/destination")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary"
          style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]"
          style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Preview Impact
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}