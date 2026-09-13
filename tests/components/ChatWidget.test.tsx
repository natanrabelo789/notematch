import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import ChatWidget, { openChatWidget } from "@/components/ChatWidget";

/** Advance fake timers (wrapped in act) to flush the bot's typing delays. */
async function flush(ms = 1100) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

function sendText(value: string) {
  const input = screen.getByPlaceholderText("Descreva o que você precisa...");
  fireEvent.change(input, { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
}

const recommendationPayload = {
  recommendations: [
    {
      id: "lenovo-loq-15",
      name: "Lenovo LOQ 15",
      brand: "Lenovo",
      price: "R$ 5.999",
      priceValue: 5999,
      processor: "Intel Core i7",
      ram: "16GB",
      storage: "512GB",
      gpu: "RTX 4050",
      screen: "15.6\"",
      description: "Gamer de entrada",
      reason: "Boa porta de entrada para games.",
      categories: ["gaming"],
    },
  ],
  category: "gaming",
  budgetLabel: "de R$ 4.000 a R$ 6.000",
  catalogSource: "fallback",
  interpretation: "Perfil: gaming · orçamento de R$ 4.000 a R$ 6.000",
};

const fetchMock = vi.fn((url: string) => {
  if (url === "/api/recommendations") {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(recommendationPayload),
    });
  }
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ saved: true, mode: "supabase" }),
  });
});

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockClear();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("ChatWidget", () => {
  it("renders closed with the initial bot greeting", () => {
    const { container } = render(<ChatWidget />);
    expect(screen.getByText(/Posso te ajudar gratuitamente/i)).toBeInTheDocument();
    expect(container.querySelector(".chat-window")).not.toHaveClass("active");
  });

  it("opens and closes when the floating button is toggled", async () => {
    const { container } = render(<ChatWidget />);
    const fab = screen.getByRole("button", {
      name: /Tirar dúvidas sobre a recomendação/i,
    });

    fireEvent.click(fab);
    expect(container.querySelector(".chat-window")).toHaveClass("active");

    fireEvent.click(fab);
    expect(container.querySelector(".chat-window")).not.toHaveClass("active");
  });

  it("walks the full lead-capture flow and posts the lead to /api/leads", async () => {
    render(<ChatWidget accessories={["Mouse"]} />);
    fireEvent.click(
      screen.getByRole("button", { name: /Tirar dúvidas sobre a recomendação/i })
    );

    // initial -> budget_discussion
    fireEvent.click(screen.getByRole("button", { name: "Quero ajuda para escolher" }));
    await flush();
    expect(screen.getByText(/faixa de orçamento faz mais sentido/i)).toBeInTheDocument();

    // budget_discussion -> usage_discussion
    fireEvent.click(screen.getByRole("button", { name: "Até R$ 4.000" }));
    await flush();
    expect(screen.getByText(/como você pretende usar o notebook/i)).toBeInTheDocument();

    // usage_discussion -> recommendations -> offer_contact
    fireEvent.click(screen.getByRole("button", { name: "Jogos" }));
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(400);
    });
    expect(screen.getByText(/Lenovo LOQ 15/i)).toBeInTheDocument();
    expect(screen.getByText(/Deseja receber\?/i)).toBeInTheDocument();

    const recCall = fetchMock.mock.calls.find(([url]) => url === "/api/recommendations");
    expect(recCall).toBeTruthy();

    // offer_contact -> ask_name
    fireEvent.click(screen.getByRole("button", { name: "Sim, quero o resumo" }));
    await flush();
    expect(screen.getByText(/Como posso te chamar/i)).toBeInTheDocument();

    // ask_name -> ask_email
    sendText("Ana");
    await flush();
    expect(screen.getByText(/deixe o melhor e-mail/i)).toBeInTheDocument();

    // ask_email: invalid -> re-prompt, stays on ask_email
    sendText("bademail");
    await flush();
    expect(screen.getByText(/Esse e-mail parece inválido/i)).toBeInTheDocument();

    // ask_email: valid -> ask_phone
    sendText("ana@example.com");
    await flush();
    expect(screen.getByText(/contato opcional/i)).toBeInTheDocument();

    // LGPD data-collection notice is shown while capturing email/phone.
    expect(
      screen.getByRole("link", { name: /Política de Privacidade/i })
    ).toHaveAttribute("href", "/privacidade");

    // ask_phone: skip -> done + lead is saved
    sendText("pular");
    await flush();
    expect(screen.getByText(/Registrei suas preferências/i)).toBeInTheDocument();

    // Email compliance: final message includes unsubscribe note, Associates
    // disclosure, and a reference to the privacy policy.
    expect(screen.getByText(/Pode cancelar a qualquer momento/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Consulte nossa Política de Privacidade em \/privacidade/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/associado da Amazon/i)).toBeInTheDocument();

    const leadCall = fetchMock.mock.calls.find(([url]) => url === "/api/leads");
    expect(leadCall).toBeTruthy();
    const [, options] = leadCall!;
    expect(options.method).toBe("POST");
    const payload = JSON.parse(options.body as string);
    expect(payload).toMatchObject({
      name: "Ana",
      email: "ana@example.com",
      phone: "",
      budget: "Até R$ 4.000",
      usage: "Jogos",
      accessories: ["Mouse"],
      stage: "done",
    });
  });

  it("matches a free-form natural language need on the initial stage", async () => {
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /Tirar dúvidas sobre a recomendação/i })
    );

    sendText("Preciso de um notebook gamer Lenovo até R$ 6.000 para jogar Fortnite");
    await act(async () => {
      await Promise.resolve();
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.getByText(/Lenovo LOQ 15/i)).toBeInTheDocument();
    const recCall = fetchMock.mock.calls.find(([url]) => url === "/api/recommendations");
    expect(recCall).toBeTruthy();
    const body = JSON.parse((recCall![1] as RequestInit).body as string);
    expect(body.query).toMatch(/gamer Lenovo/i);
  });

  it("asks to rephrase and does not recommend for nonsensical free text", async () => {
    render(<ChatWidget />);
    fireEvent.click(
      screen.getByRole("button", { name: /Tirar dúvidas sobre a recomendação/i })
    );

    sendText("i want to do a barbecue with my friends this weekend");
    await flush();

    expect(
      screen.getByText(/Não entendi bem o que você precisa no notebook/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Lenovo LOQ 15/i)).not.toBeInTheDocument();
    const recCall = fetchMock.mock.calls.find(([url]) => url === "/api/recommendations");
    expect(recCall).toBeUndefined();
  });

  it("opens and starts the specialist flow via the openChatWidget event", async () => {
    render(<ChatWidget />);

    await act(async () => {
      openChatWidget();
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(screen.getByText(/qual faixa de orçamento você considera/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "De R$ 4.000 a R$ 6.000" })).toBeInTheDocument();
  });
});
