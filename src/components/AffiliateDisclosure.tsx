/**
 * AffiliateDisclosure — FTC/Amazon link-level affiliate disclosure badge.
 *
 * FTC and the Amazon Associates Program require that affiliate links be
 * clearly and visibly identified at the link level (not only in a site-wide
 * disclosure). The disclosure must be adjacent to the link and easy to see.
 *
 * Official Amazon Associates (Brazil) accepted short-form examples include
 * "(link patrocinado)", "#pub" and "#ComissõesPorCompra". The default label
 * here is "#ComissõesPorCompra" — an officially endorsed Brazilian example.
 * The label can be overridden via the `label` prop (e.g. "(link patrocinado)").
 *
 * USAGE: Render this component immediately adjacent to each Amazon Special
 * Link. It is NOT rendered in ResultsList today because no Special Links exist
 * yet (see src/components/ResultsList.tsx). Once Special Links are added,
 * render <AffiliateDisclosure /> next to each one.
 */

interface AffiliateDisclosureProps {
  /** Short disclosure label shown in the badge. Defaults to an official
   *  Amazon Associates Brazil example ("#ComissõesPorCompra"). */
  label?: string;
}

const DEFAULT_LABEL = "#ComissõesPorCompra";

export default function AffiliateDisclosure({
  label = DEFAULT_LABEL,
}: AffiliateDisclosureProps) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: ".7rem",
        fontWeight: 600,
        color: "var(--color-text-secondary)",
        background: "var(--color-surface-alt, rgba(0,0,0,0.04))",
        border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
        borderRadius: "999px",
        padding: "2px 8px",
        marginLeft: "6px",
        lineHeight: 1.4,
        verticalAlign: "middle",
      }}
      aria-label="Link de afiliado: podemos receber comissão por compras qualificadas"
    >
      {label}
    </span>
  );
}

export { DEFAULT_LABEL };
