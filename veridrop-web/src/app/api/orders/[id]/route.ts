// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_ORDERS, MOCK_ESCROWS, MOCK_USERS } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const order = MOCK_ORDERS.find((o) => o._id === recordId);
  if (!order) return err("Order not found", 404);

  const escrow = MOCK_ESCROWS.find((e) => e.orderId === recordId);
  const buyer = MOCK_USERS.find((u) => u._id === order.buyerId);
  const vendor = MOCK_USERS.find((u) => u._id === order.vendorId);

  return ok({
    ...order,
    escrow,
    buyerName: buyer?.name || "Unknown",
    vendorName: vendor?.name || "Unknown",
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;
  const { status: newStatus } = await req.json();
  if (!newStatus) return err("Missing status");

  const order = MOCK_ORDERS.find((o) => o._id === recordId);
  if (!order) return err("Order not found", 404);

  // TODO: real workflow — validate role-based transitions, update escrow, etc.
  const updated = { ...order, status: newStatus };

  return ok(updated);
}
