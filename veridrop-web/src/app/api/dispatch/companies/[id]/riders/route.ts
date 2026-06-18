// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_RIDERS, MOCK_DISPATCH_COMPANIES, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: companyId } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const company = MOCK_DISPATCH_COMPANIES.find((c) => c._id === companyId);
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

    // TODO: real query with database
    const riders = MOCK_RIDERS.filter((r) => r.companyId === companyId);

    await delay();
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

    const company = MOCK_DISPATCH_COMPANIES.find((c) => c._id === companyId);
    if (!company) return err("Company not found", 404);
    if (company.vendorId !== auth.userId) return err("Forbidden", 403);

    const { name, phone } = await req.json();
    if (!name || !phone) return err("Missing required fields: name, phone");

    // TODO: real creation with database
    const rider = {
      _id: id(),
      companyId,
      name,
      phone,
      status: "available",
      activeDeliveries: 0,
      totalDeliveries: 0,
      createdAt: new Date().toISOString(),
    };

    await delay();
    return ok(rider);
  } catch (e) {
    return err((e as Error).message);
  }
}
