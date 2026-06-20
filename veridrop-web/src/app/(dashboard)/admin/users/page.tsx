import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminUsers } from "@/lib/api/queries";

export default async function AdminUsers() {
  await requireAdmin();
  const data = await getAdminUsers();
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Users</h1>
          <p className="text-sm text-text-muted mt-1">All platform users and their roles</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 text-sm border border-default rounded-lg bg-input text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-teal-light focus:border-transparent w-64"
            readOnly
          />
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            {
              key: "role",
              header: "Role",
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
              header: "Joined",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.createdAt as string)}</span>
              ),
            },
          ]}
          data={data.users}
        />
      </div>
    </div>
  );
}
