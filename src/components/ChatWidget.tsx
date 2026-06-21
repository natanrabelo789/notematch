"use client";

import type { ChatMessage, LeadData, LeadStage } from "@/lib/types";
import { useCallback, useEffect, useRef, useState } from "react";

interface ChatWidgetProps {
  accessories?: string[];
  onSpecialistRequest?: () => void;
}

const INITIAL_MESSAGE =
  "Olá! Posso te ajudar gratuitamente a escolher o notebook ideal e acelerar sua compra. O que você precisa?";

function getQuickReplies(stage: LeadStage): string[] {
  if (stage === "initial")
    return [
      "Preciso de ajuda para escolher",
      "Tenho dúvidas sobre um modelo",
      "Quero falar sobre orçamento",
    ];
  if (stage === "budget_discussion")
    return ["Até R$ 4.000", "De R$ 4.000 a R$ 6.000", "Acima de R$ 6.000"];
  if (stage === "usage_discussion")
    return ["Trabalho/Estudos", "Gaming", "Design/Edição", "Programação"];
  return [];
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
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, accessories }),
      });
    } catch (error) {
      console.error("Failed to save lead:", error);
    }
  }

  function processMessage(message: string) {
    const messageLower = message.toLowerCase();
    const stage = leadData.stage;

    if (stage === "initial") {
      setLeadData((prev) => ({ ...prev, stage: "ask_name" }));
      addBotMessage(
        "Ótimo! Vou te ajudar a encontrar o notebook perfeito. Para começar, qual é o seu nome?"
      );
      return;
    }

    if (stage === "ask_name") {
      setLeadData((prev) => ({ ...prev, name: message, stage: "ask_email" }));
      addBotMessage(
        `Prazer, ${message}! Qual é o seu melhor e-mail para eu te enviar as recomendações?`
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
        "Perfeito! E qual é seu telefone ou WhatsApp para contato?"
      );
      return;
    }

    if (stage === "ask_phone") {
      setLeadData((prev) => ({
        ...prev,
        phone: message,
        stage: "budget_discussion",
      }));
      addBotMessage(
        "Qual faixa de investimento faz mais sentido para você hoje?"
      );
      return;
    }

    if (stage === "budget_discussion") {
      setLeadData((prev) => ({
        ...prev,
        budget: message,
        stage: "usage_discussion",
      }));
      addBotMessage("Agora me diga rapidamente como o notebook vai ser usado.");
      return;
    }

    if (stage === "usage_discussion") {
      const updated: LeadData = {
        ...leadData,
        usage: message,
        stage: "recommendation",
        chatHistory: leadData.chatHistory,
      };
      setLeadData(updated);
      addBotMessage(
        `Perfeito, ${leadData.name}! Com base no seu uso, vou deixar sua compra muito mais certeira. Nossa equipe vai continuar pelo e-mail ${leadData.email} e pelo WhatsApp ${leadData.phone} com opções compatíveis com ${leadData.budget}.`,
        1000
      );
      saveLeadToApi({ ...updated, accessories });
      return;
    }

    if (messageLower.includes("garantia")) {
      addBotMessage(
        "Todos os notebooks possuem garantia do fabricante, e podemos te orientar na melhor opção de cobertura estendida."
      );
    } else if (messageLower.includes("parcel")) {
      addBotMessage(
        "Podemos verificar parcelamento e promoções disponíveis quando nossa equipe entrar em contato."
      );
    } else {
      addBotMessage(
        "Ótima pergunta! Nosso especialista comercial pode aprofundar isso no atendimento e te ajudar a concluir a compra com segurança."
      );
    }
  }

  function sendMessage(text?: string) {
    const message = (text ?? input).trim();
    if (!message) return;
    addUserMessage(message);
    setInput("");
    processMessage(message);
  }

  function openSpecialistChat() {
    if (!open) {
      setOpen(true);
      setHasNotification(false);
    }
    setLeadData((prev) => ({ ...prev, stage: "ask_name" }));
    addBotMessage(
      "Perfeito! Vou te ajudar a validar a compra e encontrar a melhor opção. Para começar, qual é o seu nome?",
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
        aria-label="Solicitar ajuda gratuita pelo chat"
      >
        💬
      </button>

      <div className={`chat-window${open ? " active" : ""}`}>
        <div className="chat-header">
          <div>
            <strong>Especialista NoteMatch</strong>
            <div style={{ fontSize: ".85rem", opacity: 0.9 }}>
              Ajuda gratuita para escolher e comprar melhor
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
                <div className="chat-bubble">{msg.message}</div>
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
            placeholder="Digite sua mensagem..."
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
