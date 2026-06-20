import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { Dispute } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { id: recordId } = await params;

  const dispute = (await db.disputes.findOne({ _id: recordId })) as Dispute | null;
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

  const dispute = (await db.disputes.findOne({ _id: recordId })) as Dispute | null;
  if (!dispute) return err("Dispute not found", 404);

  const update: Record<string, unknown> = { status };
  if (resolution) update.resolution = resolution;
  if (status === "resolved") update.resolvedAt = new Date().toISOString();

  await db.disputes.update({ _id: recordId }, { $set: update });

  return ok({ ...dispute, ...update });
}
