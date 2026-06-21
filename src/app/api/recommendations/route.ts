import { NextResponse } from "next/server";
import { generateRecommendations } from "@/lib/recommendations";
import type { BudgetRange, RecommendationRequest } from "@/lib/types";

const VALID_BUDGETS: BudgetRange[] = [
  "ate-4000",
  "4000-6000",
  "acima-6000",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RecommendationRequest>;

    if (!body.usage?.trim()) {
      return NextResponse.json(
        { error: "O campo de uso é obrigatório." },
        { status: 400 }
      );
    }

    if (
      !body.budgetRange ||
      !VALID_BUDGETS.includes(body.budgetRange)
    ) {
      return NextResponse.json(
        { error: "Faixa de orçamento inválida." },
        { status: 400 }
      );
    }

    // Simulate network/AI latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = generateRecommendations({
      usage: body.usage.trim(),
      brand: body.brand?.trim() || undefined,
      budgetRange: body.budgetRange,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar recomendações." },
      { status: 500 }
    );
  }
}
