import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ComparisonModal from "@/components/ComparisonModal";
import { makeCompared } from "../helpers/factories";

const TWO = [
  makeCompared(0, {
    name: "Notebook A",
    ram: "16GB DDR5",
    processor: "Intel Core i7",
  }),
  makeCompared(1, {
    name: "Notebook B",
    ram: "16GB DDR5", // same RAM -> a "same" row
    processor: "AMD Ryzen 9", // different processor -> a "different" row
  }),
];

describe("ComparisonModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <ComparisonModal open={false} notebooks={TWO} onClose={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the comparison table with both notebooks when open", () => {
    render(<ComparisonModal open notebooks={TWO} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Notebook A")).toBeInTheDocument();
    expect(screen.getByText("Notebook B")).toBeInTheDocument();
    expect(screen.getByText("Intel Core i7")).toBeInTheDocument();
    expect(screen.getByText("AMD Ryzen 9")).toBeInTheDocument();
    // Shared RAM value is shown for both columns
    expect(screen.getAllByText("16GB DDR5")).toHaveLength(2);
  });

  it("hides identical rows when 'show differences only' is toggled", async () => {
    const user = userEvent.setup();
    render(<ComparisonModal open notebooks={TWO} onClose={vi.fn()} />);

    // RAM row visible initially
    expect(screen.getAllByText("16GB DDR5")).toHaveLength(2);

    await user.click(screen.getByLabelText("Mostrar apenas diferenças"));

    // The identical RAM row is gone; the differing processor row remains
    expect(screen.queryByText("16GB DDR5")).not.toBeInTheDocument();
    expect(screen.getByText("Intel Core i7")).toBeInTheDocument();
    expect(screen.getByText("AMD Ryzen 9")).toBeInTheDocument();
  });

  it("closes via the close button", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ComparisonModal open notebooks={TWO} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: /Fechar comparação/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when clicking the backdrop but not the content", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ComparisonModal open notebooks={TWO} onClose={onClose} />);

    // Clicking inside the content should NOT close
    await user.click(screen.getByText("Notebook A"));
    expect(onClose).not.toHaveBeenCalled();

    // Clicking the backdrop (the dialog element itself) closes
    await user.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
