// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_INSPECTIONS, MOCK_USERS, MOCK_ORDERS } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const inspection = MOCK_INSPECTIONS.find((i) => i._id === recordId);
  if (!inspection) return err("Inspection not found", 404);

  const inspector = MOCK_USERS.find((u) => u._id === inspection.inspectorId);
  const order = MOCK_ORDERS.find((o) => o._id === inspection.orderId);

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

  const inspection = MOCK_INSPECTIONS.find((i) => i._id === recordId);
  if (!inspection) return err("Inspection not found", 404);
  if (inspection.inspectorId !== auth.userId) return err("Only the assigned inspector can update", 403);

  // TODO: real inspection workflow — update order status, create QR seal, handle escrow
  const now = new Date().toISOString();
  const updated = { ...inspection, status, completedAt: now };

  return ok(updated);
}
