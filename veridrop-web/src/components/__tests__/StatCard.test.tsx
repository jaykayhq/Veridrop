import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "../stat-card";

describe("StatCard", () => {
  it("renders label and value", () => {
    render(<StatCard label="Active Orders" value="18" />);
    expect(screen.getByText("Active Orders")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
  });

  it("renders change text", () => {
    render(<StatCard label="Revenue" value="₦1M" change="+12%" changeType="up" />);
    expect(screen.getByText("+12%")).toBeInTheDocument();
  });

  it("renders with icon", () => {
    render(<StatCard label="Orders" value="5" icon="📦" />);
    expect(screen.getByText("📦")).toBeInTheDocument();
  });
});
