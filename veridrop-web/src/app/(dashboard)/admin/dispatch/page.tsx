import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";

const companies = [
  { id: "DC-001", name: "SwiftLogix", riders: 12, status: "active", deliveries: 1240, coverage: "Lagos, Abuja" },
  { id: "DC-002", name: "RedStar Express", riders: 0, status: "pending", deliveries: 0, coverage: "—" },
  { id: "DC-003", name: "GoLorry NG", riders: 8, status: "active", deliveries: 456, coverage: "Lagos" },
  { id: "DC-004", name: "ShipTop NG", riders: 4, status: "active", deliveries: 189, coverage: "Abuja" },
  { id: "DC-005", name: "QuickSend", riders: 0, status: "pending", deliveries: 0, coverage: "—" },
];

export default function AdminDispatch() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Dispatch Network</h1>
        <p className="text-sm text-[#666] mt-1">Delivery companies and rider management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Companies</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">5</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Active</p>
          <p className="text-lg font-semibold text-emerald-400 mt-1">3</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Riders</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">24</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Deliveries</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">1,885</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "name", header: "Company" },
            { key: "riders", header: "Riders" },
            { key: "deliveries", header: "Deliveries" },
            { key: "coverage", header: "Coverage" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
          ]}
          data={companies}
        />
      </div>
    </div>
  );
}
