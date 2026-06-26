"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/storefront/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutForm({ storeId }: { storeId: string }) {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId,
          items: items.map((i) => ({ productId: i.product._id, quantity: i.quantity, price: i.product.price })),
          buyerInfo: { name, email, phone, address },
          total,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Checkout failed");

      clearCart();
      router.push(`/t/${data.data._id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-default p-8 text-center">
        <p className="text-text-muted text-sm">Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-surface rounded-xl border border-default p-6">
        <h2 className="text-sm font-semibold mb-4">Shipping Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted mb-1">Full Name *</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal-light"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal-light"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Phone *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal-light"
              placeholder="+234 800 000 0000"
            />
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1">Delivery Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-teal-light resize-none"
              placeholder="Street, city, state"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal-light py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {submitting ? "Processing..." : `Pay ${formatCurrency(total)} via Escrow`}
          </button>
        </form>
      </div>

      <div className="bg-surface rounded-xl border border-default p-6 h-fit">
        <h2 className="text-sm font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between text-sm">
              <span className="text-text-muted">{item.product.name} &times; {item.quantity}</span>
              <span>{formatCurrency(item.product.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-default pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-brand-teal-light">{formatCurrency(total)}</span>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-input border border-default">
          <p className="text-xs text-text-muted">
            Your payment is held in escrow until inspection passes and delivery is confirmed.
          </p>
        </div>
      </div>
    </div>
  );
}
