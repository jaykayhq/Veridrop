import { requireVendor } from "@/lib/api/auth-server";
import { getVendorOrders } from "@/lib/api/queries";
import OrderTable from "./order-table";

export default async function VendorOrders() {
  const user = await requireVendor();
  const data = await getVendorOrders(user._id);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-text-primary">Orders</h1>
          <p className="text-sm text-text-muted mt-1">All your escrow-locked orders</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
          + New Order
        </button>
      </div>

      {data.orders.length > 0 ? (
        <OrderTable orders={data.orders} />
      ) : (
        <div className="bg-surface rounded-xl border border-default p-8 text-center text-sm text-text-muted">
          No orders yet. Orders will appear here once customers make purchases.
        </div>
      )}
    </div>
  );
}
