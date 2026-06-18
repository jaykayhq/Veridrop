import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";

const products = [
  { id: "PRD-001", name: "iPhone 15 Pro", category: "Electronics", price: 245000, stock: 12, status: "active", sales: 34 },
  { id: "PRD-002", name: "Gucci GG Marmont Bag", category: "Fashion", price: 89500, stock: 5, status: "active", sales: 18 },
  { id: "PRD-003", name: "MacBook Air M3", category: "Electronics", price: 520000, stock: 3, status: "active", sales: 22 },
  { id: "PRD-004", name: "Nike Air Max 90", category: "Fashion", price: 34200, stock: 28, status: "active", sales: 56 },
  { id: "PRD-005", name: "Samsung Galaxy S25", category: "Electronics", price: 156000, stock: 0, status: "inactive", sales: 41 },
  { id: "PRD-006", name: "Louis Vuitton Neverfull", category: "Fashion", price: 445000, stock: 2, status: "active", sales: 7 },
  { id: "PRD-007", name: "Dell XPS 15", category: "Electronics", price: 312000, stock: 0, status: "inactive", sales: 15 },
];

export default function VendorProducts() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Products</h1>
          <p className="text-sm text-text-muted mt-1">Manage your product listings</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active Listings</p>
          <p className="text-lg font-semibold text-text-primary mt-1">5</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Out of Stock</p>
          <p className="text-lg font-semibold text-text-primary mt-1">2</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Sales Value</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{formatCurrency(3438700)}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "category", header: "Category" },
            { key: "price", header: "Price", className: "font-medium", render: (row) => formatCurrency(row.price as number) },
            { key: "stock", header: "Stock", render: (row) => <span className={row.stock === 0 ? "text-danger font-medium" : ""}>{row.stock as number}</span> },
            { key: "sales", header: "Sales" },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={products}
        />
      </div>
    </div>
  );
}
