"use client";
import { LogoIcon } from "@/components/Logo";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const STORE_NAMES: Record<string, string> = {
  "gadgethub-ng": "GadgetHub NG",
};

export default function CartPage() {
  const { storeId } = useParams<{ storeId: string }>();
  const [items, setItems] = useState<CartItem[]>([]);
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

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(`veridrop_cart_${storeId}`, JSON.stringify(items));
    }
  }, [items, storeId, mounted]);

  function updateQuantity(id: number, delta: number) {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">{storeName}</span>
          </Link>
          <span className="text-[10px] text-text-muted bg-surface border border-default px-3 py-1 rounded-full">
            Protected by Veridrop
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-xl font-semibold mb-8">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="bg-surface rounded-xl border border-default p-12 text-center">
            <div className="text-4xl mb-4 opacity-30">🛒</div>
            <p className="text-base text-text-muted mb-4">Your cart is empty</p>
            <Link
              href={`/s/${storeId}`}
              className="inline-block rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-8">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-surface rounded-xl border border-default p-4 flex items-center gap-4"
                >
                  <div className="h-14 w-14 rounded-lg bg-input border border-default flex items-center justify-center text-2xl shrink-0">
                    {item.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-sm font-semibold text-brand-teal-light mt-0.5">
                      ₦{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="h-8 w-8 rounded-md border border-default bg-input text-text-secondary hover:border-brand-teal-light hover:text-brand-teal-light transition-colors text-sm"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="h-8 w-8 rounded-md border border-default bg-input text-text-secondary hover:border-brand-teal-light hover:text-brand-teal-light transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-semibold w-24 text-right">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-text-muted hover:text-danger transition-colors text-lg shrink-0"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-xl border border-default p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-text-muted">Subtotal</span>
                <span className="text-lg font-semibold">₦{total.toLocaleString()}</span>
              </div>
              <Link
                href={`/s/${storeId}/checkout`}
                className="block w-full rounded-lg bg-gradient-to-r from-brand-blue to-brand-teal-light px-5 py-3 text-sm font-medium text-white text-center transition-opacity hover:opacity-90"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
