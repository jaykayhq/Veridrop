import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorDashboard } from "@/lib/api/queries";

export default async function VendorOverview() {
  const user = await requireVendor();
  const data = await getVendorDashboard(user._id);

  const pipeline = {
    pending: data.recentOrders.filter((o) => o.status === "pending").length,
    inTransit: data.recentOrders.filter((o) => ["passed", "in_transit"].includes(o.status)).length,
    delivered: data.recentOrders.filter((o) => o.status === "delivered").length,
    disputed: data.recentOrders.filter((o) => ["disputed", "refunded"].includes(o.status)).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Vendor Overview</h1>
        <p className="text-sm text-text-muted mt-1">{user.business || "Your Store"} &mdash; Welcome back</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Orders" value={String(data.activeOrders)} change="orders in progress" changeType="neutral" icon="📦" />
        <StatCard label="Escrow Balance" value={formatCurrency(data.escrowBalance)} change="awaiting release" changeType="neutral" icon="💰" />
        <StatCard label="This Month" value={formatCurrency(data.monthlyVolume)} change="30-day volume" changeType={data.monthlyVolume > 0 ? "up" : "neutral"} icon="📈" />
        <StatCard label="Inspection Pass Rate" value={`${data.passRate}%`} change="overall pass rate" changeType={data.passRate >= 80 ? "up" : "neutral"} icon="✅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Order Pipeline</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-text-muted">Pending Inspection</span>
                <span className="font-medium text-text-primary">{pipeline.pending}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-warning h-2 rounded-full" style={{ width: `${Math.max((pipeline.pending / Math.max(data.activeOrders, 1)) * 100, 5)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-text-muted">Passed / In Transit</span>
                <span className="font-medium text-text-primary">{pipeline.inTransit}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-teal-light h-2 rounded-full" style={{ width: `${Math.max((pipeline.inTransit / Math.max(data.activeOrders, 1)) * 100, 5)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-text-muted">Delivered</span>
                <span className="font-medium text-text-primary">{pipeline.delivered}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-[#0a54a6] h-2 rounded-full" style={{ width: `${Math.max((pipeline.delivered / Math.max(data.activeOrders, 1)) * 100, 5)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-text-muted">Disputed / Refunded</span>
                <span className="font-medium text-text-primary">{pipeline.disputed}</span>
              </div>
              <div className="w-full bg-border rounded-full h-2">
                <div className="bg-danger h-2 rounded-full" style={{ width: `${Math.max((pipeline.disputed / Math.max(data.activeOrders, 1)) * 100, 5)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg border border-default hover:border-brand-teal-light/40 hover:bg-brand-teal-light/5 transition-colors text-sm font-medium text-text-secondary">
              + Add new product listing
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-default hover:border-brand-teal-light/40 hover:bg-brand-teal-light/5 transition-colors text-sm font-medium text-text-secondary">
              View pending inspection schedule
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-default hover:border-brand-teal-light/40 hover:bg-brand-teal-light/5 transition-colors text-sm font-medium text-text-secondary">
              Request inspector reassignment
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg border border-default hover:border-brand-teal-light/40 hover:bg-brand-teal-light/5 transition-colors text-sm font-medium text-text-secondary">
              Download settlement report
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <div className="px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-text-primary">Recent Orders</h3>
        </div>
        <DataTable
          columns={[
            { key: "_id", header: "Order" },
            { key: "buyerName", header: "Buyer" },
            { key: "productName", header: "Product" },
            { key: "amount", header: "Amount", className: "font-medium text-text-primary", render: (row) => formatCurrency(row.amount as number) },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={data.recentOrders}
        />
      </div>
    </div>
  );
}
