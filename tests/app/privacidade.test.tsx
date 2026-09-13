import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacidadePage from "@/app/privacidade/page";

describe("PrivacidadePage", () => {
  it("renders the page title", () => {
    render(<PrivacidadePage />);
    expect(
      screen.getByRole("heading", { name: "Política de Privacidade" })
    ).toBeInTheDocument();
  });

  it("shows a plain-language summary at the top", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/Resumo:/i)).toBeInTheDocument();
  });

  it("lists the data collected via the chat widget", () => {
    render(<PrivacidadePage />);
    const text = screen.getByText(/Nome \(opcional\)/i).closest("ul");
    expect(text).not.toBeNull();
    expect(screen.getByText(/E-mail \(necessário/i)).toBeInTheDocument();
    expect(screen.getByText(/Telefone ou WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByText(/Histórico completo da conversa/i)).toBeInTheDocument();
  });

  it("discloses Supabase and Amazon Associates as third-party processors", () => {
    render(<PrivacidadePage />);
    expect(screen.getAllByText(/Supabase/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Amazon Associates/i).length).toBeGreaterThan(0);
  });

  it("mentions cookies and local storage", () => {
    render(<PrivacidadePage />);
    expect(screen.getAllByText(/armazenamento local/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/cookies/i).length).toBeGreaterThan(0);
  });

  it("lists the LGPD user rights", () => {
    render(<PrivacidadePage />);
    expect(screen.getAllByText(/LGPD/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/acesso aos dados/i)).toBeInTheDocument();
    expect(screen.getByText(/Revogação do consentimento/i)).toBeInTheDocument();
    expect(screen.getByText(/Portabilidade/i)).toBeInTheDocument();
  });

  it("provides a contact method for data requests", () => {
    render(<PrivacidadePage />);
    expect(
      screen.getAllByText(/contato@notematch\.example/i).length
    ).toBeGreaterThan(0);
  });

  it("shows the effective date", () => {
    render(<PrivacidadePage />);
    expect(screen.getByText(/Data de vigência:/i)).toBeInTheDocument();
    expect(screen.getByText(/setembro de 2026/i)).toBeInTheDocument();
  });
});
