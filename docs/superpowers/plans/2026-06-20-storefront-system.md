# Storefront System Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Appwrite-backed `/s/[storeId]` page with NeDB-backed server component, add "Buy with Veridrop" checkout flow (creates order + escrow + dispatches inspector).

**Architecture:** Server component reads vendor slug from URL params, queries `db.users` + `db.products` from NeDB. "Buy with Veridrop" button opens a checkout page that creates an order in NeDB via server action or API. Cart state managed client-side via React context + localStorage.

**Tech Stack:** Next.js 16 (App Router), NeDB (nedb-promises), Tailwind CSS v4, TypeScript

**Verification:** `cd veridrop-web && npm run build`

---

## File Inventory

| Action | File | Purpose |
|--------|------|---------|
| Modify | `src/app/s/[storeId]/page.tsx` | Replace Appwrite with NeDB queries |
| Create | `src/app/s/[storeId]/cart/page.tsx` | Cart page with checkout form |
| Create | `src/app/s/[storeId]/checkout/page.tsx` | Checkout confirmation + escrow initiation |
| Create | `src/lib/api/storefront-queries.ts` | Storefront-specific NeDB queries |
| Create | `src/components/storefront/CartProvider.tsx` | Client-side cart context |
| Add to seed | `src/lib/api/seed.ts` | Ensure seed has storefront demo data |

---

### Task 1: Create Storefront Queries Module

- [ ] **Step 1: Create `src/lib/api/storefront-queries.ts`**

```ts
import { db } from "./db";
import type { User, Product } from "./types";

export async function getStoreBySlug(slug: string) {
  const users = (await db.users.find({ slug, role: "vendor" })) as User[];
  return users[0] || null;
}

export async function getStoreProducts(vendorId: string) {
  return (await db.products.find({ vendorId, status: "active" })) as Product[];
}

export async function getStoreByVendorId(vendorId: string) {
  return (await db.users.findOne({ _id: vendorId })) as User | null;
}
```

---

### Task 2: Rewrite Storefront Page to Use NeDB

- [ ] **Step 1: Rewrite `src/app/s/[storeId]/page.tsx`**

Replace Appwrite imports with NeDB. Keep identical UI but data comes from NeDB.

```tsx
import { LogoIcon } from "@/components/Logo";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getStoreBySlug, getStoreProducts } from "@/lib/api/storefront-queries";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import AddToCartButton from "./add-to-cart-button";

export default async function StorefrontPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;
  const store = await getStoreBySlug(storeId);

  if (!store) {
    notFound();
  }

  const products = await getStoreProducts(store._id);

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight text-text-primary">
              {store.business || "Store"}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-text-muted bg-surface border border-default px-3 py-1 rounded-full">
              Verified by Veridrop ✓
            </span>
            <ThemeToggle />
            <Link
              href={`/s/${storeId}/cart`}
              className="rounded-md border border-hover px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-blue hover:text-brand-teal-light"
            >
              Cart (0)
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-default">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-default bg-surface px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-medium tracking-[0.2em] text-text-muted uppercase">
                Veridrop Verified Store
              </span>
            </div>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
              {store.tagline || store.business || "Welcome"}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-text-muted max-w-xl">
              {store.description || "Shop with confidence — every purchase is protected by Veridrop escrow, inspection, and managed logistics."}
            </p>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold">Products</h2>
          <div className="flex gap-2">
            <select className="text-xs bg-input border border-default rounded-md px-3 py-1.5 text-text-secondary focus:outline-none focus:border-brand-teal-light">
              <option>All Categories</option>
              <option>Phones</option>
              <option>Laptops</option>
              <option>Tablets</option>
              <option>Accessories</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div key={p._id} className="group rounded-lg border border-default bg-surface p-5 transition-all">
              <span className="text-[10px] font-medium tracking-[0.15em] text-brand-blue uppercase">
                {p.category}
              </span>
              <h3 className="mt-1 text-sm font-semibold">{p.title}</h3>
              <p className="mt-1 text-xs text-text-muted line-clamp-2">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-base font-bold text-brand-teal-light">{formatCurrency(p.price)}</span>
                <AddToCartButton product={p} storeId={storeId} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badge */}
      <section className="border-t border-default py-10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-3 rounded-lg border border-default bg-surface px-5 py-3">
            <LogoIcon size={32} className="shrink-0" />
            <div className="text-left">
              <div className="text-xs font-medium text-text-primary">Protected by Veridrop</div>
              <div className="text-[10px] text-text-muted">Escrow · Inspection · Managed Logistics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-default py-8">
        <div className="mx-auto max-w-7xl px-6 text-center text-[10px] text-text-muted">
          &copy; {new Date().getFullYear()} {store.business || "Store"}. Powered by Veridrop Trust Commerce Infrastructure.
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/s/[storeId]/add-to-cart-button.tsx`**

```tsx
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
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build, no Appwrite errors.

---

### Task 3: Create Cart Context

- [ ] **Step 1: Create `src/components/storefront/CartProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Product } from "@/lib/api/types";

interface CartItem {
  product: Product;
  storeId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product._id === item.product._id);
      if (existing) {
        return prev.map((i) =>
          i.product._id === item.product._id
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product._id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
```

- [ ] **Step 2: Create `src/components/storefront/index.ts`**

```ts
export { CartProvider, useCart } from "./CartProvider";
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 4: Create Cart Page

- [ ] **Step 1: Create `src/app/s/[storeId]/cart/page.tsx`**

```tsx
import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import CartContent from "./cart-content";

export default async function CartPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-xl font-semibold mb-6">Shopping Cart</h1>
        <CartContent storeId={storeId} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/s/[storeId]/cart/cart-content.tsx`**

```tsx
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
            <h3 className="text-sm font-medium">{item.product.title}</h3>
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
        <span className="text-sm font-semibold">Total</span>
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
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 5: Create Checkout Page

- [ ] **Step 1: Create `src/app/s/[storeId]/checkout/page.tsx`**

Server component that reads cart items (passed via localStorage by client), creates order + escrow in NeDB, and shows confirmation.

```tsx
import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import CheckoutForm from "./checkout-form";

export default async function CheckoutPage({ params }: { params: Promise<{ storeId: string }> }) {
  const { storeId } = await params;

  return (
    <div className="min-h-screen bg-app text-text-primary font-sans">
      <nav className="sticky top-0 z-50 border-b border-default bg-app/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <Link href={`/s/${storeId}`} className="flex items-center gap-2.5">
            <LogoIcon size={32} className="shrink-0" />
            <span className="text-sm font-semibold tracking-tight">Checkout</span>
          </Link>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="text-xl font-semibold mb-6">Complete Your Purchase</h1>
        <CheckoutForm storeId={storeId} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/app/s/[storeId]/checkout/checkout-form.tsx`**

```tsx
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
      const token = localStorage.getItem("veridrop_token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
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
              <span className="text-text-muted">{item.product.title} × {item.quantity}</span>
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
```

- [ ] **Step 3: Build check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build.

---

### Task 6: Update Store Layout to Wrap with CartProvider

- [ ] **Step 1: Create `src/app/s/[storeId]/layout.tsx`**

The storefront layout wraps pages with CartProvider so cart state persists across the store.

```tsx
import { CartProvider } from "@/components/storefront/CartProvider";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
```

- [ ] **Step 2: End-to-end check**

Run: `cd veridrop-web && npm run build`
Expected: Clean build with zero errors.
