// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
// TODO: real chain of custody — validate seal state machine, update order/escrow
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;
  const { action, gps } = await req.json();
  if (!action || !["pickup", "delivery"].includes(action)) return err("Action must be 'pickup' or 'delivery'");

  const now = new Date().toISOString();

  const custodyEvent = {
    userId: auth.userId,
    role: auth.role,
    action,
    gps: gps || undefined,
    timestamp: now,
  };

  const scanResult = {
    _id: recordId,
    scannedBy: auth.userId,
    action,
    custodyEvent,
    timestamp: now,
  };

  return ok(scanResult);
}
