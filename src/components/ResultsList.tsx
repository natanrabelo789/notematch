"use client";

import ChatCtaInline from "@/components/ChatCtaInline";
import { getNotebookProfile } from "@/lib/catalog";
import type { Notebook } from "@/lib/types";

// Amazon Associates compliance:
// - We do NOT render hardcoded prices here. Per Participation Requirements §2(b),
//   prices may only be shown if served by Amazon via a Special Link or obtained via
//   the Creators API / PA API. The catalog still keeps `price`/`priceValue` fields
//   for future PA API integration, but they are intentionally not displayed.
// - When PA API/Creators API is wired up, render <PriceDisclaimer updatedAt={...} />
//   immediately adjacent to each price (see src/components/PriceDisclaimer.tsx).
// - When Amazon Special Links are added to each recommendation, render
//   <AffiliateDisclosure /> here, immediately adjacent to the link, per
//   FTC/Amazon link-level disclosure requirements (see src/components/AffiliateDisclosure.tsx).

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
      ? `Selecionamos ${recommendations.length} ${recommendations.length > 1 ? "modelos compatíveis" : "modelo compatível"} com o seu cenário de uso e orçamento (${budgetLabel}).`
      : `Não encontramos um modelo que atenda bem a esse perfil dentro da faixa ${budgetLabel}.`;

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
        {/* Site-wide Associates disclosure duplicated near the recommendations
            list (FTC/Amazon placement requirement). Keep wording consistent
            with src/components/Footer.tsx. */}
        <p
          style={{
            fontSize: ".8rem",
            color: "var(--color-text-secondary)",
            margin: "var(--space-12) 0 0",
          }}
        >
          Como associado da Amazon, podemos receber comissão por compras
          qualificadas.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <div className="result-card">
          <div className="result-title" style={{ fontSize: "1.25rem" }}>
            Nenhum modelo ideal nessa faixa
          </div>
          <p className="result-description">
            Não encontramos um modelo que atenda bem a esse perfil dentro dessa
            faixa. Podemos sugerir ajustes de expectativa, prioridades técnicas
            ou alternativas equivalentes.
          </p>
          <ChatCtaInline
            title="Quer conversar sobre alternativas?"
            description="Podemos ajudar a repriorizar critérios técnicos ou ajustar a faixa de orçamento."
            buttonLabel="Conversar sobre alternativas"
            onOpenChat={onOpenChat}
          />
        </div>
      ) : (
        recommendations.map((rec, index) => {
          const profile = getNotebookProfile(rec);
          return (
          <div key={rec.id} className="result-card">
            <div className="result-header">
              <div>
                <div className="result-title">{rec.name}</div>
                <span className="result-brand">{rec.brand}</span>
              </div>
            </div>
            <div className="recommendation-reason">
              <h4>Por que esse modelo faz sentido para você</h4>
              <p style={{ color: "var(--color-text-secondary)", margin: 0 }}>
                {rec.reason}
              </p>
            </div>
            <div className="result-fit">
              <p style={{ margin: "0 0 6px" }}>
                <strong>Indicado para:</strong> {profile.idealFor}.
              </p>
              <p style={{ margin: 0 }}>
                <strong>Pontos de atenção:</strong> menos indicado para{" "}
                {profile.watchOut}.
              </p>
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
            {/*
              Amazon Associates compliance — do NOT render hardcoded prices here.
              Per Participation Requirements §2(b), prices may only be shown if
              served by Amazon via a Special Link or obtained via the Creators
              API / PA API. The catalog keeps `price`/`priceValue` for future PA
              API use but they must not be displayed as Amazon product prices now.

              When PA API/Creators API is integrated, render the price here with:
                <PriceDisclaimer updatedAt={lastRefreshedAt} />
              immediately adjacent to the displayed price.

              When Amazon Special Links are added to each recommendation, render:
                <AffiliateDisclosure />
              immediately adjacent to the link, per FTC/Amazon link-level
              disclosure requirements.
            */}
            <p
              style={{
                fontSize: ".85rem",
                color: "var(--color-text-secondary)",
                margin: "var(--space-12) 0 0",
              }}
            >
              As recomendações são editoriais; a disponibilidade e o preço podem
              variar na loja.
            </p>
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
          );
        })
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
              Considere esses itens para montar um conjunto mais completo de
              acordo com o perfil de uso de quem vai receber.
            </p>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginTop: "var(--space-24)" }}>
          <ChatCtaInline
            description="Quer entender qual dessas recomendações faz mais sentido para o seu perfil? Tire suas dúvidas com a gente."
            onOpenChat={onOpenChat}
          />
        </div>
      )}
    </div>
  );
}
