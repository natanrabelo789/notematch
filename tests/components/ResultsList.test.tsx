import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResultsList from "@/components/ResultsList";
import { makeNotebook } from "../helpers/factories";

function renderList(props: Partial<React.ComponentProps<typeof ResultsList>> = {}) {
  const onToggleCompare = vi.fn();
  const onOpenChat = vi.fn();
  const defaults: React.ComponentProps<typeof ResultsList> = {
    recommendations: [makeNotebook({ id: "a", name: "Notebook A" })],
    userType: "myself",
    giftRecipient: "",
    budgetLabel: "de R$ 4.000 a R$ 6.000",
    giftAccessories: [],
    compareSelection: new Set<number>(),
    onToggleCompare,
    onOpenChat,
  };
  render(<ResultsList {...defaults} {...props} />);
  return { onToggleCompare, onOpenChat };
}

describe("ResultsList", () => {
  it("renders the default title and a pluralized intro with the budget label", () => {
    renderList({
      recommendations: [
        makeNotebook({ id: "a", name: "Notebook A" }),
        makeNotebook({ id: "b", name: "Notebook B" }),
      ],
    });

    expect(
      screen.getByRole("heading", { name: "Suas Recomendações Personalizadas" })
    ).toBeInTheDocument();
    expect(screen.getByText(/Selecionamos 2 modelos compatíveis/i)).toBeInTheDocument();
    expect(screen.getByText(/de R\$ 4\.000 a R\$ 6\.000/)).toBeInTheDocument();
    expect(screen.getByText("Notebook A")).toBeInTheDocument();
    expect(screen.getByText("Notebook B")).toBeInTheDocument();
  });

  it("uses the singular wording for a single recommendation", () => {
    renderList({ recommendations: [makeNotebook({ id: "a" })] });
    expect(screen.getByText(/Selecionamos 1 modelo compatível/i)).toBeInTheDocument();
  });

  it("renders the empty state and an alternatives CTA when there are no matches", async () => {
    const user = userEvent.setup();
    const { onOpenChat } = renderList({ recommendations: [] });

    expect(screen.getByText(/Nenhum modelo ideal nessa faixa/i)).toBeInTheDocument();
    const cta = screen.getByRole("button", { name: /Conversar sobre alternativas/i });
    await user.click(cta);
    expect(onOpenChat).toHaveBeenCalledTimes(1);
  });

  it("titles results for the gift recipient when in gift mode", () => {
    renderList({
      userType: "gift",
      giftRecipient: "Minha filha",
    });
    expect(
      screen.getByRole("heading", { name: "Recomendações para Minha filha" })
    ).toBeInTheDocument();
  });

  it("shows the gift accessories block when accessories were selected", () => {
    renderList({
      userType: "gift",
      giftRecipient: "Minha filha",
      giftAccessories: ["Mouse", "Fone"],
    });
    expect(
      screen.getByText(/Acessórios para complementar o presente/i)
    ).toBeInTheDocument();
    expect(screen.getAllByText(/Mouse, Fone/).length).toBeGreaterThan(0);
  });

  it("reflects compareSelection and calls onToggleCompare with the card index", async () => {
    const user = userEvent.setup();
    const onToggleCompare = vi.fn();
    render(
      <ResultsList
        recommendations={[
          makeNotebook({ id: "a", name: "A" }),
          makeNotebook({ id: "b", name: "B" }),
        ]}
        userType="myself"
        giftRecipient=""
        budgetLabel="x"
        giftAccessories={[]}
        compareSelection={new Set<number>([0])}
        onToggleCompare={onToggleCompare}
        onOpenChat={vi.fn()}
      />
    );

    const checkboxes = screen.getAllByLabelText("Adicionar à comparação");
    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).not.toBeChecked();

    await user.click(checkboxes[1]);
    expect(onToggleCompare).toHaveBeenCalledWith(1);
  });
});
