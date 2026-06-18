// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_INSPECTIONS, MOCK_USERS, MOCK_ORDERS } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");

  let inspections = MOCK_INSPECTIONS;

  if (orderId) inspections = inspections.filter((i) => i.orderId === orderId);
  if (auth.role === "inspector") inspections = inspections.filter((i) => i.inspectorId === auth.userId);

  const enriched = inspections.map((ins) => {
    const inspector = MOCK_USERS.find((u) => u._id === ins.inspectorId);
    const order = MOCK_ORDERS.find((o) => o._id === ins.orderId);
    return {
      ...ins,
      inspectorName: inspector?.name || "Unknown",
      productName: order?.productName || "Unknown",
    };
  });

  return ok(enriched);
}

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== "vendor") return err("Forbidden", 403);

  const { orderId, inspectorId } = await req.json();
  if (!orderId || !inspectorId) return err("Missing orderId or inspectorId");

  const order = MOCK_ORDERS.find((o) => o._id === orderId);
  if (!order) return err("Order not found", 404);
  if (order.vendorId !== auth.userId) return err("This order does not belong to you", 403);

  const inspector = MOCK_USERS.find((u) => u._id === inspectorId);
  if (!inspector || inspector.role !== "inspector") return err("Invalid inspector", 400);

  // TODO: real dispatch — notify inspector, persist to DB
  const inspection = {
    _id: id(),
    orderId,
    inspectorId,
    status: "pending",
    photos: [],
    notes: "",
    createdAt: new Date().toISOString(),
  };

  return ok(inspection);
}
