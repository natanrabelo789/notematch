import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NotebookForm from "@/components/NotebookForm";

describe("NotebookForm", () => {
  it("shows the idle button label and submits the default (myself) profile", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NotebookForm onSubmit={onSubmit} loading={false} />);

    await user.type(screen.getByLabelText(/Descreva como você vai usar/i), "jogos");
    await user.selectOptions(
      screen.getByLabelText(/Preferência de marca/i),
      "Lenovo"
    );
    await user.click(screen.getByLabelText("De R$ 4.000 a R$ 6.000"));
    await user.click(
      screen.getByRole("button", { name: /Ver recomendações/i })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      userType: "myself",
      giftRecipient: "",
      giftAccessories: [],
      usage: "jogos",
      brand: "Lenovo",
      budgetRange: "4000-6000",
    });
  });

  it("disables the button and changes its label while loading", () => {
    render(<NotebookForm onSubmit={vi.fn()} loading />);
    const button = screen.getByRole("button", { name: /Analisando seu perfil/i });
    expect(button).toBeDisabled();
  });

  it("reveals gift fields only when 'gift' is selected and clears accessories on switch back", async () => {
    const user = userEvent.setup();
    render(<NotebookForm onSubmit={vi.fn()} loading={false} />);

    // Hidden by default
    expect(screen.queryByLabelText(/Quem vai receber/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Mouse")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Presente para alguém"));
    expect(screen.getByLabelText(/Quem vai receber/i)).toBeInTheDocument();

    const mouse = screen.getByLabelText("Mouse");
    await user.click(mouse);
    expect(mouse).toBeChecked();

    // Switching back to "myself" hides + clears the accessory selection
    await user.click(screen.getByLabelText("Eu mesmo(a)"));
    expect(screen.queryByLabelText("Mouse")).not.toBeInTheDocument();

    await user.click(screen.getByLabelText("Presente para alguém"));
    expect(screen.getByLabelText("Mouse")).not.toBeChecked();
  });

  it("submits gift data including recipient and selected accessories", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<NotebookForm onSubmit={onSubmit} loading={false} />);

    await user.click(screen.getByLabelText("Presente para alguém"));
    await user.type(
      screen.getByLabelText(/Quem vai receber/i),
      "Minha filha"
    );
    await user.click(screen.getByLabelText("Mouse"));
    await user.click(screen.getByLabelText("Fone"));
    await user.type(screen.getByLabelText(/Descreva como você vai usar/i), "estudos");
    await user.click(screen.getByRole("button", { name: /Ver recomendações/i }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        userType: "gift",
        giftRecipient: "Minha filha",
        giftAccessories: ["Mouse", "Fone"],
        usage: "estudos",
        budgetRange: "ate-4000",
      })
    );
  });
});
