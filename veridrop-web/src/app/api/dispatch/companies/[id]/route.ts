// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_DISPATCH_COMPANIES, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const company = MOCK_DISPATCH_COMPANIES.find((c) => c._id === id);
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

    await delay();
    return ok(company);
  } catch (e) {
    return err((e as Error).message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);
    if (auth.role !== "vendor" && auth.role !== "admin") return err("Forbidden", 403);

    const company = MOCK_DISPATCH_COMPANIES.find((c) => c._id === id);
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

    // TODO: real update with database
    const updates = await req.json();
    const allowed = ["status", "coverage", "name"];
    const updated = { ...company };
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        (updated as Record<string, unknown>)[key] = updates[key];
      }
    }

    await delay();
    return ok(updated);
  } catch (e) {
    return err((e as Error).message);
  }
}
