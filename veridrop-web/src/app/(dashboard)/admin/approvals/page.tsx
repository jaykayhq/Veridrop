import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminApprovals } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function AdminApprovals() {
  await requireAdmin();
  const data = await getAdminApprovals();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Approvals</h1>
        <p className="text-sm text-text-muted mt-1">Vendor, inspector, and rider onboarding queue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Pending</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.pending}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Vendors</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.vendors}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Inspectors</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.inspectors}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Riders</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.riders}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "name", header: "Name" },
            {
              key: "role",
              header: "Type",
              render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-text-secondary border border-subtle">
                  {row.role as string}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            {
              key: "createdAt",
              header: "Applied",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.createdAt as string)}</span>
              ),
            },
          ]}
          data={data.approvals}
        />
      </div>
    </div>
  );
}
