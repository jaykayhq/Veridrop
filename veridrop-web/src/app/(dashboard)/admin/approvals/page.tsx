import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatDate } from "@/lib/utils";

const pendingApprovals = [
  { id: "APL-001", name: "Daniel Musa", type: "Vendor", business: "TechPlus NG", docs: "CAC, BVN", status: "pending", applied: "2026-06-12" },
  { id: "APL-002", name: "Grace Okonkwo", type: "Inspector", business: "—", docs: "ID, NIN", status: "pending", applied: "2026-06-10" },
  { id: "APL-003", name: "Blessing John", type: "Rider", business: "—", docs: "License, NIN", status: "review", applied: "2026-06-09" },
  { id: "APL-004", name: "Samuel Ade", type: "Vendor", business: "SamTech", docs: "CAC, BVN", status: "pending", applied: "2026-06-08" },
  { id: "APL-005", name: "Patience Uche", type: "Inspector", business: "—", docs: "ID, NIN", status: "review", applied: "2026-06-07" },
  { id: "APL-006", name: "Emeka Nwosu", type: "Vendor", business: "MegaFashion", docs: "CAC, BVN, Bank Ref", status: "pending", applied: "2026-06-07" },
  { id: "APL-007", name: "Fatima Yusuf", type: "Rider", business: "—", docs: "License, NIN, Guarantor", status: "pending", applied: "2026-06-06" },
  { id: "APL-008", name: "Tunde Bakare", type: "Vendor", business: "Bakare Electronics", docs: "CAC, BVN", status: "pending", applied: "2026-06-05" },
];

export default function AdminApprovals() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Approvals</h1>
        <p className="text-sm text-text-muted mt-1">Vendor, inspector, and rider onboarding queue</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Pending</p>
          <p className="text-lg font-semibold text-text-primary mt-1">25</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Vendors</p>
          <p className="text-lg font-semibold text-text-primary mt-1">12</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Inspectors</p>
          <p className="text-lg font-semibold text-text-primary mt-1">8</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Riders</p>
          <p className="text-lg font-semibold text-text-primary mt-1">5</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Name" },
            {
              key: "type",
              header: "Type",
              render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface text-text-secondary border border-subtle">
                  {row.type as string}
                </span>
              ),
            },
            { key: "business", header: "Business" },
            { key: "docs", header: "Documents" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            {
              key: "applied",
              header: "Applied",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.applied as string)}</span>
              ),
            },
          ]}
          data={pendingApprovals}
        />
      </div>
    </div>
  );
}
