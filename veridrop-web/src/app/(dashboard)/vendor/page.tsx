import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";

const recentOrders = [
  { id: "ORD-001", buyer: "Tunde A.", product: "iPhone 15 Pro", amount: 245000, status: "locked", inspector: "Chidi E." },
  { id: "ORD-002", buyer: "Sarah K.", product: "Gucci Bag", amount: 89500, status: "passed", inspector: "Grace O." },
  { id: "ORD-003", buyer: "Michael O.", product: "MacBook Air", amount: 520000, status: "disputed", inspector: "Chidi E." },
  { id: "ORD-004", buyer: "Chioma E.", product: "Nike Air Max", amount: 34200, status: "delivered", inspector: "Blessing J." },
  { id: "ORD-005", buyer: "James D.", product: "Samsung S25", amount: 156000, status: "refunded", inspector: "Grace O." },
];

export default function VendorOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Vendor Overview</h1>
        <p className="text-sm text-[#666] mt-1">GadgetHub NG &mdash; Welcome back</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Orders" value="18" change="4 pending inspection" changeType="neutral" icon="📦" />
        <StatCard label="Escrow Balance" value={formatCurrency(892000)} change="₦245,000 awaiting release" changeType="neutral" icon="💰" />
        <StatCard label="This Month" value={formatCurrency(1250000)} change="+22% vs last month" changeType="up" icon="📈" />
        <StatCard label="Inspection Pass Rate" value="94%" change="2% above platform avg" changeType="up" icon="✅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Order Pipeline</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-[#666]">Pending Inspection</span>
                <span className="font-medium text-[#e8e8e8]">4</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                <div className="bg-[#d97706] h-2 rounded-full" style={{ width: "22%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-[#666]">Passed / In Transit</span>
                <span className="font-medium text-[#e8e8e8]">8</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                <div className="bg-[#00bda6] h-2 rounded-full" style={{ width: "44%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-[#666]">Delivered</span>
                <span className="font-medium text-[#e8e8e8]">5</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                <div className="bg-[#0a54a6] h-2 rounded-full" style={{ width: "28%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-[#666]">Disputed / Refunded</span>
                <span className="font-medium text-[#e8e8e8]">1</span>
              </div>
              <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: "6%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-[#1f1f1f] hover:border-[#00bda6]/40 hover:bg-[#00bda6]/5 transition-colors text-sm font-medium text-[#aaa]">
              + Add new product listing
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-[#1f1f1f] hover:border-[#00bda6]/40 hover:bg-[#00bda6]/5 transition-colors text-sm font-medium text-[#aaa]">
              View pending inspection schedule
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-[#1f1f1f] hover:border-[#00bda6]/40 hover:bg-[#00bda6]/5 transition-colors text-sm font-medium text-[#aaa]">
              Request inspector reassignment
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-[#1f1f1f] hover:border-[#00bda6]/40 hover:bg-[#00bda6]/5 transition-colors text-sm font-medium text-[#aaa]">
              Download settlement report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Recent Orders</h3>
        </div>
        <DataTable
          columns={[
            { key: "id", header: "Order" },
            { key: "buyer", header: "Buyer" },
            { key: "product", header: "Product" },
            { key: "amount", header: "Amount", className: "font-medium text-[#e8e8e8]", render: (row) => formatCurrency(row.amount as number) },
            { key: "inspector", header: "Inspector" },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={recentOrders}
        />
      </div>
    </div>
  );
}
