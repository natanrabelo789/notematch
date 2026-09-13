import { NextResponse } from "next/server";
import { fetchNotebookCatalog } from "@/lib/notebooks";
import { parseNaturalLanguage, UNCLEAR_INTENT_MESSAGE } from "@/lib/nl";
import {
  formatBudgetLabel,
  generateRecommendations,
  hasClearUsageIntent,
} from "@/lib/recommendations";
import type { BudgetRange, RecommendationRequest } from "@/lib/types";

const VALID_BUDGETS: BudgetRange[] = [
  "ate-4000",
  "4000-6000",
  "acima-6000",
];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<RecommendationRequest>;
    const queryText = body.query?.trim() || "";
    const queryDriven = queryText.length > 0;

    const parsed = queryDriven ? parseNaturalLanguage(queryText) : null;

    const usage = (body.usage?.trim() || parsed?.usage || "").trim();
    const budgetRange =
      (body.budgetRange && VALID_BUDGETS.includes(body.budgetRange)
        ? body.budgetRange
        : null) ??
      parsed?.budgetRange ??
      null;
    const brand = body.brand?.trim() || parsed?.brand || undefined;

    if (!usage) {
      return NextResponse.json(
        {
          error:
            "Descreva o que você precisa (uso) ou envie um campo usage.",
        },
        { status: 400 }
      );
    }

    // Free-text query path: only recommend when usage maps to a real category.
    if (queryDriven && !hasClearUsageIntent(usage)) {
      return NextResponse.json(
        {
          error: UNCLEAR_INTENT_MESSAGE,
          unclear: true,
          recommendations: [],
        },
        { status: 422 }
      );
    }

    if (!budgetRange || !VALID_BUDGETS.includes(budgetRange)) {
      return NextResponse.json(
        { error: "Faixa de orçamento inválida ou ausente." },
        { status: 400 }
      );
    }

    const { catalog, source } = await fetchNotebookCatalog();

    const result = generateRecommendations(
      {
        usage,
        brand,
        budgetRange,
      },
      catalog
    );

    const interpretationParts = [
      `Perfil: ${result.category}`,
      `orçamento ${formatBudgetLabel(budgetRange)}${
        parsed && !parsed.budgetDetected ? " (assumido)" : ""
      }`,
    ];
    if (brand) interpretationParts.push(`marca ${brand}`);

    return NextResponse.json({
      ...result,
      catalogSource: source,
      budgetDetected: parsed?.budgetDetected ?? Boolean(body.budgetRange),
      brandDetected: parsed?.brandDetected ?? Boolean(body.brand?.trim()),
      interpretation: interpretationParts.join(" · "),
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao gerar recomendações." },
      { status: 500 }
    );
  }
}
