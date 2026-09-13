import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ChatCtaInline from "@/components/ChatCtaInline";

describe("Header", () => {
  it("renders the brand and primary nav link", () => {
    render(<Header />);
    expect(screen.getByText("NoteMatch")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Início" })).toHaveAttribute(
      "href",
      "#inicio"
    );
  });
});

describe("Footer", () => {
  it("renders the affiliate disclosure", () => {
    render(<Footer />);
    expect(screen.getByText(/associado da Amazon/i)).toBeInTheDocument();
  });

  it("renders the CERTAIN CONTENT disclaimer (IP License §2(k))", () => {
    render(<Footer />);
    expect(
      screen.getByText(/certo conteúdo que aparece neste site vem da amazon/i)
    ).toBeInTheDocument();
  });

  it("links to the privacy policy", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /Política de Privacidade/i })
    ).toHaveAttribute("href", "/privacidade");
  });
});

describe("ChatCtaInline", () => {
  it("renders optional title/description and uses the default button label", () => {
    render(<ChatCtaInline onOpenChat={vi.fn()} />);
    expect(
      screen.getByRole("button", { name: "Tirar dúvidas sobre a recomendação" })
    ).toBeInTheDocument();
  });

  it("renders a custom title, description and button label", () => {
    render(
      <ChatCtaInline
        title="Quer conversar?"
        description="Tire suas dúvidas"
        buttonLabel="Falar agora"
        onOpenChat={vi.fn()}
      />
    );
    expect(screen.getByText("Quer conversar?")).toBeInTheDocument();
    expect(screen.getByText("Tire suas dúvidas")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Falar agora" })).toBeInTheDocument();
  });

  it("calls onOpenChat when the button is clicked", async () => {
    const user = userEvent.setup();
    const onOpenChat = vi.fn();
    render(<ChatCtaInline onOpenChat={onOpenChat} />);
    await user.click(screen.getByRole("button"));
    expect(onOpenChat).toHaveBeenCalledTimes(1);
  });
});
