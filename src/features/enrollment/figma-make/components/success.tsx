import { useNavigate } from "react-router-dom";
import { CheckCircle, Mail, Calendar, BarChart3 } from "lucide-react";

export function Success() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card-standard max-w-md w-full space-y-6 p-8 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_14%,var(--surface-card))] flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-[var(--color-primary)]" />
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold text-[var(--text-primary)]">Congratulations!</h1>
          <p className="text-[var(--text-secondary)] mt-2 text-sm">
            Your retirement plan has been successfully activated.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="fm-surface-hero rounded-2xl border border-[var(--color-success-border)] p-5 text-left space-y-4 [background:var(--color-success-bg)]">
          <p className="text-[var(--text-primary)] font-semibold text-sm">What happens next</p>
          {[
            { icon: Calendar, text: "Contributions start next pay period" },
            { icon: Mail, text: "Confirmation email will be sent" },
            { icon: BarChart3, text: "Track savings from dashboard" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[color-mix(in_srgb,var(--color-primary)_15%,var(--surface-card))] flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <span className="text-[var(--text-primary)] text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full rounded-xl bg-[var(--color-primary)] py-3.5 text-[var(--primary-foreground)] transition-all hover:bg-[var(--color-primary-hover)] active:scale-[0.98]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
