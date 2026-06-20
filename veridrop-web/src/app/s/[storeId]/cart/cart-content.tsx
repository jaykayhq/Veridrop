"use client";

import Link from "next/link";
import { useCart } from "@/components/storefront/CartProvider";
import { formatCurrency } from "@/lib/utils";

export default function CartContent({ storeId }: { storeId: string }) {
  const { items, removeItem, clearCart, total, itemCount } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-xl border border-default p-8 text-center">
        <p className="text-text-muted text-sm">Your cart is empty</p>
        <Link
          href={`/s/${storeId}`}
          className="mt-4 inline-block rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-4 py-2 text-sm font-medium text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.product._id} className="bg-surface rounded-xl border border-default p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium">{item.product.name}</h3>
            <p className="text-xs text-text-muted mt-0.5">Qty: {item.quantity}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-brand-teal-light">
              {formatCurrency(item.product.price * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.product._id)}
              className="text-xs text-danger hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="bg-surface rounded-xl border border-default p-4 flex items-center justify-between">
        <span className="text-sm font-semibold">Total ({itemCount} items)</span>
        <span className="text-lg font-bold text-brand-teal-light">{formatCurrency(total)}</span>
      </div>

      <div className="flex gap-3 justify-end">
        <button onClick={clearCart} className="px-4 py-2 border border-default text-text-secondary text-sm rounded-lg hover:border-hover">
          Clear Cart
        </button>
        <Link
          href={`/s/${storeId}/checkout`}
          className="px-6 py-2 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
