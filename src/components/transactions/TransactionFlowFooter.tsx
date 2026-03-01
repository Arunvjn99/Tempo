import { useTranslation } from "react-i18next";
import Button from "../ui/Button";

interface TransactionFlowFooterProps {
  currentStep: number;
  totalSteps: number;
  primaryLabel: string;
  primaryDisabled?: boolean;
  onPrimary: () => void;
  onBack: () => void;
  onSaveAndExit: () => void;
  summaryText?: string;
  summaryError?: boolean;
  /** When true (e.g. confirmation step), only Back + Primary are shown */
  hideSaveAndExit?: boolean;
}

/**
 * Transaction flow footer — mirrors EnrollmentFooter layout and tokens.
 * Back | (summary) | Save & Exit + Primary CTA
 */
export function TransactionFlowFooter({
  currentStep,
  totalSteps,
  primaryLabel,
  primaryDisabled = false,
  onPrimary,
  onBack,
  onSaveAndExit,
  summaryText,
  summaryError = false,
  hideSaveAndExit = false,
}: TransactionFlowFooterProps) {
  const { t } = useTranslation();
  const isFirstStep = currentStep === 0;

  return (
    <footer
      className="transaction-flow-footer"
      role="contentinfo"
      aria-label={t("transactions.footerStepActionsAria")}
    >
      <div className="transaction-flow-footer__inner">
        <div className="transaction-flow-footer__left">
          <Button
            type="button"
            onClick={onBack}
            disabled={isFirstStep}
            className="transaction-flow-footer__back"
            aria-label={isFirstStep ? t("transactions.footerBackDisabledAria") : t("transactions.footerBackAria")}
          >
            {t("transactions.back")}
          </Button>
        </div>
        <div className="transaction-flow-footer__center" aria-live="polite">
          {summaryText && (
            <span
              className={`transaction-flow-footer__summary ${summaryError ? "transaction-flow-footer__summary--error" : ""}`}
            >
              {summaryText}
            </span>
          )}
        </div>
        <div className="transaction-flow-footer__right">
          {!hideSaveAndExit && (
            <Button
              type="button"
              onClick={onSaveAndExit}
              className="transaction-flow-footer__save-exit"
            >
              {t("transactions.saveAndExit")}
            </Button>
          )}
          <Button
            type="button"
            onClick={onPrimary}
            disabled={primaryDisabled}
            className="transaction-flow-footer__primary"
          >
            {primaryLabel}
          </Button>
        </div>
      </div>
    </footer>
  );
}
