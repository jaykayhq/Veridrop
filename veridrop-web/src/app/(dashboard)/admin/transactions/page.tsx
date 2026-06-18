import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";

const transactions = [
  { id: "TXN-001", buyer: "Tunde A.", vendor: "GadgetHub NG", amount: 245000, status: "locked", escrow: "ES-001", date: "2026-06-13" },
  { id: "TXN-002", buyer: "Sarah K.", vendor: "FashionAxis", amount: 89500, status: "passed", escrow: "ES-002", date: "2026-06-13" },
  { id: "TXN-003", buyer: "Michael O.", vendor: "TechPlus", amount: 520000, status: "disputed", escrow: "ES-003", date: "2026-06-12" },
  { id: "TXN-004", buyer: "Chioma E.", vendor: "LuxWear", amount: 34200, status: "delivered", escrow: "ES-004", date: "2026-06-12" },
  { id: "TXN-005", buyer: "James D.", vendor: "GadgetHub NG", amount: 156000, status: "refunded", escrow: "ES-005", date: "2026-06-11" },
  { id: "TXN-006", buyer: "Amina B.", vendor: "StyleLab", amount: 78000, status: "in_transit", escrow: "ES-006", date: "2026-06-11" },
  { id: "TXN-007", buyer: "Peter O.", vendor: "ElectroMart", amount: 312000, status: "locked", escrow: "ES-007", date: "2026-06-10" },
  { id: "TXN-008", buyer: "Ngozi M.", vendor: "FashionAxis", amount: 45500, status: "delivered", escrow: "ES-008", date: "2026-06-10" },
];

export default function AdminTransactions() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Transactions</h1>
        <p className="text-sm text-[#666] mt-1">All escrow transactions across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Total Volume</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">{formatCurrency(1480200)}</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Active Escrows</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">342</p>
        </div>
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-4">
          <p className="text-xs text-[#666] uppercase tracking-wider">Avg. Transaction</p>
          <p className="text-lg font-semibold text-[#e8e8e8] mt-1">{formatCurrency(185025)}</p>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "escrow", header: "Escrow" },
            { key: "buyer", header: "Buyer" },
            { key: "vendor", header: "Vendor" },
            {
              key: "amount",
              header: "Amount",
              className: "font-medium",
              render: (row) => formatCurrency(row.amount as number),
            },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            {
              key: "date",
              header: "Date",
              render: (row) => (
                <span className="text-[#666]">{formatDate(row.date as string)}</span>
              ),
            },
          ]}
          data={transactions}
        />
      </div>
    </div>
  );
}
