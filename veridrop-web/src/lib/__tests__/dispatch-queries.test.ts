import { describe, it, expect, vi } from "vitest";

const { mockFind, mockFindOne } = vi.hoisted(() => ({
  mockFind: vi.fn(),
  mockFindOne: vi.fn(),
}));

vi.mock("@/lib/api/db", () => ({
  db: {
    dispatchCompanies: { findOne: mockFindOne, find: mockFind },
    riders: { find: mockFind },
    orders: { find: mockFind },
  },
}));

import { getCompanyById, getCompanyRiders, getCompanyDashboard, getRiderAssignments } from "@/lib/api/dispatch-queries";

describe("dispatch-queries", () => {
  it("getCompanyById queries dispatchCompanies by _id", async () => {
    mockFindOne.mockResolvedValue({ _id: "c1", name: "Swift Logistics", status: "connected" });
    const result = await getCompanyById("c1");
    expect(mockFindOne).toHaveBeenCalledWith({ _id: "c1" });
    expect(result?.name).toBe("Swift Logistics");
  });

  it("getCompanyById returns null when no match", async () => {
    mockFindOne.mockResolvedValue(null);
    const result = await getCompanyById("nonexistent");
    expect(result).toBeNull();
  });

  it("getCompanyRiders queries riders by companyId", async () => {
    const riders = [
      { _id: "r1", companyId: "c1", name: "Emeka N.", status: "available" },
      { _id: "r2", companyId: "c1", name: "Fatima Y.", status: "on_delivery" },
    ];
    mockFind.mockResolvedValue(riders);
    const result = await getCompanyRiders("c1");
    expect(mockFind).toHaveBeenCalledWith({ companyId: "c1" });
    expect(result).toHaveLength(2);
  });

  it("getCompanyDashboard computes stats from riders and orders", async () => {
    // First call: riders, Second call: orders (shared mockFind)
    mockFind
      .mockResolvedValueOnce([
        { _id: "r1", companyId: "c1", status: "available" },
        { _id: "r2", companyId: "c1", status: "on_delivery" },
      ])
      .mockResolvedValueOnce([
        { _id: "o1", dispatchId: "c1", status: "in_transit" },
        { _id: "o2", dispatchId: "c1", status: "passed" },
        { _id: "o3", dispatchId: "c1", status: "delivered" },
        { _id: "o4", dispatchId: "other", status: "in_transit" },
      ]);

    const result = await getCompanyDashboard("c1");

    expect(result.activeRiders).toBe(2);
    expect(result.totalRiders).toBe(2);
    expect(result.activeDeliveries).toBe(1); // only "in_transit" status counts
    expect(result.pendingPickup).toBe(1); // "passed" status
    expect(result.deliveredToday).toBe(1); // "delivered" status
    expect(result.recentDeliveries).toHaveLength(3); // o1, o2, o3 are company orders
  });

  it("getRiderAssignments queries orders by riderId", async () => {
    const orders = [
      { _id: "o1", riderId: "r1", productName: "Phone" },
      { _id: "o2", riderId: "r1", productName: "Laptop" },
    ];
    mockFind.mockResolvedValue(orders);
    const result = await getRiderAssignments("r1");
    expect(mockFind).toHaveBeenCalledWith({ riderId: "r1" });
    expect(result).toHaveLength(2);
  });
});
