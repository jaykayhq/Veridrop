import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "../status-badge";

describe("StatusBadge", () => {
  it("renders pending status", () => {
    render(<StatusBadge status="pending" />);
    expect(screen.getByText("pending")).toBeInTheDocument();
  });

  it("renders delivered status", () => {
    render(<StatusBadge status="delivered" />);
    expect(screen.getByText("delivered")).toBeInTheDocument();
  });

  it("renders disputed status", () => {
    render(<StatusBadge status="disputed" />);
    expect(screen.getByText("disputed")).toBeInTheDocument();
  });

  it("applies correct color class for delivered status", () => {
    const { container } = render(<StatusBadge status="delivered" />);
    expect(container.firstChild).toHaveClass("text-brand-teal-light");
  });
});
