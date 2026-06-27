import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteMatch - Descubra qual notebook combina com o seu perfil",
  description:
    "Guia editorial que traduz o seu uso em critérios técnicos e mostra modelos compatíveis com base em perfil, orçamento e prioridades.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
