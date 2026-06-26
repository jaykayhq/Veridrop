import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminDashboard, getAdminApprovals } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  await requireAdmin();
  const [dash, approvals] = await Promise.all([
    getAdminDashboard(),
    getAdminApprovals(),
  ]);

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-semibold text-text-primary">Admin Overview</h1>
        <p className="text-xs sm:text-sm text-text-muted mt-1">Platform-wide metrics and activity</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={String(dash.totalUsers)} change="registered users" changeType="neutral" icon="👥" />
        <StatCard label="Active Orders" value={String(dash.activeOrders)} change="in progress" changeType="neutral" icon="📦" />
        <StatCard label="Escrow Volume" value={formatCurrency(dash.escrowVolume)} change="total volume" changeType="neutral" icon="💰" />
        <StatCard label="Dispute Rate" value={dash.disputeRate} change="of all orders" changeType={parseFloat(dash.disputeRate) < 3 ? "down" : "up"} icon="⚖️" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Pending Approvals</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Vendors</span>
              <span className="font-medium text-text-primary">{approvals.vendors}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Inspectors</span>
              <span className="font-medium text-text-primary">{approvals.inspectors}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Riders</span>
              <span className="font-medium text-text-primary">{approvals.riders}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Order Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Active orders</span>
              <span className="font-medium text-text-primary">{dash.activeOrders}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total volume</span>
              <span className="font-medium text-text-primary">{formatCurrency(dash.escrowVolume)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Dispute rate</span>
              <span className="font-medium text-text-primary">{dash.disputeRate}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-5">
          <h3 className="text-sm font-semibold text-text-primary mb-4">Today&apos;s Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total transactions</span>
              <span className="font-medium text-text-primary">{dash.recentTransactions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Total users</span>
              <span className="font-medium text-text-primary">{dash.totalUsers}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <div className="px-5 py-4 border-b border-default">
          <h3 className="text-sm font-semibold text-text-primary">Recent Transactions</h3>
        </div>
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "buyerName", header: "Buyer" },
            { key: "vendorName", header: "Vendor" },
            { key: "amount", header: "Amount", className: "font-medium", render: (row) => formatCurrency(row.amount as number) },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status as string} /> },
          ]}
          data={dash.recentTransactions}
        />
      </div>
    </div>
  );
}
