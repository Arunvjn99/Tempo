import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Slider } from "../../components/ui/slider";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRebalanceFlow } from "./RebalanceFlowLayout";
import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Info } from "lucide-react";

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)", "var(--color-warning)"];

export function RebalanceAdjustAllocation() {
  const navigate = useNavigate();
  const { rebalanceData, updateRebalanceData } = useRebalanceFlow();

  const initialFunds = (rebalanceData.funds || []).map((f) => ({
    ...f,
  }));

  const [funds, setFunds] = useState(initialFunds);
  const totalAllocation = funds.reduce(
    (sum, fund) => sum + fund.targetAllocation,
    0
  );
  const isValid = totalAllocation === 100;

  const handleSliderChange = (index: number, value: number) => {
    const newFunds = [...funds];
    newFunds[index] = { ...newFunds[index], targetAllocation: value };
    setFunds(newFunds);
  };

  const handleReset = () => {
    setFunds(
      initialFunds.map((f) => ({
        ...f,
        targetAllocation: f.currentAllocation,
      }))
    );
  };

  const handleContinue = () => {
    updateRebalanceData({ funds });
    navigate("/transactions/rebalance/trades");
  };

  const hasChanges = funds.some(
    (f) => f.targetAllocation !== f.currentAllocation
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
              Adjust Target Allocation
            </h2>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
              Use the sliders to set your desired target allocation. Total must
              equal 100%.
            </p>
          </div>
          {hasChanges && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="rounded-xl gap-1.5 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </Button>
          )}
        </div>
      </motion.div>

      {/* Total Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
      >
        <Card
          className={`p-5 rounded-2xl text-center transition-all duration-300 ${
            isValid
              ? "bg-gradient-to-br from-[color-mix(in_srgb,var(--color-success)_12%,var(--surface-card))]/80 to-[color-mix(in_srgb,var(--color-success)_10%,var(--surface-card))]/50 border-[color-mix(in_srgb,var(--color-success)_28%,var(--border-default))]/60"
              : "bg-gradient-to-br from-[color-mix(in_srgb,var(--color-warning)_10%,var(--surface-card))]/80 to-[color-mix(in_srgb,var(--color-warning)_8%,var(--surface-card))]/50 border-[color-mix(in_srgb,var(--color-warning)_28%,var(--border-default))]/60"
          }`}
          style={{
            boxShadow: isValid
              ? "0 1px 3px rgba(16,185,129,0.06)"
              : "0 1px 3px rgba(245,158,11,0.06)",
          }}
        >
          <p className="text-xs text-secondary mb-1">Total Allocation</p>
          <p
            className={`text-3xl font-bold ${isValid ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}
          >
            {totalAllocation}%
          </p>
          {!isValid && (
            <p className="text-xs text-[color-mix(in_srgb,var(--color-warning)_65%,var(--text-primary))] mt-1">
              {totalAllocation > 100
                ? `Reduce by ${totalAllocation - 100}%`
                : `Add ${100 - totalAllocation}% more`}
            </p>
          )}
        </Card>
      </motion.div>

      {/* Fund Sliders */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card
          className="p-6 rounded-2xl border-default/80"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.03), 0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <h3 className="font-semibold text-primary text-sm mb-6">
            Investment Funds
          </h3>

          <div className="space-y-7">
            {funds.map((fund, index) => {
              const change =
                fund.targetAllocation - fund.currentAllocation;
              return (
                <motion.div
                  key={fund.ticker}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.3 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <div>
                        <p className="font-medium text-primary text-sm">
                          {fund.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-secondary font-mono">
                            {fund.ticker}
                          </span>
                          <span className="text-[10px] text-secondary">
                            Current: {fund.currentAllocation}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-semibold text-primary">
                        {fund.targetAllocation}%
                      </span>
                      {change !== 0 && (
                        <p
                          className={`text-[10px] font-medium ${change > 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"}`}
                        >
                          {change > 0 ? "+" : ""}
                          {change}%
                        </p>
                      )}
                    </div>
                  </div>

                  <Slider
                    value={[fund.targetAllocation]}
                    onValueChange={(value) =>
                      handleSliderChange(index, value[0])
                    }
                    min={0}
                    max={100}
                    step={1}
                    className="mb-2"
                  />

                  <div className="h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${fund.targetAllocation}%`,
                        backgroundColor: COLORS[index],
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {!hasChanges && (
        <div className="p-4 rounded-2xl bg-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]/50 border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]/60">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
            <p className="text-xs text-[var(--color-primary)]">
              Adjust the sliders above to set your new target allocation.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions/rebalance")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid || !hasChanges}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Preview Trades
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}