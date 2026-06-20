import { describe, it, expect } from "vitest";
import { cn, formatCurrency, formatDate, statusColor, generateStoreUrl } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("returns empty string for no inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency", () => {
  it("formats in Naira", () => {
    const result = formatCurrency(1500);
    expect(result).toContain("₦");
    expect(result).toContain("1");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toContain("₦");
  });

  it("handles large numbers", () => {
    const result = formatCurrency(1_500_000);
    expect(result).toContain("₦");
  });
});

describe("formatDate", () => {
  it("formats ISO date string", () => {
    const result = formatDate("2026-06-19T10:00:00.000Z");
    expect(result).toBeTruthy();
    expect(typeof result).toBe("string");
  });
});

describe("statusColor", () => {
  it("returns pending color classes", () => {
    const result = statusColor("pending");
    expect(result).toContain("yellow");
    expect(result).toContain("bg-");
  });

  it("returns delivered color classes", () => {
    const result = statusColor("delivered");
    expect(result).toContain("teal");
  });

  it("returns disputed color classes", () => {
    const result = statusColor("disputed");
    expect(result).toContain("orange");
  });

  it("returns default for unknown status", () => {
    expect(statusColor("unknown_status")).toContain("gray");
  });

  it("returns active color classes", () => {
    expect(statusColor("active")).toContain("emerald");
  });
});

describe("generateStoreUrl", () => {
  it("generates URL from slug", () => {
    const result = generateStoreUrl("gadgethub-ng");
    expect(result).toBe("/s/gadgethub-ng");
  });
});
