import { db } from "./db";
import type { DispatchCompany, Rider, Order } from "./types";

const ACTIVE_DELIVERY_STATUSES = ["in_transit"] as const;

export async function getCompanyById(companyId: string): Promise<DispatchCompany | null> {
  return (await db.dispatchCompanies.findOne({ _id: companyId })) as DispatchCompany | null;
}

export async function getCompanyRiders(companyId: string): Promise<Rider[]> {
  return (await db.riders.find({ companyId })) as Rider[];
}

export async function getCompanyDashboard(companyId: string) {
  const riders = await getCompanyRiders(companyId);
  const orders = (await db.orders.find({})) as Order[];
  const companyOrders = orders.filter((o) => o.dispatchId === companyId);

  return {
    activeDeliveries: companyOrders.filter((o) =>
      (ACTIVE_DELIVERY_STATUSES as readonly string[]).includes(o.status),
    ).length,
    pendingPickup: companyOrders.filter((o) => o.status === "passed").length,
    deliveredToday: companyOrders.filter((o) => o.status === "delivered").length,
    qrScansToday: companyOrders.filter((o) => o.status === "delivered").length,
    activeRiders: riders.filter((r) => r.status === "available" || r.status === "on_delivery").length,
    totalRiders: riders.length,
    recentDeliveries: companyOrders.slice(-5).reverse(),
  };
}

export async function getRiderAssignments(riderId: string): Promise<Order[]> {
  const orders = (await db.orders.find({ riderId })) as Order[];
  return orders.reverse();
}
