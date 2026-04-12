import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  status: "Completed" | "Rejected" | "Processing";
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "Loan",
    amount: "$6,000",
    status: "Completed",
    date: "Jan 10, 2024",
  },
  {
    id: "2",
    type: "Withdrawal",
    amount: "$2,000",
    status: "Rejected",
    date: "Dec 12, 2023",
  },
  {
    id: "3",
    type: "Transfer",
    amount: "$1,250",
    status: "Completed",
    date: "Oct 3, 2023",
  },
  {
    id: "4",
    type: "Rebalance",
    amount: "—",
    status: "Completed",
    date: "Sep 15, 2023",
  },
  {
    id: "5",
    type: "Loan",
    amount: "$3,500",
    status: "Completed",
    date: "Aug 22, 2023",
  },
];

export function RecentTransactions() {
  const [filter, setFilter] = useState<string>("all");

  const filteredTransactions = mockTransactions.filter((transaction) => {
    if (filter === "all") return true;
    return transaction.type.toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadgeClass = (status: Transaction["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-success)_50%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-success)_14%,var(--surface-card))]";
      case "Rejected":
        return "bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-danger)_55%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-danger)_12%,var(--surface-card))]";
      case "Processing":
        return "bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))] text-[color-mix(in_srgb,var(--color-warning)_55%,var(--text-primary))] hover:bg-[color-mix(in_srgb,var(--color-warning)_14%,var(--surface-card))]";
      default:
        return "";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary">Recent Transactions</h2>
        
        <Tabs value={filter} onValueChange={setFilter} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="loan">Loans</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            <TabsTrigger value="transfer">Transfers</TabsTrigger>
            <TabsTrigger value="rebalance">Rebalance</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-4 border-b last:border-b-0"
          >
            <div className="flex-1">
              <p className="font-medium text-primary">{transaction.type}</p>
              <p className="text-sm text-secondary">{transaction.date}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <p className="font-semibold text-primary min-w-[80px] text-right">
                {transaction.amount}
              </p>
              <Badge className={getStatusBadgeClass(transaction.status)}>
                {transaction.status}
              </Badge>
            </div>
          </div>
        ))}
        
        {filteredTransactions.length === 0 && (
          <p className="text-center text-secondary py-8">No transactions found</p>
        )}
      </div>
    </Card>
  );
}
