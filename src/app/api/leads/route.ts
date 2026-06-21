import { NextResponse } from "next/server";
import { isValidEmail, saveLead } from "@/lib/leads";
import type { LeadData } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<LeadData>;

    if (!body.name?.trim() || !body.email?.trim() || !body.phone?.trim()) {
      return NextResponse.json(
        { error: "Nome, e-mail e telefone são obrigatórios." },
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
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      budget: body.budget?.trim() ?? "",
      usage: body.usage?.trim() ?? "",
      accessories: body.accessories ?? [],
      stage: body.stage ?? "recommendation",
      chatHistory: body.chatHistory ?? [],
      source: body.source ?? "chat_widget",
    };

    const result = await saveLead(lead);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Erro ao salvar lead." },
      { status: 500 }
    );
  }
}
