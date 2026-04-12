import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import React from "react";

/* Reusable design-token styled components for flow pages */

export function FlowPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "34px", marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", lineHeight: "22px" }}>
        {description}
      </p>
    </motion.div>
  );
}

export function FlowCard({ children, padding = "24px 28px", delay = 0 }: { children: React.ReactNode; padding?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay }}
    >
      <div className="card-standard" style={{ padding }}>
        {children}
      </div>
    </motion.div>
  );
}

export function FlowCardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px", marginBottom: 20 }}>
      {children}
    </h3>
  );
}

export function FlowLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 4 }}>{children}</p>
  );
}

export function FlowValue({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <p style={{ fontSize: size, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>{children}</p>
  );
}

export function FlowInfoBanner({ children, variant = "info" }: { children: React.ReactNode; variant?: "info" | "warning" | "error" | "success" }) {
  const styles = {
    info: { background: "linear-gradient(135deg, var(--surface-soft) 0%, color-mix(in srgb, var(--color-primary) 22%, var(--surface-card)) 100%)", border: "1px solid color-mix(in srgb, var(--color-primary) 28%, var(--surface-card))", color: "var(--color-primary-active)" },
    warning: { background: "linear-gradient(135deg, color-mix(in srgb, var(--color-warning) 10%, var(--surface-card)), color-mix(in srgb, var(--color-warning) 8%, var(--surface-card)))", border: "1px solid color-mix(in srgb, var(--color-warning) 28%, var(--border-default))", color: "color-mix(in srgb, var(--color-warning) 55%, var(--text-primary))" },
    error: { background: "linear-gradient(135deg, color-mix(in srgb, var(--color-danger) 8%, var(--surface-card)), color-mix(in srgb, var(--color-danger) 12%, var(--surface-card)))", border: "1px solid color-mix(in srgb, var(--color-danger) 35%, var(--border-default))", color: "var(--color-danger)" },
    success: { background: "linear-gradient(135deg, color-mix(in srgb, var(--color-success) 8%, var(--surface-card)) 0%, color-mix(in srgb, var(--color-success) 14%, var(--surface-card)) 100%)", border: "1px solid color-mix(in srgb, var(--color-success) 32%, var(--border-default))", color: "color-mix(in srgb, var(--color-success) 45%, var(--text-primary))" },
  };
  const s = styles[variant];
  return (
    <div style={{ ...s, borderRadius: 14, padding: "14px 16px" }}>
      {children}
    </div>
  );
}

export function FlowNavButtons({
  backLabel = "Back",
  nextLabel,
  onBack,
  onNext,
  disabled = false,
  isSubmitting = false,
}: {
  backLabel?: string;
  nextLabel: string;
  onBack: () => void;
  onNext: () => void;
  disabled?: boolean;
  isSubmitting?: boolean;
}) {
  return (
    <div className="flex justify-between items-center" style={{ paddingTop: 16 }}>
      <button
        onClick={onBack}
        className="flex items-center gap-2 transition-all duration-200 cursor-pointer bg-surface-card border border-default text-secondary"
        style={{ padding: "10px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
      >
        <ArrowLeft style={{ width: 16, height: 16 }} />
        {backLabel}
      </button>
      <button
        onClick={onNext}
        disabled={disabled || isSubmitting}
        className="flex items-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground border-none shadow-[0_4px_12px_rgba(37,99,235,0.3)]" style={{ padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}
      >
        {isSubmitting ? "Submitting..." : nextLabel}
        {!isSubmitting && <ArrowRight style={{ width: 16, height: 16 }} />}
      </button>
    </div>
  );
}

export function FlowSuccessState({ title, description }: { title: string; description: string }) {
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
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginBottom: 8 }}>
        {title}
      </h2>
      <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-secondary)", textAlign: "center", maxWidth: 400, marginBottom: 24, lineHeight: "22px" }}>
        {description}
      </p>
      <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)" }}>Redirecting to dashboard...</p>
    </motion.div>
  );
}
