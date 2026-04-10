import type { TransferType } from "../types";

export const TRANSFER_TYPES: { id: TransferType; label: string; sub: string }[] = [
  { id: "existing", label: "Existing balance", sub: "Move money between current holdings" },
  { id: "future", label: "Future contributions", sub: "Redirect new contributions" },
];
