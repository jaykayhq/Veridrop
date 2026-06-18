"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";

const allOrders = [
  { id: "ORD-001", buyer: "Tunde A.", product: "iPhone 15 Pro", amount: 245000, status: "locked", inspector: "Chidi E.", date: "2026-06-13" },
  { id: "ORD-002", buyer: "Sarah K.", product: "Gucci Bag", amount: 89500, status: "passed", inspector: "Grace O.", date: "2026-06-13" },
  { id: "ORD-003", buyer: "Michael O.", product: "MacBook Air", amount: 520000, status: "disputed", inspector: "Chidi E.", date: "2026-06-12" },
  { id: "ORD-004", buyer: "Chioma E.", product: "Nike Air Max", amount: 34200, status: "delivered", inspector: "Blessing J.", date: "2026-06-12" },
  { id: "ORD-005", buyer: "James D.", product: "Samsung S25", amount: 156000, status: "refunded", inspector: "Grace O.", date: "2026-06-11" },
  { id: "ORD-006", buyer: "Amina B.", product: "Louis Vuitton Bag", amount: 445000, status: "in_transit", inspector: "Chidi E.", date: "2026-06-11" },
  { id: "ORD-007", buyer: "Peter O.", product: "Dell XPS 15", amount: 312000, status: "locked", inspector: "Blessing J.", date: "2026-06-10" },
  { id: "ORD-008", buyer: "Ngozi M.", product: "Rolex Submariner", amount: 1250000, status: "passed", inspector: "Grace O.", date: "2026-06-10" },
  { id: "ORD-009", buyer: "Funke A.", product: "iPad Pro", amount: 189000, status: "pending", inspector: "—", date: "2026-06-09" },
  { id: "ORD-010", buyer: "Ibrahim S.", product: "PS5", amount: 445000, status: "in_transit", inspector: "Chidi E.", date: "2026-06-09" },
];

const statusFilters = ["all", "pending", "locked", "passed", "in_transit", "delivered", "disputed", "refunded"];

export default function VendorOrders() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all" ? allOrders : allOrders.filter((o) => o.status === activeFilter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#e8e8e8]">Orders</h1>
          <p className="text-sm text-[#666] mt-1">All your escrow-locked orders</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          + New Order
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
              activeFilter === f
                ? "bg-[#00bda6] text-white border-[#00bda6]"
                : "bg-transparent text-[#666] border-[#1f1f1f] hover:border-[#333]"
            }`}
          >
            {f === "all" ? "All" : f.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <DataTable
          columns={[
            { key: "id", header: "Order" },
            { key: "buyer", header: "Buyer" },
            { key: "product", header: "Product" },
            { key: "amount", header: "Amount", className: "font-medium", render: (row) => formatCurrency(row.amount as number) },
            { key: "inspector", header: "Inspector" },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
            { key: "date", header: "Date", render: (row) => <span className="text-[#666]">{formatDate(row.date as string)}</span> },
          ]}
          data={filtered}
        />
      </div>
    </div>
  );
}
