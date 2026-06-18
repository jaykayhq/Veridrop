// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_DISPUTES } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const dispute = MOCK_DISPUTES.find((d) => d._id === recordId);
  if (!dispute) return err("Dispute not found", 404);

  if (auth.role !== "admin" && dispute.buyerId !== auth.userId && dispute.vendorId !== auth.userId) {
    return err("Forbidden", 403);
  }

  return ok(dispute);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth || auth.role !== "admin") return err("Forbidden", 403);

  const { id: recordId } = await params;
  const { status, resolution } = await req.json();
  if (!status) return err("Missing required field: status");

  const dispute = MOCK_DISPUTES.find((d) => d._id === recordId);
  if (!dispute) return err("Dispute not found", 404);

  // TODO: real resolution workflow — update escrow/order status based on resolution
  const updated: Record<string, unknown> = { ...dispute, status };
  if (resolution) updated.resolution = resolution;
  if (status === "resolved") updated.resolvedAt = new Date().toISOString();

  return ok(updated);
}
