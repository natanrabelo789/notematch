"use client";

import ChatCtaInline from "@/components/ChatCtaInline";
import type { Notebook } from "@/lib/types";

interface ResultsListProps {
  recommendations: Notebook[];
  userType: "myself" | "gift";
  giftRecipient: string;
  budgetLabel: string;
  giftAccessories: string[];
  compareSelection: Set<number>;
  onToggleCompare: (index: number) => void;
  onOpenChat: () => void;
}

export default function ResultsList({
  recommendations,
  userType,
  giftRecipient,
  budgetLabel,
  giftAccessories,
  compareSelection,
  onToggleCompare,
  onOpenChat,
}: ResultsListProps) {
  const title =
    userType === "gift" && giftRecipient
      ? `Recomendações para ${giftRecipient}`
      : "Suas Recomendações Personalizadas";

  const introText =
    recommendations.length > 0
      ? `Encontramos ${recommendations.length} opção${recommendations.length > 1 ? "ões" : ""} dentro da faixa ${budgetLabel}.`
      : `Não encontramos opções exatas na faixa ${budgetLabel}.`;

  return (
    <div className="results active">
      <div style={{ marginBottom: "var(--space-24)" }}>
        <h2 style={{ color: "var(--color-text)", marginBottom: "var(--space-12)" }}>
          {title}
        </h2>
        <p style={{ color: "var(--color-text-secondary)" }}>
          {introText}
          {userType === "gift" && giftAccessories.length > 0 && (
            <>
              <br />
              <strong>Acessórios desejados:</strong> {giftAccessories.join(", ")}.
            </>
          )}
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="result-card">
          <div className="result-title" style={{ fontSize: "1.25rem" }}>
            Nenhum modelo encontrado nessa faixa
          </div>
          <p className="result-description">
            Tente mudar a faixa de orçamento ou abrir o chat gratuito para um
            especialista encontrar alternativas mais próximas do que você precisa.
          </p>
          <ChatCtaInline
            title="Quer ajuda para flexibilizar a busca?"
            description="Nosso especialista pode sugerir substitutos ou promoções compatíveis."
            buttonLabel="Falar com especialista grátis"
            onOpenChat={onOpenChat}
          />
        </div>
      ) : (
        recommendations.map((rec, index) => (
          <div key={rec.id} className="result-card">
            <div className="result-header">
              <div>
                <div className="result-title">{rec.name}</div>
                <span className="result-brand">{rec.brand}</span>
              </div>
              <div className="result-price">{rec.price}</div>
            </div>
            <div className="result-specs">
              <div className="spec-item">
                <div className="spec-label">Processador</div>
                <div className="spec-value">{rec.processor}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Memória RAM</div>
                <div className="spec-value">{rec.ram}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Armazenamento</div>
                <div className="spec-value">{rec.storage}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Placa de Vídeo</div>
                <div className="spec-value">{rec.gpu}</div>
              </div>
              <div className="spec-item">
                <div className="spec-label">Tela</div>
                <div className="spec-value">{rec.screen}</div>
              </div>
            </div>
            <p className="result-description">{rec.description}</p>
            <div className="recommendation-reason">
              <h4>Por que recomendamos?</h4>
              <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
                {rec.reason}
              </p>
            </div>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id={`compare-${index}`}
                checked={compareSelection.has(index)}
                onChange={() => onToggleCompare(index)}
              />
              <label htmlFor={`compare-${index}`} className="inline-label">
                Adicionar à comparação
              </label>
            </div>
          </div>
        ))
      )}

      {userType === "gift" && giftAccessories.length > 0 && recommendations.length > 0 && (
        <div className="result-card">
          <div className="result-title" style={{ fontSize: "1.2rem" }}>
            Acessórios para complementar o presente
          </div>
          <p className="result-description">
            Você indicou estes itens extras:{" "}
            <strong>{giftAccessories.join(", ")}</strong>.
          </p>
          <div className="recommendation-reason">
            <h4>Sugestão</h4>
            <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
              Use essa seleção para montar um combo mais completo na hora de
              fechar a compra ou no atendimento com o especialista.
            </p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginTop: "var(--space-24)" }}>
          <ChatCtaInline
            description="Fale com um especialista gratuitamente para fechar a compra com confiança."
            onOpenChat={onOpenChat}
          />
        </div>
      )}
    </div>
  );
}
