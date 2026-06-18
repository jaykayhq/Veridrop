import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";

const inspectors = [
  { id: "INS-001", name: "Chidi Eze", rating: "4.8", assignments: 34, status: "available", lastActive: "2026-06-13" },
  { id: "INS-002", name: "Grace Okonkwo", rating: "4.9", assignments: 28, status: "available", lastActive: "2026-06-13" },
  { id: "INS-003", name: "Blessing John", rating: "4.6", assignments: 19, status: "on_order", lastActive: "2026-06-12" },
  { id: "INS-004", name: "Samuel Ade", rating: "4.7", assignments: 22, status: "active", lastActive: "2026-06-12" },
  { id: "INS-005", name: "Patience Uche", rating: "4.5", assignments: 15, status: "available", lastActive: "2026-06-11" },
];

export default function VendorInspectors() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Inspectors</h1>
        <p className="text-sm text-text-muted mt-1">Available field inspectors in your area</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Available Now</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">3</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">On Assignment</p>
          <p className="text-lg font-semibold text-text-primary mt-1">2</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Avg. Rating</p>
          <p className="text-lg font-semibold text-text-primary mt-1">4.7 / 5.0</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
            {
              key: "rating",
              header: "Rating",
              render: (row) => (
                <span className="flex items-center gap-1">
                  <span className="text-brand-gold">★</span> {row.rating as string}
                </span>
              ),
            },
            { key: "assignments", header: "Assignments" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            { key: "lastActive", header: "Last Active" },
          ]}
          data={inspectors}
        />
      </div>
    </div>
  );
}
