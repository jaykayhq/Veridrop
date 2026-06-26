import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminTransactions } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function AdminTransactions() {
  await requireAdmin();
  const data = await getAdminTransactions();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Transactions</h1>
        <p className="text-sm text-text-muted mt-1">All escrow transactions across the platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Volume</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{formatCurrency(data.totalVolume)}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active Escrows</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.activeEscrows}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Avg. Transaction</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{formatCurrency(data.avgAmount)}</p>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default">
        <DataTable
          columns={[
            { key: "_id", header: "ID" },
            { key: "buyerName", header: "Buyer" },
            { key: "vendorName", header: "Vendor" },
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
              key: "createdAt",
              header: "Date",
              render: (row) => (
                <span className="text-text-muted">{formatDate(row.createdAt as string)}</span>
              ),
            },
          ]}
          data={data.transactions}
        />
      </div>
    </div>
  );
}
