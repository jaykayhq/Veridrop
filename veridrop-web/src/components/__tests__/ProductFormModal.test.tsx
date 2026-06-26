import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductFormModal } from "../product-form-modal";
import type { Product } from "@/lib/api/types";

const mockProduct: Product = {
  _id: "prod-1",
  vendorId: "vendor-1",
  name: "Test Phone",
  category: "Electronics",
  price: 50000,
  stock: 10,
  description: "A test phone",
  status: "active",
  sales: 0,
  createdAt: new Date().toISOString(),
};

describe("ProductFormModal", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    // Mock localStorage
    const store: Record<string, string> = {};
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => store[key] || null);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation((key, value) => { store[key] = value; });
  });

  it("renders with 'Add Product' title when open and no editProduct", () => {
    render(
      <ProductFormModal open={true} onClose={() => {}} onSaved={() => {}} />
    );
    // Title is in an h2, button also says Add Product — check the heading specifically
    expect(screen.getByRole("heading", { name: /add product/i })).toBeInTheDocument();
  });

  it("renders with 'Edit Product' title when open with editProduct", () => {
    render(
      <ProductFormModal
        open={true}
        onClose={() => {}}
        onSaved={() => {}}
        editProduct={mockProduct}
      />
    );
    expect(screen.getByText("Edit Product")).toBeInTheDocument();
  });

  it("pre-fills form fields when editing a product", () => {
    render(
      <ProductFormModal
        open={true}
        onClose={() => {}}
        onSaved={() => {}}
        editProduct={mockProduct}
      />
    );

    const nameInput = screen.getByPlaceholderText("e.g. iPhone 15 Pro") as HTMLInputElement;
    expect(nameInput.value).toBe("Test Phone");

    const priceInput = screen.getByPlaceholderText("₦ 0") as HTMLInputElement;
    expect(priceInput.value).toBe("50000");

    const stockInput = screen.getByPlaceholderText("0") as HTMLInputElement;
    expect(stockInput.value).toBe("10");
  });

  it("does not render when open is false", () => {
    const { container } = render(
      <ProductFormModal open={false} onClose={() => {}} onSaved={() => {}} />
    );
    // The modal should return null when not open and not animating
    expect(container.innerHTML).toBe("");
  });

  it("shows validation error when name is empty on submit", async () => {
    const user = userEvent.setup();
    render(
      <ProductFormModal open={true} onClose={() => {}} onSaved={() => {}} />
    );

    const submitButton = screen.getByRole("button", { name: /add product/i });
    await user.click(submitButton);

    expect(screen.getByText("Product name is required")).toBeInTheDocument();
  });

  it("shows validation error when price is empty on submit", async () => {
    const user = userEvent.setup();
    render(
      <ProductFormModal open={true} onClose={() => {}} onSaved={() => {}} />
    );

    const nameInput = screen.getByPlaceholderText("e.g. iPhone 15 Pro");
    await user.type(nameInput, "New Product");

    const submitButton = screen.getByRole("button", { name: /add product/i });
    await user.click(submitButton);

    expect(screen.getByText("Please enter a valid price")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <ProductFormModal open={true} onClose={onClose} onSaved={() => {}} />
    );

    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await user.click(cancelButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders category select with all options", () => {
    render(
      <ProductFormModal open={true} onClose={() => {}} onSaved={() => {}} />
    );

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check a few categories exist
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Fashion")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
  });

  it("calls onSaved and onClose after successful API submit", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onSaved = vi.fn();

    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, data: { _id: "new-id" } }),
    });

    render(
      <ProductFormModal open={true} onClose={onClose} onSaved={onSaved} />
    );

    const nameInput = screen.getByPlaceholderText("e.g. iPhone 15 Pro");
    await user.type(nameInput, "New Gadget");

    const priceInput = screen.getByPlaceholderText("₦ 0");
    await user.type(priceInput, "25000");

    const submitButton = screen.getByRole("button", { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSaved).toHaveBeenCalledTimes(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/products",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("shows error message when API call fails", async () => {
    const user = userEvent.setup();

    // Mock failed fetch
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: false, error: "Product already exists" }),
    });

    render(
      <ProductFormModal open={true} onClose={() => {}} onSaved={() => {}} />
    );

    const nameInput = screen.getByPlaceholderText("e.g. iPhone 15 Pro");
    await user.type(nameInput, "Existing Product");

    const priceInput = screen.getByPlaceholderText("₦ 0");
    await user.type(priceInput, "10000");

    const submitButton = screen.getByRole("button", { name: /add product/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Product already exists")).toBeInTheDocument();
    });
  });

  it("shows 'Update Product' button text when editing", () => {
    render(
      <ProductFormModal
        open={true}
        onClose={() => {}}
        onSaved={() => {}}
        editProduct={mockProduct}
      />
    );

    expect(screen.getByRole("button", { name: /update product/i })).toBeInTheDocument();
  });
});
