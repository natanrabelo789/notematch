import ChatWidget from "@/components/ChatWidget";
import FinderSection from "@/components/FinderSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="inicio">
        <section className="hero">
          <div className="container">
            <h1>Descubra qual notebook combina com o seu perfil</h1>
            <p>
              Responda algumas perguntas e receba recomendações explicadas com
              base no seu uso, orçamento e prioridades. Traduzimos o seu uso em
              critérios técnicos e mostramos modelos compatíveis.
            </p>
            <FinderSection />
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
