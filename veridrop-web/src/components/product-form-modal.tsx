"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import type { Product } from "@/lib/api/types";

interface ProductFormData {
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
}

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  editProduct?: Product | null;
}

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Accessories",
  "Home & Garden",
  "Sports",
  "Beauty",
  "Food & Groceries",
  "Books",
  "Other",
];

export function ProductFormModal({ open, onClose, onSaved, editProduct }: ProductFormModalProps) {
  const [form, setForm] = useState<ProductFormData>({
    name: editProduct?.name || "",
    category: editProduct?.category || "Electronics",
    price: editProduct?.price?.toString() || "",
    stock: editProduct?.stock?.toString() || "0",
    description: editProduct?.description || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Product name is required");
      return;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("Please enter a valid price");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        price: parseFloat(form.price),
        stock: parseInt(form.stock) || 0,
        description: form.description.trim(),
      };

      const url = editProduct
        ? `/api/products/${editProduct._id}`
        : "/api/products";
      const method = editProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || "Failed to save product");

      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={editProduct ? "Edit Product" : "Add Product"} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-text-muted font-semibold">Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3.5 sm:px-3 py-3 sm:py-2.5 text-sm sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all"
              placeholder="e.g. iPhone 15 Pro"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-text-muted font-semibold">Category</label>
            <select
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3.5 sm:px-3 py-3 sm:py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-text-muted font-semibold">Price (NGN) *</label>
            <input
              type="number"
              inputMode="decimal"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3.5 sm:px-3 py-3 sm:py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all"
              placeholder="₦ 0"
              min="0"
              step="100"
            />
          </div>

          {/* Stock */}
          <div className="space-y-1.5">
            <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-text-muted font-semibold">Stock Quantity</label>
            <input
              type="number"
              inputMode="numeric"
              value={form.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3.5 sm:px-3 py-3 sm:py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all"
              placeholder="0"
              min="0"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-[11px] sm:text-[10px] uppercase tracking-wider text-text-muted font-semibold">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full rounded-lg bg-input border border-default px-3.5 sm:px-3 py-3 sm:py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent transition-all resize-none"
              placeholder="Describe the product..."
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger text-balance">
            {error}
          </div>
        )}

        {/* Buttons — stacked on mobile, inline on desktop */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-1 sm:pt-2 sticky bottom-0 bg-surface pb-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 sm:py-2.5 border border-default text-text-secondary text-sm font-medium rounded-lg hover:border-hover hover:text-text-primary transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto px-6 py-3 sm:py-2.5 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </span>
            ) : editProduct ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
