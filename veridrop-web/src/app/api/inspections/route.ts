import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Inspection, User, Order } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  let inspections = (await db.inspections.find({})) as Inspection[];

  if (orderId) inspections = inspections.filter((i) => i.orderId === orderId);
  if (auth.role === "inspector") inspections = inspections.filter((i) => i.inspectorId === auth.userId);

  const enriched = await Promise.all(
    inspections.map(async (ins) => {
      const [inspector, order] = await Promise.all([
        db.users.findOne({ _id: ins.inspectorId }) as Promise<User | null>,
        db.orders.findOne({ _id: ins.orderId }) as Promise<Order | null>,
      ]);
      return {
        ...ins,
        inspectorName: inspector?.name || "Unknown",
        productName: order?.productName || "Unknown",
      };
    })
  );

  return ok(enriched);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== "vendor") return err("Forbidden", 403);

  const { orderId, inspectorId } = await req.json();
  if (!orderId || !inspectorId) return err("Missing orderId or inspectorId");

  const orders = (await db.orders.find({})) as Order[];
  const order = orders.find((o) => o._id === orderId);
  if (!order) return err("Order not found", 404);
  if (order.vendorId !== auth.userId) return err("This order does not belong to you", 403);

  const users = (await db.users.find({})) as User[];
  const inspector = users.find((u) => u._id === inspectorId);
  if (!inspector || inspector.role !== "inspector") return err("Invalid inspector", 400);

  const inspection = {
    _id: id(),
    orderId,
    inspectorId,
    status: "pending" as const,
    photos: [],
    notes: "",
    createdAt: new Date().toISOString(),
  };

  await db.inspections.insert(inspection);
  return ok(inspection);
}
