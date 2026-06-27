import { describe, expect, it } from "vitest";
import {
  BRANDS,
  CATEGORY_PROFILE,
  GIFT_ACCESSORIES,
  NOTEBOOK_CATALOG,
  getNotebookProfile,
  getPrimaryCategory,
} from "@/lib/catalog";
import type { NotebookCategory } from "@/lib/types";

const ALL_CATEGORIES: NotebookCategory[] = [
  "basic",
  "student",
  "gaming",
  "design",
  "engineering",
  "programming",
];

describe("NOTEBOOK_CATALOG integrity", () => {
  it("has unique ids", () => {
    const ids = NOTEBOOK_CATALOG.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("gives every notebook at least one valid category", () => {
    for (const nb of NOTEBOOK_CATALOG) {
      expect(nb.categories.length).toBeGreaterThan(0);
      for (const cat of nb.categories) {
        expect(ALL_CATEGORIES).toContain(cat);
      }
    }
  });

  it("has positive priceValue consistent with the price label", () => {
    for (const nb of NOTEBOOK_CATALOG) {
      expect(nb.priceValue).toBeGreaterThan(0);
      // priceValue (e.g. 2499) should appear inside the label "R$ 2.499"
      const digitsInLabel = nb.price.replace(/\D/g, "");
      expect(digitsInLabel).toBe(String(nb.priceValue));
    }
  });

  it("only uses brands that the form dropdown can select", () => {
    for (const nb of NOTEBOOK_CATALOG) {
      expect(BRANDS).toContain(nb.brand);
    }
  });

  it("covers every category so a profile-based recommendation is always possible", () => {
    const covered = new Set(NOTEBOOK_CATALOG.flatMap((n) => n.categories));
    for (const cat of ALL_CATEGORIES) {
      expect(covered).toContain(cat);
    }
  });
});

describe("static option lists", () => {
  it("exposes non-empty, unique BRANDS and GIFT_ACCESSORIES", () => {
    expect(BRANDS.length).toBeGreaterThan(0);
    expect(new Set(BRANDS).size).toBe(BRANDS.length);
    expect(GIFT_ACCESSORIES.length).toBeGreaterThan(0);
    expect(new Set(GIFT_ACCESSORIES).size).toBe(GIFT_ACCESSORIES.length);
  });
});

describe("getPrimaryCategory", () => {
  it("returns the highest-priority category present (gaming over basic)", () => {
    expect(getPrimaryCategory(["basic", "gaming"])).toBe("gaming");
  });

  it("respects the full priority chain", () => {
    // priority: gaming > design > engineering > programming > student > basic
    expect(getPrimaryCategory(["student", "programming", "basic"])).toBe(
      "programming"
    );
    expect(getPrimaryCategory(["student", "basic"])).toBe("student");
    expect(getPrimaryCategory(["design", "engineering"])).toBe("design");
  });

  it("defaults to basic for an empty list", () => {
    expect(getPrimaryCategory([])).toBe("basic");
  });
});

describe("getNotebookProfile", () => {
  it("returns the profile of the notebook's primary category", () => {
    const profile = getNotebookProfile({
      ...NOTEBOOK_CATALOG[0],
      categories: ["basic", "gaming"],
    });
    expect(profile).toBe(CATEGORY_PROFILE.gaming);
    expect(profile.label).toBe("Jogos");
  });

  it("has a profile for every category", () => {
    for (const cat of ALL_CATEGORIES) {
      const profile = CATEGORY_PROFILE[cat];
      expect(profile.label).toBeTruthy();
      expect(profile.idealFor).toBeTruthy();
      expect(profile.watchOut).toBeTruthy();
    }
  });
});
