import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FinderSection from "@/components/FinderSection";
import { makeNotebook } from "../helpers/factories";

const RESPONSE = {
  recommendations: [
    makeNotebook({ id: "a", name: "Notebook A" }),
    makeNotebook({ id: "b", name: "Notebook B" }),
    makeNotebook({ id: "c", name: "Notebook C" }),
  ],
  category: "gaming",
  budgetLabel: "até R$ 4.000",
};

const fetchMock = vi.fn();
const alertMock = vi.fn();

beforeEach(() => {
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => RESPONSE,
  });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("alert", alertMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

async function submitForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Descreva como você vai usar/i), "jogos");
  await user.click(screen.getByRole("button", { name: /Ver recomendações/i }));
}

describe("FinderSection (integration)", () => {
  it("submits the form, calls the API and renders the recommendations", async () => {
    const user = userEvent.setup();
    render(<FinderSection />);

    await submitForm(user);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/recommendations",
      expect.objectContaining({ method: "POST" })
    );
    expect(await screen.findByText("Notebook A")).toBeInTheDocument();
    expect(screen.getByText("Notebook C")).toBeInTheDocument();
  });

  it("alerts the user when the recommendations request fails", async () => {
    fetchMock.mockResolvedValue({ ok: false });
    const user = userEvent.setup();
    render(<FinderSection />);

    await submitForm(user);

    await waitFor(() => expect(alertMock).toHaveBeenCalledTimes(1));
    expect(screen.queryByText("Notebook A")).not.toBeInTheDocument();
  });

  it("shows a rephrase message and no recommendations for nonsense usage", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({
        unclear: true,
        recommendations: [],
        error:
          "Não entendi bem o que você precisa no notebook. Pode reformular?",
      }),
    });
    const user = userEvent.setup();
    render(<FinderSection />);

    await user.type(
      screen.getByLabelText(/Descreva como você vai usar/i),
      "i want to do a barbecue"
    );
    await user.click(screen.getByRole("button", { name: /Ver recomendações/i }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument()
    );
    expect(
      screen.getByText(/Pode reformular/i)
    ).toBeInTheDocument();
    expect(screen.queryByText("Notebook A")).not.toBeInTheDocument();
    expect(alertMock).not.toHaveBeenCalled();
  });

  it("enforces a maximum of two notebooks in the comparison", async () => {
    const user = userEvent.setup();
    render(<FinderSection />);
    await submitForm(user);
    await screen.findByText("Notebook A");

    const checkboxes = screen.getAllByLabelText("Adicionar à comparação");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);

    // The compare bar now reflects two selections
    expect(
      screen.getByRole("button", { name: "Comparar (2)" })
    ).toBeInTheDocument();

    // Selecting a third triggers the limit alert and is not added
    await user.click(checkboxes[2]);
    expect(alertMock).toHaveBeenCalledTimes(1);
    expect(checkboxes[2]).not.toBeChecked();
  });

  it("opens the comparison modal once two notebooks are selected", async () => {
    const user = userEvent.setup();
    render(<FinderSection />);
    await submitForm(user);
    await screen.findByText("Notebook A");

    const checkboxes = screen.getAllByLabelText("Adicionar à comparação");
    await user.click(checkboxes[0]);
    await user.click(checkboxes[1]);
    await user.click(screen.getByRole("button", { name: /Comparar/ }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).getByText(/Diferenças entre os perfis recomendados/i)
    ).toBeInTheDocument();
  });
});
