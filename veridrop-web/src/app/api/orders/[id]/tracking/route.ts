// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
// TODO: real GPS tracking integration
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_ORDERS, MOCK_ESCROWS, MOCK_INSPECTIONS, MOCK_USERS } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const order = MOCK_ORDERS.find((o) => o._id === recordId);
  if (!order) return err("Order not found", 404);

  const timeline = [];

  if (order.createdAt) {
    timeline.push({ status: "pending", timestamp: order.createdAt, label: "Order placed" });
  }

  const escrow = MOCK_ESCROWS.find((e) => e.orderId === recordId);
  if (escrow?.createdAt) {
    timeline.push({ status: "locked", timestamp: escrow.createdAt, label: "Payment locked in escrow" });
  }

  const inspection = MOCK_INSPECTIONS.find((i) => i.orderId === recordId);
  if (inspection) {
    timeline.push({
      status: inspection.status === "passed" ? "passed" : "failed",
      timestamp: inspection.completedAt || inspection.createdAt,
      label: inspection.status === "passed" ? "Inspection passed" : "Inspection failed",
    });
  }

  if (order.status === "in_transit" || order.status === "delivered") {
    timeline.push({ status: "in_transit", timestamp: order.createdAt, label: "Picked up for delivery" });
  }

  if (order.status === "delivered") {
    timeline.push({
      status: "delivered",
      timestamp: order.createdAt,
      label: "Delivered successfully",
    });
  }

  let inspectorInfo = null;
  if (inspection) {
    const inspector = MOCK_USERS.find((u) => u._id === inspection.inspectorId);
    inspectorInfo = {
      name: inspector?.name || "Unknown",
      status: inspection.status,
      notes: inspection.notes,
    };
  }

  return ok({
    currentStatus: order.status,
    timeline,
    custodyEvents: [],
    inspector: inspectorInfo,
    location: { lat: 6.5244, lng: 3.3792 },
  });
}
