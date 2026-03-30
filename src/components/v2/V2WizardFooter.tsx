import type { ReactNode } from "react";

export interface V2WizardFooterProps {
  left?: ReactNode;
  right?: ReactNode;
}

export function V2WizardFooter({ left, right }: V2WizardFooterProps) {
  return (
    <footer className="v2-wizard-footer">
      <div>{left}</div>
      <div className="v2-wizard-footer__right">{right}</div>
    </footer>
  );
}
