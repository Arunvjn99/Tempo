import { FigmaTransactionsApp } from "./FigmaTransactionsApp";

/** Full Figma Transaction Center — hub only; flows live at `/transactions/{loan|withdrawal|…}/*`. */
export function TransactionsFull() {
  return <FigmaTransactionsApp />;
}
