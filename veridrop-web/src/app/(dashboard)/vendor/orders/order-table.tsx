"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusFilters = ["all", "pending", "locked", "passed", "in_transit", "delivered", "disputed", "refunded"];

interface OrderTableProps {
  orders: any[];
}

export default function OrderTable({ orders }: OrderTableProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const filtered = activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
              activeFilter === f
                ? "bg-brand-teal-light text-white border-brand-teal-light"
                : "bg-transparent text-text-muted border-default hover:border-hover"
            }`}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "Order" },
            { key: "buyerName", header: "Buyer" },
            { key: "productName", header: "Product" },
            { key: "amount", header: "Amount", className: "font-medium", render: (row) => formatCurrency(row.amount as number) },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
            { key: "createdAt", header: "Date", render: (row) => <span className="text-text-muted">{formatDate(row.createdAt as string)}</span> },
          ]}
          data={filtered}
        />
      </div>
    </>
  );
}
