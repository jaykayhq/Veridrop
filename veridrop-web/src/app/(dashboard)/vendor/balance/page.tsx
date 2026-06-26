import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorBalance } from "@/lib/api/queries";

export const dynamic = "force-dynamic";

export default async function VendorBalance() {
  const user = await requireVendor();
  const data = await getVendorBalance(user._id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Balance</h1>
        <p className="text-sm text-text-muted mt-1">Your wallets and escrow holdings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-3xl font-semibold text-text-primary">{formatCurrency(data.availableBalance)}</p>
          <p className="text-xs text-emerald-400 mt-2">Settled and withdrawable</p>
          <Link
            href="/vendor/store"
            className="mt-4 w-full px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity inline-block text-center"
          >
            Withdraw Funds
          </Link>
        </div>

        <div className="bg-surface rounded-xl border border-default p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Escrow Locked</p>
          <p className="text-3xl font-semibold text-text-primary">{formatCurrency(data.escrowLocked)}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Total locked in escrow</span>
              <span className="font-medium text-text-primary">{formatCurrency(data.escrowLocked)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Orders placed</span>
              <span className="font-medium text-text-primary">{data.breakdown.totalOrders}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Delivered</span>
              <span className="font-medium text-text-primary">{data.breakdown.deliveredOrders}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-default p-6">
          <p className="text-xs text-text-muted uppercase tracking-wider mb-1">Security Reserve</p>
          <p className="text-3xl font-semibold text-text-primary">{formatCurrency(data.securityReserve)}</p>
          <p className="text-xs text-text-muted mt-2">Holdback on delivered orders</p>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-muted">Reserve</span>
              <span className="font-medium text-text-primary">{formatCurrency(data.securityReserve)}</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div className="bg-brand-teal-light h-2 rounded-full" style={{ width: `${Math.min((data.securityReserve / 50000) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-default p-6">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Balance Breakdown</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Total Orders</p>
            <p className="font-semibold text-text-primary">{data.breakdown.totalOrders}</p>
          </div>
          <div>
            <p className="text-text-muted">Delivered</p>
            <p className="font-semibold text-text-primary">{data.breakdown.deliveredOrders}</p>
          </div>
          <div>
            <p className="text-text-muted">Pending Amount</p>
            <p className="font-semibold text-text-primary">{formatCurrency(data.breakdown.pendingAmount)}</p>
          </div>
          <div>
            <p className="text-text-muted">Holdback</p>
            <p className="font-semibold text-text-primary">{formatCurrency(data.breakdown.holdbackReserve)}</p>
          </div>
          <div>
            <p className="text-text-muted">Net Available</p>
            <p className="font-semibold text-text-primary">{formatCurrency(data.breakdown.netAvailable)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
