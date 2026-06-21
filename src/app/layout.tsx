import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteMatch - Encontre o Notebook Perfeito",
  description:
    "Responda algumas perguntas e deixe nossa IA encontrar o notebook ideal para suas necessidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
