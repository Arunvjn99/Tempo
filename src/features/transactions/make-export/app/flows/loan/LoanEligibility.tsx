import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  DollarSign,
  Percent,
  Calendar,
  TrendingDown,
  Wallet,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export function LoanEligibility() {
  const navigate = useNavigate();

  const eligibilityData = [
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Maximum Loan Available",
      value: "$10,000",
      bg: "var(--surface-soft)",
      color: "var(--color-primary)",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      label: "Outstanding Loan Balance",
      value: "$0",
      bg: "color-mix(in srgb, var(--color-success) 8%, var(--surface-card))",
      color: "var(--color-success)",
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      label: "Available Loan Balance",
      value: "$10,000",
      bg: "color-mix(in srgb, var(--color-primary) 22%, var(--surface-card))",
      color: "var(--color-primary)",
    },
    {
      icon: <Percent className="w-5 h-5" />,
      label: "Interest Rate",
      value: "8%",
      bg: "color-mix(in srgb, var(--color-accent) 10%, var(--surface-card))",
      color: "var(--color-accent)",
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      label: "Maximum Term",
      value: "5 years",
      bg: "color-mix(in srgb, var(--color-primary) 10%, var(--surface-card))",
      color: "color-mix(in srgb, var(--color-primary) 55%, var(--color-accent))",
    },
    {
      icon: <TrendingDown className="w-5 h-5" />,
      label: "Estimated Monthly Payment Range",
      value: "$96 - $203",
      bg: "color-mix(in srgb, var(--color-warning) 12%, var(--surface-card))",
      color: "var(--color-warning)",
    },
  ];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Loan Eligibility
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Review your loan eligibility details before proceeding with a loan
          request.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 20 }}>
            Your Loan Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {eligibilityData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + index * 0.04, duration: 0.3 }}
                className="flex items-start gap-4"
              >
                <div
                  className="flex items-center justify-center flex-shrink-0"
                  style={{ width: 40, height: 40, borderRadius: 10, background: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>{item.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 10%, var(--surface-card)), color-mix(in srgb, var(--color-warning) 8%, var(--surface-card)))", border: "1px solid color-mix(in srgb, var(--color-warning) 28%, var(--border-default))", borderRadius: 16, padding: "20px 24px" }}>
          <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 12 }}>
            Plan Restrictions
          </h4>
          <ul className="space-y-2.5">
            {[
              "You can have a maximum of 2 active loans at any time",
              "Loan repayment will be automatically deducted from your paycheck",
              "Early repayment is allowed without penalties",
              "Maximum loan amount is the lesser of 50% of vested balance or $50,000",
              "Spousal consent may be required depending on plan rules",
            ].map((text, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="rounded-full mt-1.5 flex-shrink-0" style={{ width: 6, height: 6, background: "var(--color-warning)" }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "20px" }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Documentation Notice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <div
          className="flex items-start gap-3"
          style={{ background: "linear-gradient(135deg, var(--surface-soft) 0%, color-mix(in srgb, var(--color-primary) 22%, var(--surface-card)) 100%)", border: "1px solid color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))", borderRadius: 14, padding: "16px 20px" }}
        >
          <AlertCircle className="flex-shrink-0 mt-0.5" style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary-active)", marginBottom: 4 }}>
              Documentation Requirements
            </p>
            <p className="leading-relaxed" style={{ fontSize: 12, fontWeight: 500, color: "var(--color-primary-active)" }}>
              You will need to provide a voided check or bank statement for
              EFT disbursement, sign a promissory note, and may need spousal
              consent or employment verification depending on your plan and
              loan type.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center gap-3" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Cancel
        </button>
        <button
          onClick={() => navigate("/transactions/loan/simulator")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer flex-1 sm:flex-none justify-center bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          Simulate Loan
          <ArrowRight style={{ width: 16, height: 16 }} />
        </button>
      </div>
    </div>
  );
}