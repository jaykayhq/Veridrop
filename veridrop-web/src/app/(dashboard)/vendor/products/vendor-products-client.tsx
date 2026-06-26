"use client";

import { useState, useCallback } from "react";
import { formatCurrency } from "@/lib/utils";
import { ProductFormModal } from "@/components/product-form-modal";
import type { Product } from "@/lib/api/types";

interface VendorProductsClientProps {
  initialProducts: Product[];
}

export function VendorProductsClient({ initialProducts }: VendorProductsClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  const handleOpenAdd = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleSaved = useCallback(async () => {
    try {
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;
      const res = await fetch("/api/products", { headers });
      const data = await res.json();
      if (data.success) setProducts(data.data || []);
    } catch {}
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`/api/products/${id}`, { method: "DELETE", headers });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        setDeleteConfirm(null);
      }
    } catch {}
  };

  return (
    <>
      {/* Toolbar — fully responsive */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]"
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
              placeholder="Search products..."
              className="w-full rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] pl-9 pr-3 py-2.5 sm:py-2 text-sm text-[#e8e8e8] placeholder:text-[#666] focus:outline-none focus:ring-2 focus:ring-[#00bda6] focus:border-transparent transition-all"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto rounded-lg bg-[#0d0d0d] border border-[#1a1a1a] px-3 py-2.5 sm:py-2 text-sm text-[#a0a0a0] focus:outline-none focus:ring-2 focus:ring-[#00bda6] focus:border-transparent transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gradient-to-r from-[#0a54a6] to-[#00bda6] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid gap-3">
        {filteredProducts.length === 0 ? (
          <div className="bg-surface rounded-xl border border-default p-12 text-center">
            <div className="text-4xl mb-3 opacity-20">📦</div>
            <p className="text-sm text-text-muted">No products found</p>
            <button
              onClick={handleOpenAdd}
              className="mt-3 text-sm text-[#00bda6] hover:underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-surface rounded-xl border border-default p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                {/* Product Icon */}
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#00bda6]/10 to-[#0a54a6]/10 border border-[#1a1a1a] flex items-center justify-center text-lg shrink-0">
                  {product.category === "Electronics" ? "📱" :
                   product.category === "Fashion" ? "👕" :
                   product.category === "Accessories" ? "🎧" : "📦"}
                </div>

                {/* Product Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-[#e8e8e8] truncate">{product.name}</h3>
                    {product.status === "active" ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-[#666]">
                    <span>{product.category}</span>
                    <span className="w-1 h-1 rounded-full bg-[#666]" />
                    <span>Stock: {product.stock}</span>
                    {product.stock === 0 && (
                      <span className="text-[#dc2626]">Out of stock</span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-[#666]" />
                    <span>{product.sales} sold</span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-semibold text-[#00bda6]">{formatCurrency(product.price)}</div>
                </div>
              </div>

              {/* Actions — always visible on mobile, hover on desktop */}
              <div className="flex items-center gap-1 ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(product)}
                  className="h-8 w-8 flex items-center justify-center rounded-lg text-[#666] hover:text-[#e8e8e8] hover:bg-[#1a1a1a] transition-all"
                  title="Edit product"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                {deleteConfirm === product._id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="h-8 px-2 flex items-center gap-1 rounded-lg bg-[#dc2626]/10 text-[#dc2626] text-xs font-medium hover:bg-[#dc2626]/20 transition-all"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="h-8 px-2 flex items-center rounded-lg text-[#666] hover:text-[#e8e8e8] text-xs transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product._id)}
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-[#666] hover:text-[#dc2626] hover:bg-[#dc2626]/10 transition-all"
                    title="Delete product"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Product Form Modal */}
      <ProductFormModal
        open={showModal}
        onClose={() => { setShowModal(false); setEditProduct(null); }}
        onSaved={handleSaved}
        editProduct={editProduct}
      />
    </>
  );
}
