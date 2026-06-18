import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";

const disputes = [
  { id: "DSP-001", order: "TXN-003", buyer: "Michael O.", vendor: "TechPlus", amount: 520000, reason: "Product mismatch", status: "review", filed: "2026-06-12" },
  { id: "DSP-002", order: "TXN-009", buyer: "Funke A.", vendor: "GadgetHub NG", amount: 189000, reason: "Damaged item", status: "pending", filed: "2026-06-11" },
  { id: "DSP-003", order: "TXN-012", buyer: "Ibrahim S.", vendor: "ElectroMart", amount: 445000, reason: "Wrong variant", status: "review", filed: "2026-06-10" },
  { id: "DSP-004", order: "TXN-015", buyer: "Kemi L.", vendor: "FashionAxis", amount: 67000, reason: "Inspection fail disputed", status: "pending", filed: "2026-06-09" },
  { id: "DSP-005", order: "TXN-018", buyer: "Tunde A.", vendor: "StyleLab", amount: 92000, reason: "Missing accessories", status: "resolved", filed: "2026-06-08" },
];

export default function AdminDisputes() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Disputes</h1>
        <p className="text-sm text-[#666] mt-1">Review and resolve transaction disputes</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Open Disputes</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">4</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Under Review</p>
          <p className="text-lg font-semibold text-[#c8a862] mt-1">2</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Avg. Resolution</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">48h</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "order", header: "Order" },
            { key: "buyer", header: "Buyer" },
            { key: "vendor", header: "Vendor" },
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
              key: "filed",
              header: "Filed",
              render: (row) => (
                <span className="text-[#666]">{formatDate(row.filed as string)}</span>
              ),
            },
          ]}
          data={disputes}
        />
      </div>
    </div>
  );
}
