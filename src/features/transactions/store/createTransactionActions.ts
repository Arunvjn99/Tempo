import type { StoreApi } from "zustand";
import type { TransactionActions, TransactionFlowState } from "./types";
import { transactionDataSlice } from "./transactionDataSlice";
import { transactionFlowSlice } from "./transactionFlowSlice";

type TxStore = TransactionFlowState & TransactionActions;
type SetState = StoreApi<TxStore>["setState"];
type GetState = StoreApi<TxStore>["getState"];

export function createTransactionActions(set: SetState, get: GetState): TransactionActions {
  return {
    ...transactionFlowSlice(set, get),
    ...transactionDataSlice(set),
  };
}
