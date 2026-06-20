import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Order, Escrow, User } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const order = (await db.orders.findOne({ _id: recordId })) as Order | null;
  if (!order) return err("Order not found", 404);

  const [escrow, buyer, vendor] = await Promise.all([
    db.escrows.findOne({ orderId: recordId }) as Promise<Escrow | null>,
    db.users.findOne({ _id: order.buyerId }) as Promise<User | null>,
    db.users.findOne({ _id: order.vendorId }) as Promise<User | null>,
  ]);

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

  const order = (await db.orders.findOne({ _id: recordId })) as Order | null;
  if (!order) return err("Order not found", 404);

  await db.orders.update({ _id: recordId }, { $set: { status: newStatus } });

  return ok({ ...order, status: newStatus });
}
