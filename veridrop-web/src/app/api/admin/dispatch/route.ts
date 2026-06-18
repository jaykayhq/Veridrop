// TODO: Replace mock data with real database queries
import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_DISPATCH_COMPANIES, delay } from "@/lib/api/mock-data";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const companies = MOCK_DISPATCH_COMPANIES;

    const totalRiders = companies.reduce((sum, c) => sum + c.activeRiders, 0);
    const deliveriesToday = companies.reduce((sum, c) => sum + c.deliveriesToday, 0);

    await delay();
    return ok({ companies, totalRiders, deliveriesToday });
  } catch (e) {
    return err((e as Error).message);
  }
}
