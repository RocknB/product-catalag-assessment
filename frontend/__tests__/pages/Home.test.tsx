import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomePage from "../../src/pages/Home";
import { productService } from "../../src/services/productService";

vi.mock("../../src/services/productService");

function renderHomePage() {
  return render(
    <MemoryRouter>
      <HomePage />
    </MemoryRouter>
  );
}

describe("HomePage", () => {
  it("should display the product count after loading", async () => {
    vi.mocked(productService.getCount).mockResolvedValue(15);

    renderHomePage();

    await waitFor(() => {
      expect(screen.getByTestId("product-count")).toHaveTextContent("15");
    });
  });
});
