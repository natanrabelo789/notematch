import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | NoteMatch",
  description:
    "Como o NoteMatch coleta, usa e protege seus dados pessoais, em conformidade com a LGPD (Lei nº 13.709/2018).",
};

/**
 * Static privacy policy page (server component, no "use client").
 *
 * Covers: data collected, storage, third-party sharing (Amazon Associates,
 * Supabase), cookies, LGPD user rights, contact, and effective date.
 * Required by Amazon Associates Participation Requirements §3(e) and LGPD.
 */

const EFFECTIVE_DATE = "13 de setembro de 2026";
const CONTACT_EMAIL = "contato@notematch.example";

export default function PrivacidadePage() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <h1>Política de Privacidade</h1>

          {/* Plain-language summary at the top */}
          <p
            style={{
              fontSize: "1.05rem",
              color: "var(--color-text-secondary)",
              maxWidth: "70ch",
              margin: "0 0 var(--space-32)",
            }}
          >
            <strong>Resumo:</strong> o NoteMatch coleta apenas os dados que você
            nos fornece voluntariamente no chat (nome, e-mail, telefone, orçamento,
            uso pretendido e acessórios desejados), além do histórico da conversa.
            Usamos esses dados para enviar o resumo da recomendação e melhorar
            nossas sugestões. Seus dados são armazenados na Supabase e nunca são
            vendidos. Você pode solicitar acesso, correção ou exclusão a
            qualquer momento escrevendo para{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>

          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "12px",
              padding: "var(--space-32)",
              color: "var(--color-text)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>1. Dados que coletamos</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Coletamos os seguintes dados pessoais por meio do chat (ChatWidget),
              somente quando você opta por fornecê-los:
            </p>
            <ul style={{ color: "var(--color-text-secondary)" }}>
              <li>Nome (opcional);</li>
              <li>E-mail (necessário para enviar o resumo da recomendação);</li>
              <li>Telefone ou WhatsApp (opcional);</li>
              <li>Faixa de orçamento informada;</li>
              <li>Uso pretendido do notebook (ex.: estudos, jogos, programação);</li>
              <li>Acessórios de interesse;</li>
              <li>Histórico completo da conversa com o assistente.</li>
            </ul>

            <h2>2. Como usamos seus dados</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Usamos seus dados para: (a) gerar e enviar o resumo da recomendação
              de notebooks por e-mail; (b) aprimorar a qualidade das recomendações
              e do atendimento; e (c) responder a solicitações de contato. Não
              usamos seus dados para finalidades não relacionadas ao serviço.
            </p>

            <h2>3. Compartilhamento com terceiros</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Seus dados são processados por estes terceiros:
            </p>
            <ul style={{ color: "var(--color-text-secondary)" }}>
              <li>
                <strong>Supabase</strong>: provedor de infraestrutura que armazena
                os leads em um banco de dados gerenciado, atuando como
                processador de dados.
              </li>
              <li>
                <strong>Amazon Associates (programa de afiliados)</strong>: quando
                você acessa a Amazon por meio dos nossos links, a Amazon pode
                definir cookies em seu navegador para rastreamento de
                compras qualificadas. A Amazon é uma controladora independente dos
                dados coletados por esses cookies, regida por sua própria política
                de privacidade.
              </li>
            </ul>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Não vendemos nem cedemos seus dados a outros terceiros.
            </p>

            <h2>4. Cookies e armazenamento local</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              O site utiliza armazenamento local (localStorage) e/ou cookies para
              manter o estado do chat e a continuidade da conversa durante a sua
              visita. Quando você interage com links do programa Amazon
              Associates, a Amazon também pode definir cookies de
              rastreamento. Você pode limpar ou bloquear cookies nas
              configurações do seu navegador; isso pode afetar algumas
              funcionalidades do chat.
            </p>

            <h2>5. Base legal e seus direitos (LGPD)</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Tratamos seus dados com base no consentimento que você fornece ao
              compartilhar suas informações no chat (art. 7º, I, da Lei nº
              13.709/2018 — LGPD). Como titular dos dados, você tem direito a:
            </p>
            <ul style={{ color: "var(--color-text-secondary)" }}>
              <li>Confirmação da existência de tratamento e acesso aos dados;</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
              <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
              <li>Eliminação dos dados pessoais que forem tratados com consentimento;</li>
              <li>Revogação do consentimento a qualquer momento.</li>
            </ul>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Para exercer qualquer um desses direitos, escreva para{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>

            <h2>6. Segurança e retenção</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Adotamos medidas técnicas e organizacionais razoáveis para proteger
              seus dados contra acesso não autorizado, perda ou alteração.
              Mantemos seus dados pelo tempo necessário para cumprir as
              finalidades descritas nesta política, salvo obrigações legais de
              retenção ou até que você solicite a exclusão.
            </p>

            <h2>7. Contato</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Para dúvidas, solicitações de acesso, correção ou exclusão de dados,
              entre em contato pelo e-mail{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Este
              endereço é um placeholder e deve ser configurado para o e-mail
              oficial de tratamento de dados do NoteMatch antes da publicação.
            </p>

            <h2>8. Alterações desta política</h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Podemos atualizar esta Política de Privacidade periodicamente.
              A data de vigência abaixo indica quando a versão atual entrou em
              vigor.
            </p>

            <p
              style={{
                color: "var(--color-text-secondary)",
                marginTop: "var(--space-32)",
                fontSize: ".85rem",
              }}
            >
              <strong>Data de vigência:</strong> {EFFECTIVE_DATE}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
