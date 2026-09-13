import { describe, expect, it } from "vitest";
import {
  looksLikeNeedDescription,
  parseBrand,
  parseBudgetRange,
  parseNaturalLanguage,
} from "@/lib/nl";

describe("parseBudgetRange", () => {
  it("detects low, mid and high ranges", () => {
    expect(parseBudgetRange("Até R$ 4.000")).toBe("ate-4000");
    expect(parseBudgetRange("quero algo barato")).toBe("ate-4000");
    expect(parseBudgetRange("De R$ 4.000 a R$ 6.000")).toBe("4000-6000");
    expect(parseBudgetRange("faixa intermediária")).toBe("4000-6000");
    expect(parseBudgetRange("Acima de R$ 6.000")).toBe("acima-6000");
    expect(parseBudgetRange("notebook premium")).toBe("acima-6000");
  });

  it("returns null when no budget cue is present", () => {
    expect(parseBudgetRange("quero jogar fortnite")).toBeNull();
  });
});

describe("parseBrand", () => {
  it("detects known brands and MacBook as Apple", () => {
    expect(parseBrand("prefiro Lenovo")).toBe("Lenovo");
    expect(parseBrand("quero um MacBook")).toBe("Apple");
  });
});

describe("parseNaturalLanguage", () => {
  it("extracts usage, budget and brand from a single sentence", () => {
    const parsed = parseNaturalLanguage(
      "Preciso de um notebook gamer Lenovo até R$ 4.000"
    );
    expect(parsed.budgetRange).toBe("ate-4000");
    expect(parsed.brand).toBe("Lenovo");
    expect(parsed.budgetDetected).toBe(true);
    expect(parsed.brandDetected).toBe(true);
    expect(parsed.intentClear).toBe(true);
    expect(parsed.usage.toLowerCase()).toContain("gamer");
  });

  it("defaults budget to mid-range when omitted", () => {
    const parsed = parseNaturalLanguage("notebook para programação com docker");
    expect(parsed.budgetRange).toBe("4000-6000");
    expect(parsed.budgetDetected).toBe(false);
    expect(parsed.intentClear).toBe(true);
  });

  it("marks vague or unrelated text as unclear intent", () => {
    const parsed = parseNaturalLanguage("i want to do a barbecue");
    expect(parsed.intentClear).toBe(false);
  });
});

describe("looksLikeNeedDescription", () => {
  it("rejects short replies and guided quick replies", () => {
    expect(looksLikeNeedDescription("Sim")).toBe(false);
    expect(looksLikeNeedDescription("Quero ajuda")).toBe(false);
    expect(looksLikeNeedDescription("Quero ajuda para escolher")).toBe(false);
  });

  it("rejects nonsense even when the message is long", () => {
    expect(looksLikeNeedDescription("i want to do a barbecue with friends")).toBe(
      false
    );
    expect(
      looksLikeNeedDescription("Quero um Lenovo até R$ 4.000 por favor agora")
    ).toBe(false);
  });

  it("accepts longer need descriptions with clear usage", () => {
    expect(
      looksLikeNeedDescription(
        "Preciso de um notebook para estudar engenharia com AutoCAD"
      )
    ).toBe(true);
  });
});
