import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <p>
          &copy; 2026 NoteMatch. Recomendações editoriais para ajudar você a
          escolher o notebook certo para o seu perfil.
        </p>
        <p style={{ fontSize: ".85rem", opacity: 0.85, marginTop: "8px" }}>
          Como associado da Amazon, podemos receber comissão por compras
          qualificadas. As recomendações são editoriais e baseadas em perfil,
          orçamento e adequação; a disponibilidade e o preço podem variar na
          loja.
        </p>
        {/* CERTAIN CONTENT disclaimer — Amazon Associates IP License §2(k).
            Required when Product Advertising Content from Amazon may be
            displayed. Official Brazilian Portuguese wording. */}
        <p
          style={{
            fontSize: ".8rem",
            opacity: 0.85,
            marginTop: "8px",
          }}
        >
          CERTO CONTEÚDO QUE APARECE NESTE SITE VEM DA AMAZON. ESTE CONTEÚDO É
          FORNECIDO &ldquo;COMO ESTÁ&rdquo; E ESTÁ SUJEITO A ALTERAÇÃO OU REMOÇÃO
          A QUALQUER MOMENTO.
        </p>
        <p style={{ fontSize: ".85rem", marginTop: "8px" }}>
          <Link
            href="/privacidade"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Política de Privacidade
          </Link>
        </p>
      </div>
    </footer>
  );
}
