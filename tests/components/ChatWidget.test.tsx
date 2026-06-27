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
  const input = screen.getByPlaceholderText("Digite sua mensagem...");
  fireEvent.change(input, { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Enviar" }));
}

const fetchMock = vi.fn((_url: string, _opts: RequestInit) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ saved: true, mode: "supabase" }),
  })
);

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", fetchMock);
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

    // usage_discussion -> offer_contact
    fireEvent.click(screen.getByRole("button", { name: "Jogos" }));
    await flush();
    expect(screen.getByText(/Deseja receber\?/i)).toBeInTheDocument();

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

    // ask_phone: skip -> done + lead is saved
    sendText("pular");
    await flush();
    expect(screen.getByText(/Registrei suas preferências/i)).toBeInTheDocument();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/leads");
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

  it("opens and starts the specialist flow via the openChatWidget event", async () => {
    const { container } = render(<ChatWidget />);

    await act(async () => {
      openChatWidget();
      await vi.advanceTimersByTimeAsync(400);
    });

    expect(container.querySelector(".chat-window")).toHaveClass("active");
    expect(screen.getByText(/qual faixa de orçamento você considera/i)).toBeInTheDocument();
    // Budget-stage quick replies are now offered
    expect(screen.getByRole("button", { name: "De R$ 4.000 a R$ 6.000" })).toBeInTheDocument();
  });
});
