"use client";
import { LogoIcon } from "@/components/Logo";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const STORE_NAMES: Record<string, string> = {
  "gadgethub-ng": "GadgetHub NG",
};

export default function CheckoutPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", address: "" });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<{ orderId: string; trackingUrl: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  const storeName = STORE_NAMES[storeId] || storeId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(`veridrop_cart_${storeId}`);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, [storeId]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handlePlaceOrder() {
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError("Please fill in all fields");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const results = [];
      for (const item of items) {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers,
          body: JSON.stringify({
            productId: String(item.id),
            vendorId: storeId,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error || "Failed to create order");
        results.push(data.data.order);
      }

      const orderId = results[0]?._id || "unknown";
      const trackingUrl = `/t/${orderId}`;

      localStorage.removeItem(`veridrop_cart_${storeId}`);
      setSuccess({ orderId, trackingUrl });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPlacing(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-app text-text-primary font-sans flex items-center justify-center">
        <div className="max-w-md w-full mx-6">
          <div className="bg-surface rounded-xl border border-default p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-lg font-semibold mb-2">Order Placed Successfully!</h2>
            <p className="text-sm text-text-muted mb-1">Your order ID is:</p>
            <p className="text-sm font-mono text-brand-teal-light mb-4">{success.orderId}</p>
            <Link
              href={success.trackingUrl}
              className="inline-block rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{storeName}</span>
          </Link>
          <span className="text-[10px] text-text-muted bg-surface border border-default px-3 py-1 rounded-full">
            Secure Checkout
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold mb-8">Checkout</h1>

        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-surface rounded-xl border border-default p-5">
              <h2 className="text-sm font-semibold mb-4">Buyer Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent"
                    placeholder="+234 800 000 0000"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-muted mb-1.5">Delivery Address</label>
                  <textarea
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg bg-input border border-default px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-teal-light focus:border-transparent resize-none"
                    placeholder="12, Example Street, City"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-surface rounded-xl border border-default p-5 sticky top-20">
              <h2 className="text-sm font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary truncate mr-2">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-default pt-3 flex items-center justify-between">
                <span className="text-sm text-text-primary font-medium">Total</span>
                <span className="text-base font-bold text-brand-teal-light">₦{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-danger/10 border border-danger/30 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {placing ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Placing Order...
            </span>
          ) : (
            `Place Order — ₦${total.toLocaleString()}`
          )}
        </button>
      </div>
    </div>
  );
}
