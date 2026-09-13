import type {
  BudgetRange,
  Notebook,
  NotebookCategory,
  RecommendationRequest,
  RecommendationResponse,
} from "./types";
import { NOTEBOOK_CATALOG } from "./catalog";

/**
 * Map usage text to a notebook category only when explicit signals are present.
 * Returns null when the text is vague or unrelated (no silent "basic" fallback).
 */
export function detectCategory(usage: string): NotebookCategory | null {
  const usageLower = usage.toLowerCase();

  if (
    usageLower.includes("gamer") ||
    usageLower.includes("jog") ||
    usageLower.includes("fortnite") ||
    usageLower.includes("valorant") ||
    usageLower.includes("game")
  ) {
    return "gaming";
  }

  if (
    usageLower.includes("design") ||
    usageLower.includes("photoshop") ||
    usageLower.includes("illustrator") ||
    usageLower.includes("ediç") ||
    usageLower.includes("edic")
  ) {
    return "design";
  }

  if (
    usageLower.includes("engenharia") ||
    usageLower.includes("autocad") ||
    usageLower.includes("simulação") ||
    usageLower.includes("simulacao") ||
    usageLower.includes("solidworks")
  ) {
    return "engineering";
  }

  if (
    usageLower.includes("programador") ||
    usageLower.includes("desenvolvedor") ||
    usageLower.includes("programaç") ||
    usageLower.includes("programac") ||
    usageLower.includes("python") ||
    usageLower.includes("docker") ||
    usageLower.includes("código") ||
    usageLower.includes("codigo") ||
    usageLower.includes("coding") ||
    usageLower.includes("developer")
  ) {
    return "programming";
  }

  if (
    usageLower.includes("estudante") ||
    usageLower.includes("student") ||
    usageLower.includes("estudo") ||
    usageLower.includes("estudar") ||
    usageLower.includes("faculdade") ||
    usageLower.includes("escola")
  ) {
    return "student";
  }

  // "basic" only with explicit everyday-use cues — never as a silent default.
  if (
    usageLower.includes("navegar") ||
    usageLower.includes("internet") ||
    usageLower.includes("office") ||
    usageLower.includes("streaming") ||
    usageLower.includes("youtube") ||
    usageLower.includes("netflix") ||
    usageLower.includes("uso básico") ||
    usageLower.includes("uso basico") ||
    usageLower.includes("dia a dia") ||
    usageLower.includes("dia-a-dia") ||
    usageLower.includes("cotidiano") ||
    usageLower.includes("trabalho leve") ||
    usageLower.includes("planilha") ||
    usageLower.includes("redes sociais") ||
    usageLower.includes("e-mail") ||
    usageLower.includes("email") ||
    usageLower.includes("escritório") ||
    usageLower.includes("escritorio") ||
    usageLower.includes("trabalh")
  ) {
    return "basic";
  }

  return null;
}

/** True when usage text maps to a concrete recommender category. */
export function hasClearUsageIntent(usage: string): boolean {
  return detectCategory(usage) !== null;
}

export function inferCategory(usage: string): NotebookCategory {
  return detectCategory(usage) ?? "basic";
}

export function matchBudget(
  priceValue: number,
  budgetRange: BudgetRange
): boolean {
  if (budgetRange === "ate-4000") return priceValue <= 4000;
  if (budgetRange === "4000-6000")
    return priceValue >= 4000 && priceValue <= 6000;
  return priceValue > 6000;
}

export function formatBudgetLabel(budgetRange: BudgetRange): string {
  if (budgetRange === "ate-4000") return "até R$ 4.000";
  if (budgetRange === "4000-6000") return "de R$ 4.000 a R$ 6.000";
  return "acima de R$ 6.000";
}

export function generateRecommendations(
  request: RecommendationRequest,
  catalog: Notebook[] = NOTEBOOK_CATALOG
): RecommendationResponse {
  const { usage, brand, budgetRange } = request;
  const category = inferCategory(usage);

  let filtered = catalog.filter(
    (item) =>
      item.categories.includes(category) &&
      matchBudget(item.priceValue, budgetRange)
  );

  if (brand) {
    const brandFiltered = filtered.filter((item) => item.brand === brand);
    if (brandFiltered.length > 0) filtered = brandFiltered;
  }

  if (filtered.length === 0) {
    filtered = catalog.filter((item) =>
      matchBudget(item.priceValue, budgetRange)
    );
    if (brand) {
      const brandFallback = filtered.filter((item) => item.brand === brand);
      if (brandFallback.length > 0) filtered = brandFallback;
    }
  }

  return {
    recommendations: filtered.slice(0, 3),
    category,
    budgetLabel: formatBudgetLabel(budgetRange),
  };
}
