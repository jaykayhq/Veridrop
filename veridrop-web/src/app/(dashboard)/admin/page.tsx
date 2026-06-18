import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";

const recentTransactions = [
  { id: "TXN-001", buyer: "Tunde A.", vendor: "GadgetHub NG", amount: "₦245,000", status: "locked", date: "2026-06-13" },
  { id: "TXN-002", buyer: "Sarah K.", vendor: "FashionAxis", amount: "₦89,500", status: "passed", date: "2026-06-13" },
  { id: "TXN-003", buyer: "Michael O.", vendor: "TechPlus", amount: "₦520,000", status: "disputed", date: "2026-06-12" },
  { id: "TXN-004", buyer: "Chioma E.", vendor: "LuxWear", amount: "₦34,200", status: "delivered", date: "2026-06-12" },
  { id: "TXN-005", buyer: "James D.", vendor: "GadgetHub NG", amount: "₦156,000", status: "refunded", date: "2026-06-11" },
];

export default function AdminOverview() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-[#e8e8e8]">Admin Overview</h1>
        <p className="text-sm text-[#666] mt-1">Platform-wide metrics and activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value="1,482" change="+128 this week" changeType="up" icon="👥" />
        <StatCard label="Active Orders" value="347" change="23 pending dispatch" changeType="neutral" icon="📦" />
        <StatCard label="Escrow Volume" value="₦8.2M" change="+12% vs last week" changeType="up" icon="💰" />
        <StatCard label="Dispute Rate" value="2.1%" change="0.3% below target" changeType="down" icon="⚖️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Vendors</span>
              <span className="font-medium text-[#e8e8e8]">12</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Inspectors</span>
              <span className="font-medium text-[#e8e8e8]">8</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Riders</span>
              <span className="font-medium text-[#e8e8e8]">5</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Pending inspection</span>
              <span className="font-medium text-[#e8e8e8]">42</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">In transit</span>
              <span className="font-medium text-[#e8e8e8]">156</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Awaiting delivery scan</span>
              <span className="font-medium text-[#e8e8e8]">89</span>
            </div>
          </div>
        </div>

        <div className="bg-[#111] rounded-xl border border-[#1a1a1a] p-5">
          <h3 className="text-sm font-semibold text-[#e8e8e8] mb-4">Today&apos;s Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Inspections completed</span>
              <span className="font-medium text-[#e8e8e8]">64</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">Escrows released</span>
              <span className="font-medium text-[#e8e8e8]">₦1.2M</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#666]">New registrations</span>
              <span className="font-medium text-[#e8e8e8]">18</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111] rounded-xl border border-[#1a1a1a]">
        <div className="px-5 py-4 border-b border-[#1a1a1a]">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Recent Transactions</h3>
        </div>
        <DataTable
          columns={[
            { key: "id", header: "ID" },
            { key: "buyer", header: "Buyer" },
            { key: "vendor", header: "Vendor" },
            { key: "amount", header: "Amount", className: "font-medium" },
            {
              key: "status",
              header: "Status",
              render: (row) => <StatusBadge status={row.status as string} />,
            },
            { key: "date", header: "Date" },
          ]}
          data={recentTransactions}
        />
      </div>
    </div>
  );
}
