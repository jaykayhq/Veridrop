import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS } from "@/lib/api/mock-data";

// TODO: real JWT auth - verify token, return authenticated user
export async function GET(req: NextRequest) {
  try {
    const vendor = MOCK_USERS.find((u) => u.role === "vendor")!;
    return ok(vendor);
  } catch (e) {
    return err((e as Error).message);
  }
}
