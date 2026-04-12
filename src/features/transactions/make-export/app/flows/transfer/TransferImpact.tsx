import { useNavigate } from "react-router-dom";
import { useTransferFlow } from "./TransferFlowLayout";
import { TrendingUp, Shield, AlertTriangle } from "lucide-react";
import { FlowPageHeader, FlowCard, FlowCardTitle, FlowLabel, FlowValue, FlowInfoBanner, FlowNavButtons } from "../../components/FlowUI";
import { RetirementImpactWidget } from "../../components/RetirementImpactWidget";

const COLORS = ["var(--color-primary)", "var(--color-accent)", "var(--color-success)"];

export function TransferImpact() {
  const navigate = useNavigate();
  const { transferData } = useTransferFlow();

  const funds = transferData.funds || [];

  const equityAllocation = (funds[0]?.newAllocation || 0) + (funds[1]?.newAllocation || 0);
  const currentRiskLevel = "Moderate";
  const newRiskLevel = equityAllocation > 70 ? "Moderate–High" : equityAllocation > 50 ? "Moderate" : "Conservative";

  return (
    <div className="space-y-6">
      <FlowPageHeader title="Portfolio Impact" description="Review how your new allocation affects your portfolio risk and expected returns." />

      {/* Risk Level Change */}
      <FlowCard delay={0.05}>
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, var(--surface-soft), color-mix(in srgb, var(--color-primary) 22%, var(--surface-card)))", color: "var(--color-primary)" }}>
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <FlowCardTitle>Risk Level Analysis</FlowCardTitle>
            <div className="grid grid-cols-2 gap-4">
              <div><FlowLabel>Current Risk Level</FlowLabel><FlowValue>{currentRiskLevel}</FlowValue></div>
              <div>
                <FlowLabel>New Risk Level</FlowLabel>
                <p style={{ fontSize: 20, fontWeight: 800, color: newRiskLevel === currentRiskLevel ? "var(--text-primary)" : "var(--color-primary)", letterSpacing: "-0.3px" }}>
                  {newRiskLevel}
                </p>
              </div>
            </div>
            {newRiskLevel !== currentRiskLevel && (
              <div className="mt-4" style={{ padding: "12px 16px", background: "var(--surface-soft)", borderRadius: 10, border: "1px solid color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))" }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-primary-active)" }}>
                  Your portfolio risk level will change from <span style={{ fontWeight: 700 }}>{currentRiskLevel}</span> to{" "}
                  <span style={{ fontWeight: 700 }}>{newRiskLevel}</span> based on your new allocation.
                </p>
              </div>
            )}
          </div>
        </div>
      </FlowCard>

      {/* Allocation Comparison */}
      <FlowCard delay={0.1}>
        <FlowCardTitle>Before vs After Comparison</FlowCardTitle>
        <div className="space-y-4">
          {funds.map((fund, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-full" style={{ width: 12, height: 12, backgroundColor: COLORS[index] }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{fund.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>{fund.currentAllocation}%</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>→</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: fund.newAllocation !== fund.currentAllocation ? "var(--color-primary)" : "var(--text-primary)" }}>
                    {fund.newAllocation}%
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 overflow-hidden bg-border" style={{ height: 6, borderRadius: 3 }}>
                  <div className="h-full" style={{ width: `${fund.currentAllocation}%`, backgroundColor: COLORS[index], opacity: 0.5, borderRadius: 3 }} />
                </div>
                <div className="flex-1 overflow-hidden bg-border" style={{ height: 6, borderRadius: 3 }}>
                  <div className="h-full" style={{ width: `${fund.newAllocation}%`, backgroundColor: COLORS[index], borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </FlowCard>

      {/* Expected Returns */}
      <FlowCard delay={0.15}>
        <div className="flex items-start gap-4">
          <div className="flex items-center justify-center flex-shrink-0" style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, color-mix(in srgb, var(--color-success) 8%, var(--surface-card)), color-mix(in srgb, var(--color-success) 14%, var(--surface-card)))", color: "var(--color-success)" }}>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <FlowCardTitle>Expected Returns</FlowCardTitle>
            <p className="leading-relaxed" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 16 }}>
              Based on historical performance, your new allocation may result in:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div><FlowLabel>Expected Annual Return</FlowLabel><FlowValue>7.2 - 9.5%</FlowValue></div>
              <div>
                <FlowLabel>Expected Volatility</FlowLabel>
                <FlowValue>{newRiskLevel === "Conservative" ? "Low" : newRiskLevel === "Moderate" ? "Medium" : "Medium-High"}</FlowValue>
              </div>
            </div>
          </div>
        </div>
      </FlowCard>

      {newRiskLevel === "Moderate–High" && (
        <FlowInfoBanner variant="warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="flex-shrink-0 mt-0.5" style={{ width: 20, height: 20, color: "var(--color-warning)" }} />
            <p className="leading-relaxed" style={{ fontSize: 13, fontWeight: 500, color: "color-mix(in srgb, var(--color-warning) 55%, var(--text-primary))" }}>
              <span style={{ fontWeight: 700 }}>Higher Risk Notice:</span> Your new allocation
              has a higher risk profile. While this may offer greater return potential, it
              also means increased volatility and potential for losses.
            </p>
          </div>
        </FlowInfoBanner>
      )}

      {/* Retirement Impact - Transfer reallocation effect */}
      <RetirementImpactWidget
        compact
        delay={0.2}
      />

      <FlowNavButtons
        onBack={() => navigate("/transactions/transfer/amount")}
        onNext={() => navigate("/transactions/transfer/review")}
        nextLabel="Continue to Review"
      />
    </div>
  );
}