import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../storefront/CartProvider";
import type { Product } from "@/lib/api/types";
import type { ReactNode } from "react";

const mockProduct: Product = {
  _id: "prod-1",
  vendorId: "vendor-1",
  name: "Test Phone",
  category: "Phones",
  price: 50000,
  stock: 10,
  description: "A test phone",
  status: "active",
  sales: 0,
  createdAt: new Date().toISOString(),
};

const mockProduct2: Product = {
  _id: "prod-2",
  vendorId: "vendor-1",
  name: "Test Laptop",
  category: "Laptops",
  price: 200000,
  stock: 5,
  description: "A test laptop",
  status: "active",
  sales: 0,
  createdAt: new Date().toISOString(),
};

function renderCart() {
  return renderHook(() => useCart(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    ),
  });
}

describe("CartProvider", () => {
  it("starts with an empty cart", () => {
    const { result } = renderCart();
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("adds an item to the cart", () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 1 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product._id).toBe("prod-1");
    expect(result.current.itemCount).toBe(1);
    expect(result.current.total).toBe(50000);
  });

  it("increments quantity when adding duplicate product", () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 2 });
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.total).toBe(150000);
  });

  it("adds multiple different products", () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.addItem({ product: mockProduct2, storeId: "store-1", quantity: 2 });
    });
    expect(result.current.items).toHaveLength(2);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.total).toBe(450000);
  });

  it("removes an item by product id", () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.addItem({ product: mockProduct2, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.removeItem("prod-1");
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product._id).toBe("prod-2");
    expect(result.current.total).toBe(200000);
  });

  it("clears all items", () => {
    const { result } = renderCart();
    act(() => {
      result.current.addItem({ product: mockProduct, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.addItem({ product: mockProduct2, storeId: "store-1", quantity: 1 });
    });
    act(() => {
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it("throws useCart without CartProvider", () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow("useCart must be used within CartProvider");
  });
});
