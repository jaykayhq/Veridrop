import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminStores } from "@/lib/api/queries";

export default async function AdminStores() {
  await requireAdmin();
  const data = await getAdminStores();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Stores</h1>
        <p className="text-sm text-text-muted mt-1">All vendor storefronts on the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Stores</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.totalStores}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">{data.activeStores}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Pending</p>
          <p className="text-lg font-semibold text-yellow-400 mt-1">{data.pendingStores}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Products</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.totalProducts}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Store Name" },
            {
              key: "slug",
              header: "Link",
              render: (row) => (
                <span className="font-mono text-brand-teal-light text-xs">/s/{row.slug as string}</span>
              ),
            },
            { key: "owner", header: "Owner" },
            { key: "products", header: "Products" },
            { key: "activeProducts", header: "Active" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
          ]}
          data={data.stores}
        />
      </div>
    </div>
  );
}
