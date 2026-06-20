import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Inspection, User, Order } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const inspection = (await db.inspections.findOne({ _id: recordId })) as Inspection | null;
  if (!inspection) return err("Inspection not found", 404);

  const [inspector, order] = await Promise.all([
    db.users.findOne({ _id: inspection.inspectorId }) as Promise<User | null>,
    db.orders.findOne({ _id: inspection.orderId }) as Promise<Order | null>,
  ]);

  return ok({
    ...inspection,
    inspectorName: inspector?.name || "Unknown",
    productName: order?.productName || "Unknown",
  });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;
  const { status } = await req.json();
  if (!status || !["passed", "failed"].includes(status)) return err("Status must be 'passed' or 'failed'");

  const inspection = (await db.inspections.findOne({ _id: recordId })) as Inspection | null;
  if (!inspection) return err("Inspection not found", 404);
  if (inspection.inspectorId !== auth.userId) return err("Only the assigned inspector can update", 403);

  const now = new Date().toISOString();
  await db.inspections.update({ _id: recordId }, { $set: { status, completedAt: now } });

  return ok({ ...inspection, status, completedAt: now });
}
