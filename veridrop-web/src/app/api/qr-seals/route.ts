// TODO: Replace mock data with real DB queries (PostgreSQL via Prisma)
// TODO: real seal generation (crypto-signed QR codes)
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";

export async function POST(req: NextRequest) {
  const auth = getAuthUser(req);
  if (!auth) return err("Unauthorized", 401);

  const { orderId } = await req.json();
  if (!orderId) return err("Missing orderId");

  const qrSeal = {
    _id: id(),
    serial: "VRD-" + id(),
    orderId,
    status: "active",
    createdAt: new Date().toISOString(),
  };

  return ok(qrSeal);
}
