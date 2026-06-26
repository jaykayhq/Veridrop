import { headers } from "next/headers";
import { requireVendor } from "@/lib/api/auth-server";
import { getVendorStore } from "@/lib/api/queries";
import StoreClient from "./store-client";

export const dynamic = "force-dynamic";

export default async function VendorStore() {
  const user = await requireVendor();
  const storeData = await getVendorStore(user._id);
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "localhost:3000";
  const origin = `${protocol}://${host}`;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Storefront</h1>
        <p className="text-sm text-text-muted mt-1">Your unique Veridrop-powered store link</p>
      </div>
      <StoreClient
        initialSlug={storeData.slug}
        initialStoreName={storeData.storeName}
        origin={origin}
      />
    </div>
  );
}
