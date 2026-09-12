import { BRANDS } from "./catalog";
import type { BudgetRange } from "./types";

export interface ParsedNaturalLanguage {
  usage: string;
  budgetRange: BudgetRange;
  brand?: string;
  budgetDetected: boolean;
  brandDetected: boolean;
}

const BUDGET_LOW =
  /\b(at[eé]\s*r?\$?\s*4\.?000|at[eé]\s*4\s*mil|abaixo\s*de\s*4|menos\s*de\s*4|barato|econ[oô]mico)\b/i;
const BUDGET_MID =
  /\b((de\s*)?r?\$?\s*4\.?000\s*(a|at[eé]|-|–)\s*r?\$?\s*6\.?000|entre\s*4\s*(e|a)\s*6|faixa\s*m[eé]dia|intermedi[aá]ri[oa])\b/i;
const BUDGET_HIGH =
  /\b(acima\s*de\s*r?\$?\s*6\.?000|mais\s*de\s*6|acima\s*de\s*6\s*mil|premium|topo\s*de\s*linha|[789]\.?000|1[0-9]\.?000)\b/i;

/** Map chat quick-reply / free-text budget phrases to BudgetRange. */
export function parseBudgetRange(text: string): BudgetRange | null {
  const lower = text.toLowerCase();

  if (
    BUDGET_LOW.test(lower) ||
    lower.includes("até r$ 4") ||
    lower.includes("ate r$ 4") ||
    lower === "até r$ 4.000" ||
    lower.includes("ate-4000")
  ) {
    return "ate-4000";
  }

  if (
    BUDGET_MID.test(lower) ||
    lower.includes("4.000 a r$ 6") ||
    lower.includes("4000-6000") ||
    lower.includes("de r$ 4.000 a r$ 6.000")
  ) {
    return "4000-6000";
  }

  if (
    BUDGET_HIGH.test(lower) ||
    lower.includes("acima de r$ 6") ||
    lower.includes("acima-6000")
  ) {
    return "acima-6000";
  }

  return null;
}

export function parseBrand(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const brand of BRANDS) {
    if (lower.includes(brand.toLowerCase())) return brand;
  }
  if (lower.includes("macbook") || lower.includes("mac book")) return "Apple";
  return undefined;
}

/**
 * Extract usage intent, optional budget, and optional brand from plain language.
 * Budget defaults to mid-range when not mentioned so matching can still run.
 */
export function parseNaturalLanguage(query: string): ParsedNaturalLanguage {
  const trimmed = query.trim();
  const budgetRange = parseBudgetRange(trimmed) ?? "4000-6000";
  const brand = parseBrand(trimmed);

  return {
    usage: trimmed,
    budgetRange,
    brand,
    budgetDetected: parseBudgetRange(trimmed) !== null,
    brandDetected: Boolean(brand),
  };
}

/** True when the message looks like a need description rather than a short reply. */
export function looksLikeNeedDescription(message: string): boolean {
  const text = message.trim();
  if (text.length < 28) return false;

  const quickReplies = new Set([
    "quero ajuda para escolher",
    "tenho dúvidas sobre um modelo",
    "quero entender critérios técnicos",
    "sim, quero o resumo",
    "não, obrigado",
    "nao, obrigado",
  ]);
  if (quickReplies.has(text.toLowerCase())) return false;

  const lower = text.toLowerCase();
  const usageHints = [
    "jog",
    "game",
    "fortnite",
    "valorant",
    "estudo",
    "estudante",
    "trabalh",
    "program",
    "desenvolv",
    "python",
    "docker",
    "design",
    "photoshop",
    "illustrator",
    "ediç",
    "edic",
    "engenharia",
    "autocad",
    "solidworks",
    "office",
    "navegar",
    "streaming",
    "notebook",
    "orçamento",
    "orcamento",
    "orçament",
    "gamer",
  ];

  return (
    usageHints.some((hint) => lower.includes(hint)) ||
    parseBudgetRange(lower) !== null ||
    Boolean(parseBrand(lower))
  );
}
