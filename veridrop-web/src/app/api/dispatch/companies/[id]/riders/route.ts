import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { DispatchCompany, Rider } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: companyId } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const company = (await db.dispatchCompanies.findOne({ _id: companyId })) as DispatchCompany | null;
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

    const riders = (await db.riders.find({ companyId })) as Rider[];
    return ok(riders);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: companyId } = await params;
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "vendor") return err("Forbidden", 403);

    const company = (await db.dispatchCompanies.findOne({ _id: companyId })) as DispatchCompany | null;
    if (!company) return err("Company not found", 404);
    if (company.vendorId !== auth.userId) return err("Forbidden", 403);

    const { name, phone } = await req.json();
    if (!name || !phone) return err("Missing required fields: name, phone");

    const rider = {
      _id: id(),
      companyId,
      name,
      phone,
      status: "available" as const,
      activeDeliveries: 0,
      totalDeliveries: 0,
      createdAt: new Date().toISOString(),
    };

    await db.riders.insert(rider);
    return ok(rider);
  } catch (e) {
    return err((e as Error).message);
  }
}
