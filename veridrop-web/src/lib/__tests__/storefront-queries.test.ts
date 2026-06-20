import { describe, it, expect, vi } from "vitest";

const { mockFind, mockFindOne } = vi.hoisted(() => ({
  mockFind: vi.fn(),
  mockFindOne: vi.fn(),
}));

vi.mock("@/lib/api/db", () => ({
  db: {
    users: { find: mockFind, findOne: mockFindOne },
    products: { find: mockFind },
  },
}));

import { getStoreBySlug, getStoreProducts, getStoreByVendorId } from "@/lib/api/storefront-queries";

describe("storefront-queries", () => {
  it("getStoreBySlug queries users by slug and vendor role", async () => {
    mockFind.mockResolvedValue([{ _id: "v1", slug: "test-store", role: "vendor" }]);
    const result = await getStoreBySlug("test-store");
    expect(mockFind).toHaveBeenCalledWith({ slug: "test-store", role: "vendor" });
    expect(result).toEqual({ _id: "v1", slug: "test-store", role: "vendor" });
  });

  it("getStoreBySlug returns null when no match", async () => {
    mockFind.mockResolvedValue([]);
    const result = await getStoreBySlug("nonexistent");
    expect(result).toBeNull();
  });

  it("getStoreProducts queries products by vendorId with active status", async () => {
    const products = [
      { _id: "p1", vendorId: "v1", name: "Phone", status: "active" },
    ];
    mockFind.mockResolvedValue(products);
    const result = await getStoreProducts("v1");
    expect(mockFind).toHaveBeenCalledWith({ vendorId: "v1", status: "active" });
    expect(result).toEqual(products);
  });

  it("getStoreProducts returns empty array for no products", async () => {
    mockFind.mockResolvedValue([]);
    const result = await getStoreProducts("v1");
    expect(result).toEqual([]);
  });

  it("getStoreByVendorId queries user by _id", async () => {
    mockFindOne.mockResolvedValue({ _id: "v1", role: "vendor", business: "Test Store" });
    const result = await getStoreByVendorId("v1");
    expect(mockFindOne).toHaveBeenCalledWith({ _id: "v1" });
    expect(result).toEqual({ _id: "v1", role: "vendor", business: "Test Store" });
  });

  it("getStoreByVendorId returns null for no match", async () => {
    mockFindOne.mockResolvedValue(null);
    const result = await getStoreByVendorId("nonexistent");
    expect(result).toBeNull();
  });
});
