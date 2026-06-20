import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { DispatchCompany } from "@/lib/api/types";

export async function GET(req: NextRequest) {
  try {
    const auth = getAuthUser(req);
    if (!auth || auth.role !== "admin") return err("Forbidden", 403);

    const companies = (await db.dispatchCompanies.find({})) as DispatchCompany[];
    const totalRiders = companies.reduce((sum, c) => sum + c.activeRiders, 0);
    const deliveriesToday = companies.reduce((sum, c) => sum + c.deliveriesToday, 0);

    return ok({ companies, totalRiders, deliveriesToday });
  } catch (e) {
    return err((e as Error).message);
  }
}
