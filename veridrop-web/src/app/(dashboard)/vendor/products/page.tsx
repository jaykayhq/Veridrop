import { StatusBadge } from "@/components/status-badge";
import { formatCurrency } from "@/lib/utils";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorProducts } from "@/lib/api/queries";
import { VendorProductsClient } from "./vendor-products-client";

export default async function VendorProducts() {
  const user = await requireVendor();
  const data = await getVendorProducts(user._id);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Products</h1>
        <p className="text-sm text-text-muted mt-1">Manage your product listings — items appear on your storefront</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Active Listings</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.activeListings}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Out of Stock</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{data.outOfStock}</p>
        </div>
        <div className="bg-surface rounded-xl border border-default p-4">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total Sales Value</p>
          <p className="text-lg font-semibold text-text-primary mt-1">{formatCurrency(data.totalSales)}</p>
        </div>
      </div>

      <VendorProductsClient initialProducts={data.products} />
    </div>
  );
}
