import { createContext, useContext, useCallback, type ReactNode } from "react";

type OpenWizardFn = () => void;

const InvestmentWizardContext = createContext<OpenWizardFn | null>(null);

export function InvestmentWizardProvider({
  children,
  openWizard,
}: {
  children: ReactNode;
  openWizard: OpenWizardFn;
}) {
  return (
    <InvestmentWizardContext.Provider value={openWizard}>
      {children}
    </InvestmentWizardContext.Provider>
  );
}

export function useInvestmentWizardOpen(): OpenWizardFn | null {
  return useContext(InvestmentWizardContext);
}
