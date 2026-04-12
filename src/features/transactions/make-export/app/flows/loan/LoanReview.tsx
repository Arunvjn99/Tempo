import { Checkbox } from "../../components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoanFlow } from "./LoanFlowLayout";
import { CheckCircle2, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { RetirementImpactWidget } from "../../components/RetirementImpactWidget";

export function LoanReview() {
  const navigate = useNavigate();
  const { loanData } = useLoanFlow();
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const loanAmount = loanData.amount || 5000;
  const tenure = loanData.tenure || 3;
  const interestRate = 8;

  const monthlyRate = interestRate / 100 / 12;
  const numPayments = tenure * 12;
  const monthlyPayment =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);

  const totalFees = 100;
  const netAmount = loanAmount - totalFees;

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center justify-center py-16"
      >
        <div
          className="flex items-center justify-center mb-5"
          style={{ width: 64, height: 64, borderRadius: 32, background: "linear-gradient(135deg, color-mix(in srgb, var(--color-success) 8%, var(--surface-card)) 0%, color-mix(in srgb, var(--color-success) 14%, var(--surface-card)) 100%)", border: "1px solid color-mix(in srgb, var(--color-success) 32%, var(--border-default))" }}
        >
          <CheckCircle2 style={{ width: 32, height: 32, color: "var(--color-success)" }} />
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 8 }}>
          Loan Request Submitted
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textAlign: "center", maxWidth: 400, marginBottom: 24, lineHeight: "22px" }}>
          Your loan request has been submitted successfully. You'll receive an email confirmation shortly.
        </p>
        <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Redirecting to dashboard...</p>
      </motion.div>
    );
  }

  const summaryItems = [
    { label: "Loan Amount", value: `$${loanAmount.toLocaleString()}` },
    { label: "Net Amount (after fees)", value: `$${netAmount.toLocaleString()}` },
    { label: "Monthly Payment", value: `$${Math.round(monthlyPayment).toLocaleString()}` },
    { label: "Interest Rate", value: `${interestRate}%` },
    { label: "Loan Tenure", value: `${tenure} ${tenure === 1 ? "year" : "years"}` },
    { label: "Total Fees", value: `$${totalFees}` },
  ];

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
          Review and Submit
        </h2>
        <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
          Please review all details carefully before submitting your loan request.
        </p>
      </motion.div>

      {/* Loan Summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 24 }}>
            Loan Summary
          </h3>

          <div className="grid grid-cols-2 gap-6">
            {summaryItems.map((item, i) => (
              <div key={i}>
                <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid var(--border-default)", marginTop: 24, paddingTop: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>Repayment Frequency</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Per Paycheck (Bi-weekly)</p>
          </div>
        </div>
      </motion.div>

      {/* Repayment Schedule Preview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      >
        <div className="card-standard" style={{ padding: "24px 28px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 16 }}>
            Repayment Schedule Preview
          </h3>

          <div className="space-y-3">
            {[
              { label: "First Payment", sub: "April 2026", value: `$${Math.round(monthlyPayment).toLocaleString()}` },
              { label: "Monthly Payment", sub: `${numPayments} payments`, value: `$${Math.round(monthlyPayment).toLocaleString()}` },
              { label: "Repayment Frequency", sub: "Per Paycheck (Bi-weekly)", value: `$${Math.round(monthlyPayment / 2).toLocaleString()}/pay` },
              { label: "Final Payment", sub: new Date(2026 + tenure, 2, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), value: `$${Math.round(monthlyPayment).toLocaleString()}` },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-[10px] border border-default bg-muted"
                style={{ padding: "12px 16px" }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{item.label}</p>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-secondary)" }}>{item.sub}</p>
                </div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Processing Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, var(--surface-soft) 0%, color-mix(in srgb, var(--color-primary) 22%, var(--surface-card)) 100%)",
            border: "1px solid color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))",
            borderRadius: 16,
            padding: "20px 24px",
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock style={{ width: 16, height: 16, color: "var(--color-primary)" }} />
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Processing Timeline</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { step: "Submitted", time: "Day 1", desc: "Request logged" },
              { step: "Review", time: "Day 1-2", desc: "Documents verified" },
              { step: "Approved", time: "Day 2-3", desc: "Loan approved" },
              { step: "Funds Sent", time: "Day 3-5", desc: "EFT processed" },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div
                  className="flex items-center justify-center mx-auto mb-1.5"
                  style={{
                    width: 28, height: 28, borderRadius: 14,
                    background: "var(--color-card)", border: "2px solid color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))",
                    fontSize: 10, fontWeight: 700, color: "var(--color-primary)",
                  }}
                >
                  {idx + 1}
                </div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)" }}>{item.step}</p>
                <p style={{ fontSize: 10, fontWeight: 600, color: "var(--color-primary)" }}>{item.time}</p>
                <p style={{ fontSize: 10, fontWeight: 500, color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Retirement Impact */}
      <RetirementImpactWidget
        compact
        impactAmount={-Math.round(loanAmount * 1.64)}
        impactLabel={`−$${Math.round(loanAmount * 1.64).toLocaleString()} projected retirement impact`}
        estimatedValue={38420}
        onTrack={loanAmount <= 5000}
        delay={0.18}
      />

      {/* Confirmation */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      >
        <div className="card-standard" style={{ padding: "20px 24px" }}>
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <div className="flex-1">
              <label
                htmlFor="terms"
                className="cursor-pointer leading-relaxed"
                style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)" }}
              >
                I understand and agree to the loan terms, including the interest rate,
                repayment schedule, and fees. I acknowledge that this loan will be repaid
                through automatic payroll deductions and that failure to make payments may
                result in taxes and penalties.
              </label>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
        <button
          onClick={() => navigate("/transactions/loan/documents")}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary" style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          <ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!agreed || isSubmitting}
          className="flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
        >
          {isSubmitting ? "Submitting..." : "Submit Loan Request"}
          {!isSubmitting && <ArrowRight style={{ width: 16, height: 16 }} />}
        </button>
      </div>
    </div>
  );
}