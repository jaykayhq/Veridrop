import { requireAdmin } from "@/lib/api/auth-server";
import { getAdminStores } from "@/lib/api/queries";
import { db } from "@/lib/api/db";
import type { Product } from "@/lib/api/types";
import AdminStoresClient from "./admin-stores-client";

export const dynamic = "force-dynamic";

export default async function AdminStores() {
  await requireAdmin();
  const [storesData, allProducts] = await Promise.all([
    getAdminStores(),
    db.products.find({}) as Promise<Product[]>,
  ]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-text-primary">Stores &amp; Products</h1>
        <p className="text-sm text-text-muted mt-1">Manage all vendor storefronts and their product listings</p>
      </div>

      <AdminStoresClient
        storesData={storesData}
        initialProducts={allProducts.reverse()}
      />
    </div>
  );
}
