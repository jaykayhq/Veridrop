import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { db } from "@/lib/api/db";
import type { DispatchCompany } from "@/lib/api/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const auth = getAuthUser(req);
    if (!auth) return err("Unauthorized", 401);

    const company = (await db.dispatchCompanies.findOne({ _id: id })) as DispatchCompany | null;
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

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

    const company = (await db.dispatchCompanies.findOne({ _id: id })) as DispatchCompany | null;
    if (!company) return err("Company not found", 404);

    if (auth.role === "vendor" && company.vendorId !== auth.userId) return err("Forbidden", 403);

    const updates = await req.json();
    const allowed = ["status", "coverage", "name"];
    const setFields: Record<string, unknown> = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        setFields[key] = updates[key];
      }
    }

    if (Object.keys(setFields).length > 0) {
      await db.dispatchCompanies.update({ _id: id }, { $set: setFields });
    }

    return ok({ ...company, ...setFields });
  } catch (e) {
    return err((e as Error).message);
  }
}
