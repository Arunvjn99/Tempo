import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  DEMO_SCENARIO_IDS,
  personaFromScenarioId,
  SCENARIO_LABELS,
  type DemoScenarioId,
} from "@/core/data/demoScenarios";

const SCENARIO_COLORS: Record<string, string> = {
  pre_enrollment: "var(--chart-10)",
  new_enrollee: "var(--chart-10)",
  young_accumulator: "var(--chart-2)",
  mid_career: "var(--chart-1)",
  pre_retiree: "var(--chart-3)",
  at_risk: "var(--color-danger)",
  loan_active: "var(--chart-4)",
  retired: "var(--chart-5)",
};

export interface LoginExploreDemoSectionProps {
  showPanel: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelectScenario: (id: DemoScenarioId) => void;
}

export function LoginExploreDemoSection({
  showPanel,
  onOpen,
  onClose,
  onSelectScenario,
}: LoginExploreDemoSectionProps) {
  const { t } = useTranslation();

  return (
    <>
      {typeof document !== "undefined" &&
        createPortal(
          <button
            type="button"
            onClick={onOpen}
            className="fixed left-4 bottom-6 z-[100] flex items-center gap-2.5 rounded-2xl border-2 border-[var(--color-primary)] bg-[var(--color-surface)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] shadow-lg transition-[box-shadow,transform] duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 hover:-translate-y-0.5 hover:shadow-xl md:left-6"
            aria-label={t("auth.exploreDemoScenarios")}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
              aria-hidden
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <span>{t("auth.exploreDemoScenarios")}</span>
          </button>,
          document.body,
        )}

      {showPanel && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text)]">{t("auth.exploreScenarios")}</h2>
                <p className="mt-0.5 text-sm text-[var(--color-textSecondary)]">{t("auth.pickPersona")}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-textSecondary)] transition-colors hover:bg-[var(--color-background)] hover:text-[var(--color-text)]"
                aria-label={t("auth.close")}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-3">
              <div className="flex flex-col gap-1.5">
                {DEMO_SCENARIO_IDS.map((scenarioId) => {
                  const persona = personaFromScenarioId(scenarioId);
                  const color = SCENARIO_COLORS[persona.scenario] ?? "var(--color-text-secondary)";
                  const fmt = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  });

                  return (
                    <button
                      key={scenarioId}
                      type="button"
                      onClick={() => onSelectScenario(scenarioId)}
                      className="flex w-full items-center gap-3 rounded-xl border-2 border-transparent p-4 text-left transition-all hover:border-[var(--color-border)] hover:bg-[var(--color-background)]"
                    >
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-primary-foreground"
                        style={{ backgroundColor: color }}
                      >
                        {persona.name.charAt(0)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[var(--color-text)]">{persona.name}</span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground"
                            style={{ backgroundColor: color }}
                          >
                            {SCENARIO_LABELS[persona.scenario]}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[var(--color-textSecondary)]">
                          Age {persona.age} · {fmt.format(persona.balance)} · Score {persona.retirementScore}
                        </p>
                      </div>

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[var(--color-border)]"
                        aria-hidden
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-[var(--color-border)] px-5 py-3">
              <p className="text-center text-xs text-[var(--color-textSecondary)]">
                No password required — click any persona to explore instantly.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
