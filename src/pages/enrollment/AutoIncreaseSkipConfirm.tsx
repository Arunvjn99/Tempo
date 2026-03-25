import type { CSSProperties } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TrendingUp, Minus } from "lucide-react";
import { EnrollmentPageContent } from "@/components/enrollment/EnrollmentPageContent";
import Button from "@/components/ui/Button";
import { getRoutingVersion, withVersion } from "@/core/version";

const cardBase: CSSProperties = {
  background: "var(--enroll-card-bg)",
  border: "1px solid var(--enroll-card-border)",
  borderRadius: "var(--enroll-card-radius)",
  boxShadow: "var(--enroll-elevation-2)",
};

/**
 * POC — Figma-aligned “Skip automatic increases?” confirmation (no persistence / validation).
 */
export function AutoIncreaseSkipConfirm() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const version = getRoutingVersion(pathname);

  const withAutoExample = "$185,943";
  const withoutAutoExample = "$124,621";
  const deltaExample = "$61,322";

  const handleSkipForNow = () => {
    console.log("SKIP CONFIRMED → NEXT STEP");
    navigate(withVersion(version, "/enrollment/investments"));
  };

  const handleEnable = () => {
    const target =
      version === "v1"
        ? "/v1/enrollment/auto-increase/config"
        : withVersion(version, "/enrollment/auto-increase");
    navigate(target);
  };

  return (
    <EnrollmentPageContent title="Skip automatic increases?" subtitle={undefined}>
      <div className="enrollment-container max-w-3xl mx-auto space-y-6">
        <p className="text-sm leading-relaxed" style={{ color: "var(--enroll-text-secondary)" }}>
          Compare projected outcomes with and without automatic annual increases. You can change this later anytime.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div
            className="relative rounded-2xl p-5 ring-2 ring-[rgb(var(--enroll-brand-rgb)/0.35)]"
            style={{ ...cardBase, background: "rgb(var(--enroll-brand-rgb) / 0.06)" }}
          >
            <span
              className="absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "var(--enroll-accent)", color: "white" }}
            >
              Recommended
            </span>
            <div className="mb-3 flex items-center gap-2 pr-16">
              <div className="success-icon-soft">
                <TrendingUp className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                With Auto Increase
              </h3>
            </div>
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              Gradually raise your contribution rate each year up to a cap you choose.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--enroll-text-muted)" }}>
              Projected in 10 years
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--enroll-accent)" }}>
              {withAutoExample}
            </p>
          </div>

          <div className="rounded-2xl p-5" style={cardBase}>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--enroll-soft-bg)]">
                <Minus className="h-5 w-5 text-[var(--enroll-text-muted)]" aria-hidden />
              </div>
              <h3 className="font-semibold" style={{ color: "var(--enroll-text-primary)" }}>
                Without Auto Increase
              </h3>
            </div>
            <p className="text-sm" style={{ color: "var(--enroll-text-secondary)" }}>
              Keep your contribution percentage fixed over time.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--enroll-text-muted)" }}>
              Projected in 10 years
            </p>
            <p className="text-2xl font-bold" style={{ color: "var(--enroll-text-primary)" }}>
              {withoutAutoExample}
            </p>
          </div>
        </div>

        <div
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            borderColor: "var(--enroll-card-border)",
            background: "var(--enroll-soft-bg)",
            color: "var(--enroll-text-secondary)",
          }}
        >
          <strong style={{ color: "var(--enroll-text-primary)" }}>Savings comparison: </strong>
          Choosing automatic increases could add approximately <strong style={{ color: "var(--enroll-accent)" }}>{deltaExample}</strong>{" "}
          versus keeping contributions fixed (illustrative).
        </div>

        <p className="text-center text-sm" style={{ color: "var(--enroll-text-muted)" }}>
          You can enable or adjust automatic increases anytime from your account settings.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
          <Button
            type="button"
            onClick={handleSkipForNow}
            className="auto-increase-hero-cta-secondary order-2 h-11 px-6 sm:order-1 sm:min-w-[160px]"
          >
            Skip for Now
          </Button>
          <button
            type="button"
            onClick={handleEnable}
            className="auto-increase-hero-cta-primary order-1 h-11 px-6 sm:order-2 sm:min-w-[220px]"
          >
            Enable Auto Increase
          </button>
        </div>
      </div>
    </EnrollmentPageContent>
  );
}
