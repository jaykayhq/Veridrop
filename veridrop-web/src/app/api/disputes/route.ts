import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Dispute, Order } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let disputes = (await db.disputes.find({})) as Dispute[];

  if (auth.role === "buyer") disputes = disputes.filter((d) => d.buyerId === auth.userId);
  else if (auth.role === "vendor") disputes = disputes.filter((d) => d.vendorId === auth.userId);
  else if (auth.role !== "admin") return err("Forbidden", 403);

  if (status) disputes = disputes.filter((d) => d.status === status);

  return ok(disputes);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { orderId, reason, amount } = await req.json();
  if (!orderId || !reason || amount === undefined) return err("Missing required fields: orderId, reason, amount");

  const orders = (await db.orders.find({})) as Order[];
  const order = orders.find((o) => o._id === orderId);
  if (!order) return err("Order not found", 404);
  if (order.buyerId !== auth.userId) return err("Forbidden: not your order");

  const dispute = {
    _id: id(),
    orderId,
    buyerId: auth.userId,
    vendorId: order.vendorId,
    amount,
    reason,
    status: "pending" as const,
    filedAt: new Date().toISOString(),
  };

  await db.disputes.insert(dispute);
  return ok(dispute);
}
