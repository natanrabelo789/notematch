import { NextResponse } from "next/server";
import { checkLeadStorage, isValidEmail, saveLead } from "@/lib/leads";
import type { LeadData } from "@/lib/types";

export async function GET() {
  const status = await checkLeadStorage();
  return NextResponse.json(status);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LeadData>;

    if (!body.email?.trim()) {
      return NextResponse.json(
        { error: "O e-mail é obrigatório para enviar o resumo." },
        { status: 400 }
      );
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    const lead: LeadData = {
      name: body.name?.trim() ?? "",
      email: body.email.trim(),
      phone: body.phone?.trim() ?? "",
      budget: body.budget?.trim() ?? "",
      usage: body.usage?.trim() ?? "",
      accessories: body.accessories ?? [],
      stage: body.stage ?? "done",
      chatHistory: body.chatHistory ?? [],
      source: body.source ?? "chat_widget",
    };

    const result = await saveLead(lead);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[NoteMatch] /api/leads failed:", error);
    return NextResponse.json(
      { error: "Erro ao salvar lead." },
      { status: 500 }
    );
  }
}
