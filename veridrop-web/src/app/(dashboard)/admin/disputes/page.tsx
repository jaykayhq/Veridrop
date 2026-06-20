import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminDisputes } from "@/lib/api/queries";

export default async function AdminDisputes() {
  await requireAdmin();
  const data = await getAdminDisputes();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Disputes</h1>
        <p className="text-sm text-text-muted mt-1">Review and resolve transaction disputes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Open Disputes</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.open}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Under Review</p>
          <p className="text-lg font-semibold text-[#c8a862] mt-1">{data.underReview}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Avg. Resolution</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.avgResolutionTime}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "orderId", header: "Order" },
            {
              key: "amount",
              header: "Amount",
              className: "font-medium",
              render: (row) => formatCurrency(row.amount as number),
            },
            { key: "reason", header: "Reason" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            {
              key: "filedAt",
              header: "Filed",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.filedAt as string)}</span>
              ),
            },
          ]}
          data={data.disputes}
        />
      </div>
    </div>
  );
}
