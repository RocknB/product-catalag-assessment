import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProductsPage from "../../src/pages/Products";
import { productService } from "../../src/services/productService";
import { categoryService } from "../../src/services/categoryService";
import type { Product, Category } from "../../src/types";

vi.mock("../../src/services/productService");
vi.mock("../../src/services/categoryService");

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1299.99,
    categoryName: "Electronics",
    categoryId: 1,
    active: true,
    createdAt: "2026-02-16",
    createdBy: "admin",
    updatedAt: "2026-02-16",
    updatedBy: "admin",
  },
  {
    id: 2,
    name: "Office Chair",
    description: "Comfortable ergonomic office chair",
    price: 249.99,
    categoryName: "Furniture",
    categoryId: 2,
    active: true,
    createdAt: "2026-02-16",
    createdBy: "admin",
    updatedAt: "2026-02-16",
    updatedBy: "admin",
  },
];

const mockCategories: Category[] = [
  { id: 1, name: "Electronics", description: "Electronic devices and accessories", active: true },
  { id: 2, name: "Furniture", description: "Office and home furniture", active: true },
];

function renderProductsPage() {
  return render(
    <MemoryRouter>
      <ProductsPage />
    </MemoryRouter>
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.mocked(productService.getAll).mockResolvedValue(mockProducts);
  vi.mocked(categoryService.getAll).mockResolvedValue(mockCategories);
});

describe("ProductsPage", () => {
  it("should search products by name", async () => {
    const user = userEvent.setup();
    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
      expect(screen.getByText("Office Chair")).toBeInTheDocument();
    });

    const searchInput = screen.getByTestId("search-input");
    await user.type(searchInput, "Laptop Pro");

    expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    expect(screen.queryByText("Office Chair")).not.toBeInTheDocument();
  });

  it("should add a product", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.create).mockResolvedValue({
      ...mockProducts[0],
      id: 3,
      name: "Monitor",
      price: 399.99,
    });

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    });

    // Open the add modal
    await user.click(screen.getByText("Add Product"));
    expect(screen.getByText("Add Product", { selector: "h2" })).toBeInTheDocument();

    // Fill the form
    await user.type(screen.getByLabelText("Name *"), "Monitor");

    const priceInput = screen.getByLabelText("Price *");
    await user.clear(priceInput);
    await user.type(priceInput, "399.99");

    // Submit
    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);

    await waitFor(() => {
      expect(productService.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Monitor" })
      );
    });
  });

  it("should edit a product", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.update).mockResolvedValue({
      ...mockProducts[0],
      name: "Laptop Pro Max",
    });

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    });

    // Click the Edit button on the first product row
    const editButtons = screen.getAllByText("Edit");
    await user.click(editButtons[0]);

    expect(screen.getByText("Edit Product")).toBeInTheDocument();

    // Change the name
    const nameInput = screen.getByLabelText("Name *");
    await user.clear(nameInput);
    await user.type(nameInput, "Laptop Pro Max");

    fireEvent.submit(screen.getByRole("button", { name: "Save" }).closest("form")!);

    await waitFor(() => {
      expect(productService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ name: "Laptop Pro Max" })
      );
    });
  });

  it("should delete a product after confirming", async () => {
    const user = userEvent.setup();
    vi.mocked(productService.delete).mockResolvedValue(undefined);
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderProductsPage();

    await waitFor(() => {
      expect(screen.getByText("Laptop Pro")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByTitle("Remove product");
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to remove this product?"
    );
    expect(productService.delete).toHaveBeenCalledWith(1);
  });
});
