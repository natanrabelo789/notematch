import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/recommendations/route";
import { NOTEBOOK_CATALOG } from "@/lib/catalog";

vi.mock("@/lib/notebooks", () => ({
  fetchNotebookCatalog: vi.fn(async () => ({
    catalog: NOTEBOOK_CATALOG,
    source: "fallback" as const,
  })),
}));

function makeRequest(body: unknown, { raw = false } = {}) {
  return new Request("http://localhost/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/recommendations", () => {
  it("rejects a missing/blank usage with 400", async () => {
    const res = await POST(makeRequest({ usage: "  ", budgetRange: "ate-4000" }));
    expect(res.status).toBe(400);
    await expect(res.json()).resolves.toMatchObject({ error: expect.any(String) });
  });

  it("rejects an invalid budgetRange with 400", async () => {
    const res = await POST(
      makeRequest({ usage: "jogos", budgetRange: "invalid" })
    );
    expect(res.status).toBe(400);
  });

  it("rejects a missing budgetRange with 400 when no query is provided", async () => {
    const res = await POST(makeRequest({ usage: "jogos" }));
    expect(res.status).toBe(400);
  });

  it("returns recommendations for a valid request", async () => {
    const res = await POST(
      makeRequest({ usage: "jogos", budgetRange: "4000-6000" })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.category).toBe("gaming");
    expect(data.budgetLabel).toBe("de R$ 4.000 a R$ 6.000");
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
    expect(data.catalogSource).toBe("fallback");
  });

  it("accepts a natural-language query and returns matching options", async () => {
    const res = await POST(
      makeRequest({
        query: "Preciso de um notebook gamer Lenovo de R$ 4.000 a R$ 6.000",
      })
    );

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.category).toBe("gaming");
    expect(data.budgetLabel).toBe("de R$ 4.000 a R$ 6.000");
    expect(data.brandDetected).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
    expect(
      data.recommendations.every((n: { brand: string }) => n.brand === "Lenovo")
    ).toBe(true);
  });

  it("rejects a vague free-text query without recommending notebooks", async () => {
    const res = await POST(
      makeRequest({ query: "i want to do a barbecue" })
    );

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.unclear).toBe(true);
    expect(data.recommendations).toEqual([]);
    expect(data.error).toMatch(/reformular|não entendi|nao entendi/i);
  });

  it("rejects brand/budget-only queries that lack usage criteria", async () => {
    const res = await POST(
      makeRequest({ query: "Quero um Lenovo até R$ 4.000 por favor" })
    );

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.unclear).toBe(true);
    expect(data.recommendations).toEqual([]);
  });

  it("rejects nonsense usage text with 422 instead of recommending", async () => {
    const res = await POST(
      makeRequest({ usage: "i want to do a barbecue", budgetRange: "4000-6000" })
    );

    expect(res.status).toBe(422);
    const data = await res.json();
    expect(data.unclear).toBe(true);
    expect(data.recommendations).toEqual([]);
  });

  it("returns 500 when the body is not valid JSON", async () => {
    const res = await POST(makeRequest("{ not json", { raw: true }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ error: expect.any(String) });
  });
});
