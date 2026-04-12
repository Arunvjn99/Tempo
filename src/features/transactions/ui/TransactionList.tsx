import { useState } from "react";
import {
  Eye,
  Download,
  ArrowLeftRight,
  HandCoins,
  DollarSign,
  RefreshCcw,
  Repeat,
  ChevronDown,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/core/lib/utils";

interface Transaction {
  id: string;
  type: "Loan" | "Withdrawal" | "Transfer" | "Rebalance" | "Rollover";
  amount: string;
  status: "Completed" | "Processing" | "Cancelled";
  date: string;
  description: string;
  transactionId: string;
  processedBy: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "4",
    type: "Transfer",
    amount: "$1,500",
    status: "Completed",
    date: "March 5, 2026",
    description: "Reallocation from Conservative to Growth Fund",
    transactionId: "TRX-2026-0305-001",
    processedBy: "System",
  },
  {
    id: "5",
    type: "Loan",
    amount: "$2,000",
    status: "Completed",
    date: "February 28, 2026",
    description: "General Purpose Loan - 12 month term",
    transactionId: "LN-2026-0228-045",
    processedBy: "Plan Administrator",
  },
  {
    id: "6",
    type: "Withdrawal",
    amount: "$1,000",
    status: "Completed",
    date: "February 15, 2026",
    description: "Hardship withdrawal for medical expenses",
    transactionId: "WD-2026-0215-023",
    processedBy: "Compliance Team",
  },
  {
    id: "7",
    type: "Rebalance",
    amount: "—",
    status: "Completed",
    date: "January 20, 2026",
    description: "Quarterly portfolio rebalance to target allocation",
    transactionId: "RB-2026-0120-012",
    processedBy: "System",
  },
  {
    id: "8",
    type: "Transfer",
    amount: "$800",
    status: "Completed",
    date: "January 10, 2026",
    description: "Moved funds to International Equity Fund",
    transactionId: "TRX-2026-0110-088",
    processedBy: "System",
  },
  {
    id: "9",
    type: "Withdrawal",
    amount: "$500",
    status: "Processing",
    date: "January 5, 2026",
    description: "In-service distribution request",
    transactionId: "WD-2026-0105-067",
    processedBy: "Pending Review",
  },
  {
    id: "10",
    type: "Rollover",
    amount: "$18,500",
    status: "Completed",
    date: "December 12, 2025",
    description: "Rollover from Acme Corp 401(k) via Fidelity",
    transactionId: "RO-2025-1212-003",
    processedBy: "Plan Administrator",
  },
];

type FilterType =
  | "All"
  | "Loans"
  | "Withdrawals"
  | "Transfers"
  | "Rebalance"
  | "Rollovers";

const typeIcons: Record<Transaction["type"], React.ReactNode> = {
  Loan: <HandCoins className="h-[13px] w-[13px]" />,
  Withdrawal: <DollarSign className="h-[13px] w-[13px]" />,
  Transfer: <ArrowLeftRight className="h-[13px] w-[13px]" />,
  Rebalance: <RefreshCcw className="h-[13px] w-[13px]" />,
  Rollover: <Repeat className="h-[13px] w-[13px]" />,
};

const typeChipClass: Record<Transaction["type"], string> = {
  Loan: "bg-primary/10 text-brand",
  Withdrawal: "bg-danger/10 text-danger",
  Transfer: "bg-primary/10 text-brand",
  Rebalance: "bg-success/10 text-success",
  Rollover: "bg-primary/10 text-brand",
};

function statusStyles(status: Transaction["status"]) {
  switch (status) {
    case "Completed":
      return {
        chip: "bg-success/10 text-success",
        dot: "bg-success",
      };
    case "Processing":
      return {
        chip: "bg-primary/10 text-brand",
        dot: "bg-primary",
      };
    case "Cancelled":
      return {
        chip: "bg-background-tertiary text-secondary",
        dot: "bg-muted-foreground",
      };
    default:
      return { chip: "bg-background-tertiary text-secondary", dot: "bg-muted-foreground" };
  }
}

export function TransactionList({ maxItems }: { maxItems?: number } = {}) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filters: FilterType[] = [
    "All",
    "Loans",
    "Withdrawals",
    "Transfers",
    "Rebalance",
    "Rollovers",
  ];

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Loans") return transaction.type === "Loan";
    if (selectedFilter === "Withdrawals")
      return transaction.type === "Withdrawal";
    if (selectedFilter === "Transfers") return transaction.type === "Transfer";
    if (selectedFilter === "Rebalance") return transaction.type === "Rebalance";
    if (selectedFilter === "Rollovers") return transaction.type === "Rollover";
    return true;
  });

  const displayedTransactions = maxItems
    ? filteredTransactions.slice(0, maxItems)
    : filteredTransactions;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div className="hidden gap-1 rounded-xl border border-default bg-background-secondary p-1 sm:flex">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-xs transition-all duration-200",
                selectedFilter === filter
                  ? "border border-default bg-background font-bold text-brand shadow-sm"
                  : "border border-transparent font-medium text-secondary hover:text-primary",
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex w-full items-center justify-between rounded-[10px] border-[1.5px] border-default bg-background px-3.5 py-2 text-[13px] font-semibold text-primary"
          >
            <span>Filter: {selectedFilter}</span>
            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 text-secondary transition-transform",
                mobileFilterOpen && "rotate-180",
              )}
            />
          </button>
          {mobileFilterOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-default bg-background shadow-elevation-md"
            >
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(filter);
                    setMobileFilterOpen(false);
                  }}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-[13px] transition-colors",
                    selectedFilter === filter
                      ? "bg-primary/10 font-bold text-brand"
                      : "font-medium text-primary hover:bg-background-secondary",
                  )}
                >
                  {filter}
                </button>
              ))}
            </motion.div>
          ) : null}
        </div>

        <span className="hidden text-xs font-medium text-secondary sm:block">
          Showing {filteredTransactions.length} transaction
          {filteredTransactions.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3 sm:hidden">
        {displayedTransactions.map((transaction, idx) => {
          const st = statusStyles(transaction.status);
          const typeClass = typeChipClass[transaction.type];
          return (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-[14px] border border-default bg-surface-card px-4 py-3.5"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-[30px] w-[30px] items-center justify-center rounded-lg",
                      typeClass,
                    )}
                  >
                    {typeIcons[transaction.type]}
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-primary">{transaction.type}</p>
                    <p className="font-mono text-[10px] font-medium text-secondary">
                      {transaction.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-primary">{transaction.amount}</p>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                      st.chip,
                    )}
                  >
                    <span
                      className={cn(
                        "h-[5px] w-[5px] rounded-full",
                        st.dot,
                        transaction.status === "Processing" && "animate-pulse",
                      )}
                    />
                    {transaction.status}
                  </span>
                </div>
              </div>

              <p className="mb-2 line-clamp-2 text-xs font-medium text-primary/80">
                {transaction.description}
              </p>

              <div className="flex items-center justify-between border-t border-default pt-2">
                <span className="text-[11px] font-medium text-secondary">{transaction.date}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="View Details"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-default bg-background text-secondary transition-colors hover:text-primary"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Download Receipt"
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-default bg-background text-secondary transition-colors hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-[13px] font-medium text-secondary">No transactions found</p>
          </div>
        ) : null}

        <div className="pt-1 text-center">
          <span className="text-[11px] font-medium text-secondary">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto rounded-[14px] border border-default sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-default bg-gradient-to-br from-background-secondary to-background-tertiary">
              {["Type", "Description", "Amount", "Status", "Date"].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-[10.5px] font-bold uppercase tracking-[0.5px] text-secondary"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedTransactions.map((transaction, idx) => {
              const st = statusStyles(transaction.status);
              const typeClass = typeChipClass[transaction.type];
              return (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group border-b border-default transition-colors duration-200 hover:bg-accent"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-[30px] w-[30px] items-center justify-center rounded-lg text-[13px] font-bold",
                          typeClass,
                        )}
                      >
                        {typeIcons[transaction.type]}
                      </span>
                      <span className="text-[13px] font-semibold text-primary">{transaction.type}</span>
                    </div>
                  </td>
                  <td className="max-w-[220px] px-4 py-3.5">
                    <span className="block truncate text-[13px] font-medium text-primary/80">
                      {transaction.description}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[13px] font-bold text-primary">{transaction.amount}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold",
                        st.chip,
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          st.dot,
                          transaction.status === "Processing" && "animate-pulse",
                        )}
                      />
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs font-medium text-secondary">{transaction.date}</span>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[13px] font-medium text-secondary">No transactions found</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
