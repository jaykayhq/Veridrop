import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_ORDERS } from "@/lib/api/mock-data";

// TODO: real balance - aggregate from orders/escrow tables in DB
export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const orders = MOCK_ORDERS.filter((o) => o.vendorId === auth.userId);

    let availableBalance = 0;
    let escrowLocked = 0;

    for (const order of orders) {
      if (order.status === "delivered") {
        availableBalance += order.amount;
      } else if (["pending", "locked", "passed", "in_transit"].includes(order.status)) {
        escrowLocked += order.amount;
      }
    }

    const deliveredCount = orders.filter((o) => o.status === "delivered").length;
    const securityReserve = Math.min(deliveredCount, 10) * 5000;

    return ok({
      availableBalance,
      escrowLocked,
      securityReserve,
      breakdown: {
        totalOrders: orders.length,
        deliveredOrders: deliveredCount,
        pendingAmount: escrowLocked,
        holdbackReserve: securityReserve,
        netAvailable: availableBalance - securityReserve,
      },
    });
  } catch (e) {
    return err((e as Error).message);
  }
}
