import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CompareBar from "@/components/CompareBar";
import { makeCompared } from "../helpers/factories";

describe("CompareBar", () => {
  it("renders nothing when no notebooks are selected", () => {
    const { container } = render(
      <CompareBar selected={[]} onRemove={vi.fn()} onClear={vi.fn()} onCompare={vi.fn()} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders a chip per selection and the compare count", () => {
    render(
      <CompareBar
        selected={[
          makeCompared(0, { name: "Notebook A" }),
          makeCompared(1, { name: "Notebook B" }),
        ]}
        onRemove={vi.fn()}
        onClear={vi.fn()}
        onCompare={vi.fn()}
      />
    );
    expect(screen.getByText("Notebook A")).toBeInTheDocument();
    expect(screen.getByText("Notebook B")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Comparar (2)" })).toBeInTheDocument();
  });

  it("wires the remove, clear and compare callbacks", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const onClear = vi.fn();
    const onCompare = vi.fn();
    render(
      <CompareBar
        selected={[makeCompared(3, { name: "Notebook A" })]}
        onRemove={onRemove}
        onClear={onClear}
        onCompare={onCompare}
      />
    );

    await user.click(screen.getByRole("button", { name: "Remover Notebook A" }));
    expect(onRemove).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Limpar" }));
    expect(onClear).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /Comparar/ }));
    expect(onCompare).toHaveBeenCalledTimes(1);
  });
});
