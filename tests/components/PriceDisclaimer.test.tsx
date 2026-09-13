import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PriceDisclaimer, {
  DISCLAIMER_TEXT,
} from "@/components/PriceDisclaimer";

describe("PriceDisclaimer", () => {
  it("renders the official Amazon price/availability disclaimer", () => {
    render(<PriceDisclaimer />);
    // The disclaimer text is rendered in full (case-insensitive substring).
    expect(
      screen.getByText(/preços e a disponibilidade dos produtos estão corretos/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/momento da compra serão aplicáveis à compra desse produto/i)
    ).toBeInTheDocument();
  });

  it("exposes the disclaimer text as a constant for reuse", () => {
    expect(DISCLAIMER_TEXT).toMatch(/preços e a disponibilidade/i);
    expect(DISCLAIMER_TEXT).toMatch(/Amazon\.com\.br/);
  });

  it("does not render a date/time stamp when updatedAt is omitted", () => {
    render(<PriceDisclaimer />);
    expect(screen.queryByText(/Preço atualizado em/i)).not.toBeInTheDocument();
  });

  it("renders a date/time stamp when updatedAt is provided", () => {
    render(<PriceDisclaimer updatedAt="2026-09-13T14:30:00-03:00" />);
    expect(screen.getByText(/Preço atualizado em/i)).toBeInTheDocument();
  });

  it("renders the disclaimer even when updatedAt is provided", () => {
    render(<PriceDisclaimer updatedAt="2026-09-13T14:30:00-03:00" />);
    expect(
      screen.getByText(/preços e a disponibilidade dos produtos estão corretos/i)
    ).toBeInTheDocument();
  });
});
