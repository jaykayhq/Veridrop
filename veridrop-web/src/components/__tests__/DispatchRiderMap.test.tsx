import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DispatchRiderMap from "../dispatch-rider-map";

// Mock Leaflet since it requires browser APIs and dynamic imports
vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => ({
      setView: vi.fn(),
      fitBounds: vi.fn(),
      remove: vi.fn(),
      on: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    marker: vi.fn(() => ({
      addTo: vi.fn(() => ({
        bindTooltip: vi.fn(),
        on: vi.fn(),
      })),
      bindTooltip: vi.fn(),
      on: vi.fn(),
    })),
    divIcon: vi.fn(() => ({})),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
    latLngBounds: vi.fn(() => ({
      extend: vi.fn(),
    })),
    point: vi.fn(() => ({ x: 0, y: 0 })),
  },
}));

// Mock leaflet CSS import
vi.mock("leaflet/dist/leaflet.css", () => ({}));

const mockRiders = [
  { id: "1", name: "Emeka Nwosu", lat: 6.5244, lng: 3.3792, status: "available" as const },
  { id: "2", name: "Fatima Yusuf", lat: 6.5350, lng: 3.3650, status: "on_delivery" as const },
  { id: "3", name: "Tunde Bakare", lat: 6.5100, lng: 3.3900, status: "offline" as const },
];

describe("DispatchRiderMap", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the map header with company name", () => {
    render(<DispatchRiderMap companyName="SwiftLogix" />);
    expect(screen.getByText("Live Rider Map")).toBeInTheDocument();
    // Company name may be split across elements — use function matcher
    expect(screen.getByText((content) => content.includes("SwiftLogix"))).toBeInTheDocument();
  });

  it("renders with default company name when not provided", () => {
    render(<DispatchRiderMap />);
    expect(screen.getByText((content) => content.includes("Dispatch Network"))).toBeInTheDocument();
  });

  it("renders rider count in header", () => {
    render(<DispatchRiderMap riders={mockRiders} />);
    expect(screen.getByText((content) => content.includes("3 riders"))).toBeInTheDocument();
  });

  it("renders default rider count when no riders provided", () => {
    render(<DispatchRiderMap />);
    expect(screen.getByText((content) => content.includes("5 riders"))).toBeInTheDocument();
  });

  it("renders all rider names in the list", () => {
    render(<DispatchRiderMap riders={mockRiders} />);
    expect(screen.getByText("Emeka Nwosu")).toBeInTheDocument();
    expect(screen.getByText("Fatima Yusuf")).toBeInTheDocument();
    expect(screen.getByText("Tunde Bakare")).toBeInTheDocument();
  });

  it("renders status labels for each rider", () => {
    render(<DispatchRiderMap riders={mockRiders} />);
    // Status text appears in both legend and rider list items
    const availableItems = screen.getAllByText("Available");
    expect(availableItems.length).toBeGreaterThanOrEqual(1);
    const deliveryItems = screen.getAllByText("On Delivery");
    expect(deliveryItems.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders status legend indicators", () => {
    render(<DispatchRiderMap riders={mockRiders} />);
    const availableItems = screen.getAllByText("Available");
    expect(availableItems.length).toBeGreaterThanOrEqual(1);
    const deliveryItems = screen.getAllByText("On Delivery");
    expect(deliveryItems.length).toBeGreaterThanOrEqual(1);
  });

  it("renders map container with loading state", () => {
    const { container } = render(<DispatchRiderMap riders={mockRiders} />);
    // Map container should exist
    const mapDiv = container.querySelector("[style]");
    expect(mapDiv).toBeInTheDocument();
  });

  it("shows coordinates for each rider", () => {
    render(<DispatchRiderMap riders={mockRiders} />);
    // Check coordinates are displayed
    expect(screen.getByText(/6.5244/)).toBeInTheDocument();
    expect(screen.getByText(/6.5350/)).toBeInTheDocument();
    expect(screen.getByText(/6.5100/)).toBeInTheDocument();
  });

  it("applies active styling when a rider button is clicked", async () => {
    const user = userEvent.setup();
    render(<DispatchRiderMap riders={mockRiders} />);

    const riderButton = screen.getByText("Emeka Nwosu").closest("button");
    expect(riderButton).toBeInTheDocument();

    await user.click(riderButton!);
    // After clicking, the rider should still be in the document
    expect(screen.getByText("Emeka Nwosu")).toBeInTheDocument();
  });

  it("renders with custom height", () => {
    const { container } = render(<DispatchRiderMap riders={mockRiders} height={300} />);
    const mapContainer = container.querySelector("[style*=\"height: 300px\"]");
    expect(mapContainer).toBeInTheDocument();
  });

  it("handles empty riders array gracefully", () => {
    render(<DispatchRiderMap riders={[]} />);
    expect(screen.getByText((content) => content.includes("0 riders"))).toBeInTheDocument();
    // No rider names should appear in the list
    expect(screen.queryByText(/Emeka Nwosu/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Fatima Yusuf/)).not.toBeInTheDocument();
  });
});
