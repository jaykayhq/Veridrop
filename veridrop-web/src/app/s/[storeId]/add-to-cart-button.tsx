"use client";

import { useCart } from "@/components/storefront/CartProvider";
import type { Product } from "@/lib/api/types";

interface Props {
  product: Product;
  storeId: string;
}

export default function AddToCartButton({ product, storeId }: Props) {
  const { addItem } = useCart();

  return (
    <button
      onClick={() => addItem({ product, storeId, quantity: 1 })}
      className="rounded-md bg-gradient-to-r from-brand-blue to-brand-teal-light px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90"
    >
      Buy with Veridrop
    </button>
  );
}
