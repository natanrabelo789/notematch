/**
 * PriceDisclaimer — Amazon Associates price/availability disclaimer.
 *
 * Amazon Associates Program IP License §2(i) requires that, when product
 * prices or availability are displayed, the following disclaimer be shown
 * adjacent to the price/availability info (or via hyperlink/pop-up):
 *
 *   "Os preços e a disponibilidade dos produtos estão corretos na data/horário
 *    indicados e poderão sofrer alterações. Quaisquer informações de preço e
 *    disponibilidade exibidas [no(s) respectivo(s) Site(s) da Amazon, conforme
 *    aplicável] no momento da compra serão aplicáveis à compra desse produto."
 *
 * When prices are refreshed less frequently than hourly via the PA API /
 * Creators API (or obtained via Data Feeds), a date/time stamp must also be
 * shown adjacent to the price. Pass the `updatedAt` prop (ISO 8601) to render
 * that stamp; omit it when prices are refreshed at least hourly.
 *
 * USAGE: Render this component immediately adjacent to any displayed Amazon
 * product price. It is NOT rendered in ResultsList today because no prices are
 * shown (see src/components/ResultsList.tsx). Once PA API is integrated, render
 * it next to each price.
 */

interface PriceDisclaimerProps {
  /** Optional ISO 8601 date/time the price was last refreshed. Shown as a
   *  date/time stamp when provided (required by IP License §2(i) when prices
   *  are refreshed less than hourly). Omit when refreshing at least hourly. */
  updatedAt?: string;
}

const DISCLAIMER_TEXT =
  "Os preços e a disponibilidade dos produtos estão corretos na data/horário indicados e poderão sofrer alterações. Quaisquer informações de preço e disponibilidade exibidas na Amazon.com.br no momento da compra serão aplicáveis à compra desse produto.";

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  // Locale-agnostic, readable stamp. Kept explicit so it is deterministic.
  return date.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export default function PriceDisclaimer({ updatedAt }: PriceDisclaimerProps) {
  return (
    <p
      style={{
        fontSize: ".8rem",
        color: "var(--color-text-secondary)",
        margin: "var(--space-8) 0 0",
        lineHeight: 1.4,
      }}
    >
      {updatedAt && (
        <span style={{ display: "block", marginBottom: 2 }}>
          Preço atualizado em {formatTimestamp(updatedAt)}.
        </span>
      )}
      {DISCLAIMER_TEXT}
    </p>
  );
}

export { DISCLAIMER_TEXT };
