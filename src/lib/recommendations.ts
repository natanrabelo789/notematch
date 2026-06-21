import type {
  BudgetRange,
  Notebook,
  NotebookCategory,
  RecommendationRequest,
  RecommendationResponse,
} from "./types";
import { NOTEBOOK_CATALOG } from "./catalog";

export function inferCategory(usage: string): NotebookCategory {
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
    usageLower.includes("edi")
  ) {
    return "design";
  }

  if (
    usageLower.includes("engenharia") ||
    usageLower.includes("autocad") ||
    usageLower.includes("simulação") ||
    usageLower.includes("solidworks")
  ) {
    return "engineering";
  }

  if (
    usageLower.includes("programador") ||
    usageLower.includes("desenvolvedor") ||
    usageLower.includes("python") ||
    usageLower.includes("docker")
  ) {
    return "programming";
  }

  if (usageLower.includes("estudante") || usageLower.includes("student")) {
    return "student";
  }

  return "basic";
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
