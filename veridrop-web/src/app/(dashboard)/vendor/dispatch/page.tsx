import { headers } from "next/headers";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorDispatch } from "@/lib/api/queries";
import DispatchClient from "./dispatch-client";

export const dynamic = "force-dynamic";

export default async function VendorDispatch() {
  const user = await requireVendor();
  const data = await getVendorDispatch(user._id);
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;

  const stats = {
    connected: data.connected,
    activeRiders: data.activeRiders,
    deliveriesToday: data.deliveriesToday,
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Dispatch</h1>
        <p className="text-sm text-text-muted mt-1">Connect delivery companies and manage logistics</p>
      </div>
      <DispatchClient companies={data.companies} stats={stats} origin={origin} />
    </div>
  );
}
