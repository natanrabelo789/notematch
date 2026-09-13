import { describe, expect, it } from "vitest";
import {
  formatBudgetLabel,
  generateRecommendations,
  hasClearUsageIntent,
  inferCategory,
  matchBudget,
} from "@/lib/recommendations";
import type { Notebook } from "@/lib/types";

/**
 * Small, deterministic catalog used to assert filtering/fallback logic
 * without coupling to the real catalog contents.
 */
const CATALOG: Notebook[] = [
  makeNotebook({ id: "cheap-basic", brand: "Acer", priceValue: 3000, categories: ["basic", "student"] }),
  makeNotebook({ id: "mid-prog", brand: "Asus", priceValue: 5000, categories: ["programming"] }),
  makeNotebook({ id: "mid-gaming-lenovo", brand: "Lenovo", priceValue: 5500, categories: ["gaming"] }),
  makeNotebook({ id: "mid-gaming-asus", brand: "Asus", priceValue: 5900, categories: ["gaming"] }),
  makeNotebook({ id: "high-gaming", brand: "Alienware", priceValue: 12000, categories: ["gaming"] }),
  makeNotebook({ id: "high-design", brand: "Apple", priceValue: 15000, categories: ["design"] }),
];

function makeNotebook(overrides: Partial<Notebook>): Notebook {
  return {
    id: "id",
    name: "Notebook",
    brand: "Brand",
    price: "R$ 0",
    priceValue: 0,
    processor: "CPU",
    ram: "RAM",
    storage: "SSD",
    gpu: "GPU",
    screen: "Screen",
    description: "desc",
    reason: "reason",
    categories: ["basic"],
    ...overrides,
  };
}

describe("inferCategory", () => {
  it.each([
    ["sou gamer e jogo todo dia", "gaming"],
    ["quero jogar jogos pesados", "gaming"], // "jogos" contains "jog"
    ["fortnite e valorant", "gaming"],
    ["trabalho com design e photoshop", "design"],
    ["faço edição de vídeo", "design"], // "edição" contains "edi"
    ["uso illustrator", "design"],
    ["estudante de engenharia com autocad", "engineering"],
    ["preciso rodar solidworks e simulação", "engineering"],
    ["sou programador e uso python", "programming"],
    ["desenvolvedor que usa docker", "programming"],
    ["sou estudante", "student"],
    ["i am a student", "student"],
    ["só navegar na internet e assistir vídeo", "basic"],
  ])("classifies %j as %s", (usage, expected) => {
    expect(inferCategory(usage)).toBe(expected);
  });

  it("is case-insensitive", () => {
    expect(inferCategory("FORTNITE")).toBe("gaming");
    expect(inferCategory("PYTHON")).toBe("programming");
  });

  it("honors priority order when keywords collide (gaming wins over design)", () => {
    // contains both "jog" (gaming) and "design" — gaming is checked first
    expect(inferCategory("design de jogos")).toBe("gaming");
  });

  it("falls back to basic for unrelated text via inferCategory", () => {
    expect(inferCategory("")).toBe("basic");
    expect(inferCategory("comprar um notebook qualquer")).toBe("basic");
  });
});

describe("hasClearUsageIntent", () => {
  it("is true for concrete notebook usage cues", () => {
    expect(hasClearUsageIntent("quero jogar Fortnite")).toBe(true);
    expect(hasClearUsageIntent("programação com docker")).toBe(true);
    expect(hasClearUsageIntent("estudante de medicina")).toBe(true);
    expect(hasClearUsageIntent("navegar na internet e office")).toBe(true);
    expect(hasClearUsageIntent("Trabalho/Estudos")).toBe(true);
    expect(hasClearUsageIntent("Design/Edição")).toBe(true);
  });

  it("is false for vague or unrelated text", () => {
    expect(hasClearUsageIntent("i want to do a barbecue")).toBe(false);
    expect(hasClearUsageIntent("Quero um Lenovo até R$ 4.000")).toBe(false);
    expect(hasClearUsageIntent("olá tudo bem")).toBe(false);
    expect(hasClearUsageIntent("")).toBe(false);
  });
});

describe("matchBudget", () => {
  it("ate-4000 is inclusive of 4000", () => {
    expect(matchBudget(3999, "ate-4000")).toBe(true);
    expect(matchBudget(4000, "ate-4000")).toBe(true);
    expect(matchBudget(4001, "ate-4000")).toBe(false);
  });

  it("4000-6000 is inclusive on both ends", () => {
    expect(matchBudget(3999, "4000-6000")).toBe(false);
    expect(matchBudget(4000, "4000-6000")).toBe(true);
    expect(matchBudget(6000, "4000-6000")).toBe(true);
    expect(matchBudget(6001, "4000-6000")).toBe(false);
  });

  it("acima-6000 excludes 6000", () => {
    expect(matchBudget(6000, "acima-6000")).toBe(false);
    expect(matchBudget(6001, "acima-6000")).toBe(true);
  });
});

describe("formatBudgetLabel", () => {
  it("maps each range to a human label", () => {
    expect(formatBudgetLabel("ate-4000")).toBe("até R$ 4.000");
    expect(formatBudgetLabel("4000-6000")).toBe("de R$ 4.000 a R$ 6.000");
    expect(formatBudgetLabel("acima-6000")).toBe("acima de R$ 6.000");
  });
});

describe("generateRecommendations", () => {
  it("returns category, budgetLabel and at most 3 recommendations", () => {
    const result = generateRecommendations(
      { usage: "jogos", budgetRange: "4000-6000" },
      CATALOG
    );
    expect(result.category).toBe("gaming");
    expect(result.budgetLabel).toBe("de R$ 4.000 a R$ 6.000");
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });

  it("filters by both category and budget range", () => {
    const result = generateRecommendations(
      { usage: "jogos", budgetRange: "4000-6000" },
      CATALOG
    );
    const ids = result.recommendations.map((n) => n.id);
    expect(ids).toEqual(["mid-gaming-lenovo", "mid-gaming-asus"]);
  });

  it("narrows to the preferred brand when matches exist", () => {
    const result = generateRecommendations(
      { usage: "jogos", brand: "Asus", budgetRange: "4000-6000" },
      CATALOG
    );
    expect(result.recommendations.map((n) => n.id)).toEqual(["mid-gaming-asus"]);
  });

  it("ignores the brand filter when no in-category item matches that brand", () => {
    // No Apple gaming laptop in 4000-6000 -> keep the category results
    const result = generateRecommendations(
      { usage: "jogos", brand: "Apple", budgetRange: "4000-6000" },
      CATALOG
    );
    expect(result.recommendations.map((n) => n.id)).toEqual([
      "mid-gaming-lenovo",
      "mid-gaming-asus",
    ]);
  });

  it("falls back to budget-only matches when the category has nothing in range", () => {
    // No gaming laptop under 4000 -> fall back to any laptop under 4000
    const result = generateRecommendations(
      { usage: "jogos", budgetRange: "ate-4000" },
      CATALOG
    );
    expect(result.category).toBe("gaming");
    expect(result.recommendations.map((n) => n.id)).toEqual(["cheap-basic"]);
  });

  it("applies the brand preference within the budget-only fallback", () => {
    // No design laptop in 4000-6000; fallback to budget-only, then prefer Asus
    const result = generateRecommendations(
      { usage: "design", brand: "Asus", budgetRange: "4000-6000" },
      CATALOG
    );
    expect(result.recommendations.every((n) => n.brand === "Asus")).toBe(true);
    expect(result.recommendations.map((n) => n.id)).toEqual([
      "mid-prog",
      "mid-gaming-asus",
    ]);
  });

  it("returns an empty list when nothing matches the budget at all", () => {
    const emptyResult = generateRecommendations(
      { usage: "jogos", budgetRange: "acima-6000" },
      [makeNotebook({ id: "only-cheap", priceValue: 1000, categories: ["basic"] })]
    );
    expect(emptyResult.recommendations).toEqual([]);
  });

  it("caps results at 3 even when more match", () => {
    const many = Array.from({ length: 6 }, (_, i) =>
      makeNotebook({ id: `g-${i}`, priceValue: 5000, categories: ["gaming"] })
    );
    const result = generateRecommendations(
      { usage: "jogos", budgetRange: "4000-6000" },
      many
    );
    expect(result.recommendations).toHaveLength(3);
  });

  it("trims usage/brand handling via the request object (uses default catalog)", () => {
    // Smoke test against the real catalog to ensure the default arg works.
    const result = generateRecommendations({
      usage: "desenvolvedor python docker",
      budgetRange: "acima-6000",
    });
    expect(result.category).toBe("programming");
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeLessThanOrEqual(3);
  });
});
