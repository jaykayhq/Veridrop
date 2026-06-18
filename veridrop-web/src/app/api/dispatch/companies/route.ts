// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err, id } from "@/lib/api/helpers";
import { MOCK_DISPATCH_COMPANIES, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const vendorId = searchParams.get("vendorId");

    let companies = MOCK_DISPATCH_COMPANIES;
    if (vendorId) {
      companies = companies.filter((c) => c.vendorId === vendorId);
    }

    await delay();
    return ok(companies);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "vendor") return err("Forbidden", 403);

    const { name, coverage } = await req.json();
    if (!name) return err("Missing required field: name");

    // TODO: real creation with database
    const company = {
      _id: id(),
      name,
      vendorId: auth.userId,
      status: "available",
      activeRiders: 0,
      deliveriesToday: 0,
      onboarding: false,
      coverage: coverage || [],
      createdAt: new Date().toISOString(),
    };

    await delay();
    return ok(company);
  } catch (e) {
    return err((e as Error).message);
  }
}
