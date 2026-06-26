import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminDispatch } from "@/lib/api/queries";
import DispatchRiderMap from "@/components/dispatch-rider-map";

export default async function AdminDispatch() {
  await requireAdmin();
  const data = await getAdminDispatch();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dispatch Network</h1>
        <p className="text-sm text-text-muted mt-1">Delivery companies and rider management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Companies</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.totalCompanies}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">{data.activeCompanies}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Riders</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.totalRiders}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Deliveries</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.totalDeliveries.toLocaleString()}</p>
        </div>
      </div>

      {/* Live Network Map */}
      <DispatchRiderMap
        companyName="Platform-Wide Network"
        height={400}
      />

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "name", header: "Company" },
            { key: "activeRiders", header: "Riders" },
            { key: "deliveriesToday", header: "Deliveries" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
          ]}
          data={data.companies}
        />
      </div>
    </div>
  );
}
