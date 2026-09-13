import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import AffiliateDisclosure, {
  DEFAULT_LABEL,
} from "@/components/AffiliateDisclosure";

describe("AffiliateDisclosure", () => {
  it("renders the default link-level disclosure label", () => {
    render(<AffiliateDisclosure />);
    expect(screen.getByText(DEFAULT_LABEL)).toBeInTheDocument();
  });

  it("uses an official Amazon Associates Brazil short-form label by default", () => {
    // Official accepted examples: "(link patrocinado)", "#pub", "#ComissõesPorCompra".
    expect(["(link patrocinado)", "#pub", "#ComissõesPorCompra"]).toContain(
      DEFAULT_LABEL
    );
  });

  it("renders a custom label when provided", () => {
    render(<AffiliateDisclosure label="(link patrocinado)" />);
    expect(screen.getByText("(link patrocinado)")).toBeInTheDocument();
  });

  it("exposes an accessible label for screen readers", () => {
    render(<AffiliateDisclosure />);
    expect(
      screen.getByLabelText(/Link de afiliado.*comissão por compras qualificadas/i)
    ).toBeInTheDocument();
  });
});
