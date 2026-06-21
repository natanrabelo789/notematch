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
            <h1>Encontre o Notebook Perfeito</h1>
            <p>
              Responda algumas perguntas e deixe nossa IA encontrar o notebook
              ideal para suas necessidades
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
