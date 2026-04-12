import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useRolloverFlow } from "./RolloverFlowLayout";
import { motion } from "motion/react";
import {
  Building2,
  ShieldCheck,
  Hash,
  DollarSign,
  Info,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export function RolloverPlanDetails() {
  const navigate = useNavigate();
  const { updateRolloverData } = useRolloverFlow();

  const [previousEmployer, setPreviousEmployer] = useState("");
  const [planAdministrator, setPlanAdministrator] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [rolloverType, setRolloverType] = useState<string>("");

  const rolloverTypes = [
    {
      id: "traditional",
      label: "Traditional 401(k)",
      description: "Pre-tax contributions from a previous employer plan",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "roth",
      label: "Roth 401(k)",
      description: "After-tax contributions with tax-free growth",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      id: "ira",
      label: "Traditional IRA",
      description: "Individual retirement account rollover",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  const isValid =
    previousEmployer.trim() !== "" &&
    planAdministrator.trim() !== "" &&
    accountNumber.trim() !== "" &&
    estimatedAmount.trim() !== "" &&
    rolloverType !== "";

  const handleContinue = () => {
    updateRolloverData({
      previousEmployer,
      planAdministrator,
      accountNumber,
      estimatedAmount: parseFloat(estimatedAmount.replace(/,/g, "")) || 0,
      rolloverType,
    });
    navigate("/transactions/rollover/validation");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Previous Plan Details
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Enter details about the retirement plan you'd like to roll over into
          your current 401(k).
        </p>
      </motion.div>

      {/* Rollover Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 4 }}>Rollover Type</h3>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 20 }}>
            Select the type of account you're rolling over
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {rolloverTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setRolloverType(type.id)}
                className="relative text-left transition-all duration-200 cursor-pointer"
                style={{
                  padding: "16px 20px", borderRadius: 14,
                  border: rolloverType === type.id ? "1.5px solid var(--color-primary)" : "1.5px solid var(--border-default)",
                  background: rolloverType === type.id ? "var(--surface-soft)" : "var(--color-card)",
                }}
              >
                {rolloverType === type.id && (
                  <CheckCircle2 className="absolute top-3 right-3" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
                )}
                <div
                  className={`p-2 rounded-lg inline-flex mb-3 ${
                    rolloverType === type.id
                      ? "bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] text-[var(--color-primary)]"
                      : "bg-surface-card text-secondary"
                  }`}
                >
                  {type.icon}
                </div>
                <h4 className="font-semibold text-primary text-sm mb-1">
                  {type.label}
                </h4>
                <p className="text-[11px] text-secondary leading-relaxed">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Plan Information */}
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
          <h3 className="font-semibold text-primary mb-1">
            Plan Information
          </h3>
          <p className="text-sm text-secondary mb-5">
            Provide details about your previous employer's retirement plan
          </p>

          <div className="space-y-5">
            {/* Previous Employer */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Building2 className="w-4 h-4 text-secondary" />
                Previous Employer Name
              </label>
              <input
                type="text"
                value={previousEmployer}
                onChange={(e) => setPreviousEmployer(e.target.value)}
                placeholder="e.g., Acme Corporation"
                className="w-full px-4 py-3 rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all"
              />
            </div>

            {/* Plan Administrator */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                Plan Administrator
              </label>
              <input
                type="text"
                value={planAdministrator}
                onChange={(e) => setPlanAdministrator(e.target.value)}
                placeholder="e.g., Fidelity Investments"
                className="w-full px-4 py-3 rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <Hash className="w-4 h-4 text-secondary" />
                Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g., 1234-5678-90"
                className="w-full px-4 py-3 rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all font-mono"
              />
            </div>

            {/* Estimated Amount */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-primary mb-2">
                <DollarSign className="w-4 h-4 text-secondary" />
                Estimated Rollover Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">
                  $
                </span>
                <input
                  type="text"
                  value={estimatedAmount}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.,]/g, "");
                    setEstimatedAmount(val);
                  }}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 rounded-xl border border-default bg-surface-card text-primary placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--color-primary)_22%,transparent)] focus:border-[color-mix(in_srgb,var(--color-primary)_35%,var(--border-default))] transition-all"
                />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div
          className="p-5 rounded-2xl bg-gradient-to-br from-[color-mix(in_srgb,var(--color-primary)_10%,var(--surface-card))]/70 to-[color-mix(in_srgb,var(--color-accent)_10%,var(--surface-card))]/50 border border-[color-mix(in_srgb,var(--color-primary)_22%,var(--border-default))]/60"
          style={{
            boxShadow: "0 1px 3px rgba(59,130,246,0.04)",
          }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))]/70 text-[var(--color-primary)] flex-shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-primary text-sm mb-1">
                What you'll need
              </h4>
              <ul className="space-y-1.5 text-xs text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)] mt-0.5">•</span>
                  <span>
                    Your most recent statement from the previous plan
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)] mt-0.5">•</span>
                  <span>
                    Contact information for the previous plan administrator
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--color-primary)] mt-0.5">•</span>
                  <span>
                    A check or transfer form from the previous plan (if
                    applicable)
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Cancel
        </button>
        <button
          onClick={handleContinue}
          disabled={!isValid}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Continue
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}