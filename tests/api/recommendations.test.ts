import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/recommendations/route";

function makeRequest(body: unknown, { raw = false } = {}) {
  return new Request("http://localhost/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

afterEach(() => {
  vi.useRealTimers();
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

  it("rejects a missing budgetRange with 400", async () => {
    const res = await POST(makeRequest({ usage: "jogos" }));
    expect(res.status).toBe(400);
  });

  it("returns recommendations for a valid request", async () => {
    vi.useFakeTimers();
    const promise = POST(
      makeRequest({ usage: "jogos", budgetRange: "4000-6000" })
    );
    // The route simulates ~800ms of latency before responding.
    await vi.advanceTimersByTimeAsync(800);
    const res = await promise;

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.category).toBe("gaming");
    expect(data.budgetLabel).toBe("de R$ 4.000 a R$ 6.000");
    expect(Array.isArray(data.recommendations)).toBe(true);
    expect(data.recommendations.length).toBeGreaterThan(0);
  });

  it("returns 500 when the body is not valid JSON", async () => {
    const res = await POST(makeRequest("{ not json", { raw: true }));
    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ error: expect.any(String) });
  });
});
