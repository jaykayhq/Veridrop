import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { getVendorInspectors } from "@/lib/api/queries";

export default async function VendorInspectors() {
  const data = await getVendorInspectors();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Inspectors</h1>
        <p className="text-sm text-text-muted mt-1">Available field inspectors in your area</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Available Now</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">{data.available}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Inspectors</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.total}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Avg. Rating</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.inspectors.length > 0 ? "4.7" : "\u2014"} / 5.0</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "name", header: "Name" },
            {
              key: "rating",
              header: "Rating",
              render: (row) => (
                <span className="flex items-center gap-1">
                  <span className="text-brand-gold">★</span> {(row as any).rating || "4.5"}
                </span>
              ),
            },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={data.inspectors}
        />
      </div>
    </div>
  );
}
