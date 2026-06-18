import { NextRequest } from "next/server";
import { signToken } from "@/lib/api/auth";
import { ok, err } from "@/lib/api/helpers";
import { MOCK_USERS } from "@/lib/api/mock-data";

// TODO: real auth - verify password against hashed DB credential
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return err("Missing email");

    const user = MOCK_USERS.find((u) => u.email === email);
    if (!user) return err("Invalid credentials", 401);

    const token = signToken({ userId: user._id, email: user.email, role: user.role as "vendor" | "buyer" | "inspector" | "rider" | "admin" });
    return ok({ user, token });
  } catch (e) {
    return err((e as Error).message);
  }
}
