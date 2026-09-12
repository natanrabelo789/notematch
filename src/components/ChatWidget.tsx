"use client";

import type {
  ChatMessage,
  LeadData,
  LeadStage,
  Notebook,
  RecommendationResponse,
} from "@/lib/types";
import { looksLikeNeedDescription, parseBudgetRange } from "@/lib/nl";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatWidgetProps {
  accessories?: string[];
  onSpecialistRequest?: () => void;
}

const INITIAL_MESSAGE =
  "Olá! Posso te ajudar gratuitamente a entender qual notebook faz mais sentido para o seu uso e orçamento. Descreva o que você precisa em uma frase, ou escolha uma opção abaixo.";

function getQuickReplies(stage: LeadStage): string[] {
  if (stage === "initial")
    return [
      "Quero ajuda para escolher",
      "Tenho dúvidas sobre um modelo",
      "Quero entender critérios técnicos",
    ];
  if (stage === "budget_discussion")
    return ["Até R$ 4.000", "De R$ 4.000 a R$ 6.000", "Acima de R$ 6.000"];
  if (stage === "usage_discussion")
    return ["Trabalho/Estudos", "Jogos", "Design/Edição", "Programação"];
  if (stage === "offer_contact")
    return ["Sim, quero o resumo", "Não, obrigado"];
  return [];
}

function formatOptionsMessage(
  result: RecommendationResponse,
  preface?: string
): string {
  const header =
    preface ??
    (result.interpretation
      ? `Com base no que você descreveu (${result.interpretation}), estas opções do nosso catálogo fazem sentido:`
      : "Estas opções do nosso catálogo fazem sentido para o seu perfil:");

  if (result.recommendations.length === 0) {
    return `${header}\n\nNão encontrei um modelo ideal nessa faixa. Podemos ajustar o orçamento ou as prioridades técnicas.`;
  }

  const lines = result.recommendations.map((nb: Notebook, index: number) => {
    return `${index + 1}. ${nb.name} (${nb.brand}) — ${nb.price}\n   ${nb.reason}`;
  });

  return `${header}\n\n${lines.join("\n\n")}\n\nSe quiser, posso registrar suas preferências e te enviar um resumo por e-mail. Deseja receber?`;
}

function budgetRangeFromLeadBudget(budget: string) {
  return parseBudgetRange(budget) ?? "4000-6000";
}

export default function ChatWidget({
  accessories = [],
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      message: INITIAL_MESSAGE,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [leadData, setLeadData] = useState<LeadData>({
    name: "",
    email: "",
    phone: "",
    budget: "",
    usage: "",
    accessories: [],
    stage: "initial",
    chatHistory: [],
    source: "chat_widget",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const leadDataRef = useRef(leadData);

  useEffect(() => {
    leadDataRef.current = leadData;
  }, [leadData]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, scrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!open) setHasNotification(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function toggleChat() {
    setOpen((prev) => !prev);
    setHasNotification(false);
  }

  function addUserMessage(message: string) {
    const entry: ChatMessage = {
      role: "user",
      message,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, entry]);
    setLeadData((prev) => ({
      ...prev,
      chatHistory: [...prev.chatHistory, entry],
    }));
  }

  function addBotMessage(message: string, delay = 800) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const entry: ChatMessage = {
        role: "bot",
        message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, entry]);
      setLeadData((prev) => ({
        ...prev,
        chatHistory: [...prev.chatHistory, entry],
      }));
    }, delay);
  }

  async function saveLeadToApi(data: LeadData) {
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, accessories }),
      });
      const result = await res.json().catch(() => null);
      if (!res.ok) {
        console.error("[NoteMatch] Lead save failed:", res.status, result);
      } else if (result?.mode === "console") {
        console.warn(
          "[NoteMatch] Lead was NOT persisted to Supabase (running in console mode). Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
        );
      }
    } catch (error) {
      console.error("[NoteMatch] Failed to reach /api/leads:", error);
    }
  }

  async function fetchRecommendations(payload: {
    usage?: string;
    budgetRange?: string;
    brand?: string;
    query?: string;
  }): Promise<RecommendationResponse | null> {
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) return null;
      return (await res.json()) as RecommendationResponse;
    } catch (error) {
      console.error("[NoteMatch] Failed to reach /api/recommendations:", error);
      return null;
    }
  }

  async function replyWithMatches(
    payload: {
      usage?: string;
      budgetRange?: string;
      brand?: string;
      query?: string;
    },
    leadPatch: Partial<LeadData>
  ) {
    setTyping(true);
    const result = await fetchRecommendations(payload);
    setTyping(false);

    if (!result) {
      setLeadData((prev) => ({
        ...prev,
        ...leadPatch,
        stage: "offer_contact",
      }));
      addBotMessage(
        "Tive um problema ao consultar o catálogo agora. Posso registrar suas preferências e te enviar um resumo depois. Deseja receber?",
        300
      );
      return;
    }

    setLeadData((prev) => ({
      ...prev,
      ...leadPatch,
      stage: "offer_contact",
    }));
    addBotMessage(formatOptionsMessage(result), 300);
  }

  async function processMessage(message: string) {
    const messageLower = message.toLowerCase();
    const stage = leadDataRef.current.stage;

    if (stage === "initial") {
      if (looksLikeNeedDescription(message)) {
        await replyWithMatches(
          { query: message },
          {
            usage: message,
            budget: parseBudgetRange(message) ?? "",
          }
        );
        return;
      }

      setLeadData((prev) => ({ ...prev, stage: "budget_discussion" }));
      addBotMessage(
        "Para te orientar melhor, qual faixa de orçamento faz mais sentido para você?"
      );
      return;
    }

    if (stage === "budget_discussion") {
      setLeadData((prev) => ({
        ...prev,
        budget: message,
        stage: "usage_discussion",
      }));
      addBotMessage(
        "E como você pretende usar o notebook? (ex.: estudos, trabalho, jogos, programação, edição)"
      );
      return;
    }

    if (stage === "usage_discussion") {
      const budget = leadDataRef.current.budget;
      await replyWithMatches(
        {
          usage: message,
          budgetRange: budgetRangeFromLeadBudget(budget),
          query: `${message}. Orçamento: ${budget}`,
        },
        { usage: message }
      );
      return;
    }

    if (stage === "offer_contact") {
      const accepted =
        messageLower.includes("sim") ||
        messageLower.includes("quero") ||
        messageLower.includes("pode") ||
        messageLower.includes("resumo");
      if (!accepted) {
        setLeadData((prev) => ({ ...prev, stage: "done" }));
        addBotMessage(
          "Sem problema! Qualquer dúvida sobre os critérios técnicos (processador, memória, autonomia, tela), é só perguntar."
        );
        return;
      }
      setLeadData((prev) => ({ ...prev, stage: "ask_name" }));
      addBotMessage("Legal! Como posso te chamar? (opcional)");
      return;
    }

    if (stage === "ask_name") {
      setLeadData((prev) => ({ ...prev, name: message, stage: "ask_email" }));
      addBotMessage(
        "Se quiser, deixe o melhor e-mail para eu enviar o resumo da recomendação."
      );
      return;
    }

    if (stage === "ask_email") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message)) {
        addBotMessage("Esse e-mail parece inválido. Pode digitar novamente?");
        return;
      }
      setLeadData((prev) => ({ ...prev, email: message, stage: "ask_phone" }));
      addBotMessage(
        "Se preferir continuar depois, você pode deixar um contato opcional (telefone ou WhatsApp). Pode pular se não quiser."
      );
      return;
    }

    if (stage === "ask_phone") {
      const skipped =
        messageLower.includes("pular") ||
        messageLower.includes("não") ||
        messageLower.includes("nao");
      const phone = skipped ? "" : message;
      const current = leadDataRef.current;
      const updated: LeadData = {
        ...current,
        phone,
        stage: "done",
        chatHistory: current.chatHistory,
      };
      setLeadData(updated);
      addBotMessage(
        `Pronto! Registrei suas preferências (${current.budget || "orçamento sob consulta"}, ${current.usage}) e posso continuar essa análise quando você quiser. Ao enviar seus dados, você concorda em receber o resumo da recomendação e eventuais contatos sobre a sua análise.`,
        1000
      );
      saveLeadToApi({ ...updated, accessories });
      return;
    }

    if (messageLower.includes("garantia")) {
      addBotMessage(
        "A garantia varia conforme o fabricante e a loja. No lado técnico, posso te ajudar a entender o que prioriza durabilidade, como qualidade de construção, bateria e capacidade de upgrade."
      );
    } else if (messageLower.includes("parcel") || messageLower.includes("promo")) {
      addBotMessage(
        "Preço, parcelamento e promoções são definidos pela loja e variam. Posso te ajudar a entender se vale priorizar memória, processador ou autonomia dentro do seu orçamento."
      );
    } else if (looksLikeNeedDescription(message)) {
      await replyWithMatches(
        { query: message },
        {
          usage: message,
          budget: parseBudgetRange(message) ?? leadDataRef.current.budget,
        }
      );
    } else {
      addBotMessage(
        "Posso aprofundar os critérios técnicos para você comparar melhor as opções — processador, memória, armazenamento, GPU, tela e autonomia. Sobre qual deles quer entender mais? Ou descreva de novo o que você precisa que eu busco no catálogo."
      );
    }
  }

  function sendMessage(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    addUserMessage(message);
    setInput("");
    void processMessage(message);
  }

  function openSpecialistChat() {
    if (!open) {
      setOpen(true);
      setHasNotification(false);
    }
    setLeadData((prev) => ({ ...prev, stage: "budget_discussion" }));
    addBotMessage(
      "Vamos lá! Para entender qual perfil faz mais sentido, qual faixa de orçamento você considera?",
      300
    );
  }

  // Expose openSpecialistChat via custom event so ResultsList can trigger it
  useEffect(() => {
    const handler = () => openSpecialistChat();
    window.addEventListener("notematch:open-chat", handler);
    return () => window.removeEventListener("notematch:open-chat", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickReplies = getQuickReplies(leadData.stage);

  return (
    <>
      <button
        type="button"
        className={`chat-fab${hasNotification ? " has-notification" : ""}`}
        onClick={toggleChat}
        aria-label="Tirar dúvidas sobre a recomendação"
      >
        💬
      </button>

      <div className={`chat-window${open ? " active" : ""}`}>
        <div className="chat-header">
          <div>
            <strong>Especialista NoteMatch</strong>
            <div style={{ fontSize: ".85rem", opacity: 0.9 }}>
              Ajuda para entender qual perfil faz mais sentido para você
            </div>
          </div>
          <button
            type="button"
            onClick={toggleChat}
            aria-label="Fechar chat"
            className="chat-close-btn"
          >
            ✕
          </button>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div
              key={`${msg.timestamp}-${i}`}
              className={`chat-message${msg.role === "user" ? " user" : ""}`}
            >
              <div className="chat-avatar">
                {msg.role === "user" ? "V" : "N"}
              </div>
              <div>
                <div className="chat-bubble chat-bubble-pre">{msg.message}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat-typing active">Especialista digitando...</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {quickReplies.length > 0 && (
          <div className="quick-replies">
            {quickReplies.map((reply) => (
              <button
                key={reply}
                type="button"
                className="quick-reply-btn"
                onClick={() => sendMessage(reply)}
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Descreva o que você precisa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => sendMessage()}
          >
            Enviar
          </button>
        </div>
      </div>
    </>
  );
}

export function openChatWidget() {
  window.dispatchEvent(new CustomEvent("notematch:open-chat"));
}
