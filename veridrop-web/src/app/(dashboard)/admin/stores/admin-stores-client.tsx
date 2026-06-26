"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { DataTable } from "@/components/data-table";
import { formatCurrency } from "@/lib/utils";
import { ProductFormModal } from "@/components/product-form-modal";
import type { Product } from "@/lib/api/types";

interface Store {
  id: string;
  name: string;
  slug: string;
  owner: string;
  products: number;
  activeProducts: number;
  status: string;
}

interface AdminStoresClientProps {
  storesData: {
    totalStores: number;
    activeStores: number;
    pendingStores: number;
    totalProducts: number;
    stores: Store[];
  };
  initialProducts: Product[];
}

export default function AdminStoresClient({ storesData, initialProducts }: AdminStoresClientProps) {
  const [view, setView] = useState<"stores" | "products">("stores");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.vendorId.toLowerCase().includes(search.toLowerCase());
    const matchesStore = !selectedStore || p.vendorId === selectedStore;
    return matchesSearch && matchesStore;
  });

  const handleSaved = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch {}
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const newStatus = product.status === "active" ? "inactive" : "active";
      await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      setProducts((prev) =>
        prev.map((p) => (p._id === product._id ? { ...p, status: newStatus as "active" | "inactive" } : p))
      );
    } catch {}
  };

  return (
    <>
      {/* View Toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setView("stores")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            view === "stores"
              ? "bg-gradient-to-r from-brand-blue to-brand-teal-light text-white"
              : "bg-surface border border-default text-text-secondary hover:border-hover"
          }`}
        >
          Stores
        </button>
        <button
          onClick={() => setView("products")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            view === "products"
              ? "bg-gradient-to-r from-brand-blue to-brand-teal-light text-white"
              : "bg-surface border border-default text-text-secondary hover:border-hover"
          }`}
        >
          All Products ({products.length})
        </button>
      </div>

      {view === "stores" ? (
        /* ─── Stores View ─── */
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Stores</p>
              <p className="text-lg font-semibold text-text-primary mt-1">{storesData.totalStores}</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider">Active</p>
              <p className="text-lg font-semibold text-emerald-400 mt-1">{storesData.activeStores}</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider">Pending</p>
              <p className="text-lg font-semibold text-yellow-400 mt-1">{storesData.pendingStores}</p>
            </div>
            <div className="bg-surface rounded-xl border border-default p-4">
              <p className="text-xs text-text-muted uppercase tracking-wider">Total Products</p>
              <p className="text-lg font-semibold text-text-primary mt-1">{storesData.totalProducts}</p>
            </div>
          </div>

          <div className="bg-surface rounded-xl border border-default">
            <DataTable
              columns={[
                { key: "id", header: "ID" },
                { key: "name", header: "Store Name" },
                {
                  key: "slug",
                  header: "Link",
                  render: (row) => (
                    <span className="font-mono text-brand-teal-light text-xs">/s/{row.slug as string}</span>
                  ),
                },
                { key: "owner", header: "Owner" },
                { key: "products", header: "Products" },
                { key: "activeProducts", header: "Active" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status as string} />,
                },
                {
                  key: "_actions",
                  header: "",
                  render: (row) => (
                    <button
                      onClick={() => {
                        setSelectedStore(row.id as string);
                        setView("products");
                      }}
                      className="text-xs text-brand-teal-light hover:underline"
                    >
                      View Products
                    </button>
                  ),
                },
              ]}
              data={storesData.stores}
            />
          </div>
        </>
      ) : (
        /* ─── Products View ─── */
        <>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedStore && (
                <button
                  onClick={() => { setSelectedStore(null); setSearch(""); }}
                  className="shrink-0 px-3 py-2 rounded-lg bg-surface border border-default text-xs text-text-secondary hover:border-hover transition-all flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  All Stores
                </button>
              )}
              <div className="relative flex-1 max-w-xs">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={selectedStore ? "Search products..." : "Search by name or vendor..."}
                  className="w-full rounded-lg bg-input border border-default pl-9 pr-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all"
                />
              </div>
            </div>
            <button
              onClick={() => { setEditProduct(null); setShowModal(true); }}
              className="shrink-0 px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Product
            </button>
          </div>

          <div className="bg-surface rounded-xl border border-default">
            <DataTable
              columns={[
                { key: "_id", header: "ID" },
                { key: "name", header: "Name" },
                { key: "category", header: "Category" },
                {
                  key: "price",
                  header: "Price",
                  className: "font-medium",
                  render: (row) => formatCurrency(row.price as number),
                },
                { key: "stock", header: "Stock" },
                { key: "sales", header: "Sales" },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status as string} />,
                },
                {
                  key: "_actions",
                  header: "",
                  render: (row) => (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(row as unknown as Product)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          (row as unknown as Product).status === "active"
                            ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
                            : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {(row as unknown as Product).status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredProducts}
            />
          </div>
        </>
      )}

      {/* Product Form Modal (for admin) */}
      <ProductFormModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditProduct(null); }}
        onSaved={handleSaved}
        editProduct={editProduct}
      />
    </>
  );
}
