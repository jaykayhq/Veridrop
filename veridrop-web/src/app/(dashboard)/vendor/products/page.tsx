import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorProducts } from "@/lib/api/queries";

export default async function VendorProducts() {
  const user = await requireVendor();
  const data = await getVendorProducts(user._id);

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
          <p className="text-lg font-semibold text-text-primary mt-1">{data.activeListings}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Out of Stock</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.outOfStock}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Sales Value</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{formatCurrency(data.totalSales)}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "category", header: "Category" },
            { key: "price", header: "Price", className: "font-medium", render: (row) => formatCurrency(row.price as number) },
            { key: "stock", header: "Stock", render: (row) => <span className={(row.stock as number) === 0 ? "text-danger font-medium" : ""}>{(row.stock as number)}</span> },
            { key: "sales", header: "Sales" },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={data.products}
        />
      </div>
    </div>
  );
}
