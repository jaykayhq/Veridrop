import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/utils";

const users = [
  { id: "USR-001", name: "Tunde Adebayo", email: "tunde@email.com", role: "Buyer", status: "active", joined: "2026-05-01" },
  { id: "USR-002", name: "Amara Okafor", email: "amara@fashionaxis.ng", role: "Vendor", status: "active", joined: "2026-04-15" },
  { id: "USR-003", name: "Chidi Eze", email: "chidi.eze@email.com", role: "Inspector", status: "active", joined: "2026-05-10" },
  { id: "USR-004", name: "Blessing John", email: "blessing@email.com", role: "Rider", status: "review", joined: "2026-06-01" },
  { id: "USR-005", name: "Daniel Musa", email: "daniel@techplus.ng", role: "Vendor", status: "pending", joined: "2026-06-12" },
  { id: "USR-006", name: "Faith Peters", email: "faith.p@email.com", role: "Buyer", status: "active", joined: "2026-03-20" },
  { id: "USR-007", name: "Grace Okonkwo", email: "grace@email.com", role: "Inspector", status: "pending", joined: "2026-06-10" },
  { id: "USR-008", name: "Henry Balogun", email: "henry@email.com", role: "Vendor", status: "rejected", joined: "2026-05-28" },
];

export default function AdminUsers() {
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
            { key: "id", header: "ID" },
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
              key: "joined",
              header: "Joined",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.joined as string)}</span>
              ),
            },
          ]}
          data={users}
        />
      </div>
    </div>
  );
}
