import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NOTEBOOK_CATALOG } from "@/lib/catalog";

const mocks = vi.hoisted(() => {
  const ctx = {
    error: null as null | { message: string },
    data: null as null | Record<string, unknown>[],
  };
  const order = vi.fn(async () => ({ data: ctx.data, error: ctx.error }));
  const select = vi.fn(() => ({ order }));
  const from = vi.fn(() => ({ select }));
  const createClient = vi.fn(() => ({ from }));
  return { ctx, order, select, from, createClient };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient,
}));

const ORIGINAL_ENV = { ...process.env };

async function importNotebooks() {
  vi.resetModules();
  return import("@/lib/notebooks");
}

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  mocks.ctx.error = null;
  mocks.ctx.data = null;
  mocks.createClient.mockClear();
  mocks.from.mockClear();
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

describe("fetchNotebookCatalog", () => {
  it("falls back to the local catalog when Supabase is not configured", async () => {
    const { fetchNotebookCatalog } = await importNotebooks();
    const result = await fetchNotebookCatalog();
    expect(result.source).toBe("fallback");
    expect(result.catalog).toEqual(NOTEBOOK_CATALOG);
    expect(mocks.createClient).not.toHaveBeenCalled();
  });

  it("maps Supabase rows into Notebook objects", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    mocks.ctx.data = [
      {
        id: "acer-aspire-go-15",
        name: "Acer Aspire Go 15",
        brand: "Acer",
        price: "R$ 2.499",
        price_value: 2499,
        processor: "Intel Core i5-13420H",
        ram: "16GB DDR4",
        storage: "512GB SSD",
        gpu: "Intel UHD Graphics",
        screen: '15.6" Full HD',
        description: "Custo-benefício",
        reason: "Bom para estudos",
        categories: ["basic", "student"],
      },
    ];

    const { fetchNotebookCatalog } = await importNotebooks();
    const result = await fetchNotebookCatalog();

    expect(result.source).toBe("supabase");
    expect(mocks.from).toHaveBeenCalledWith("notebooks");
    expect(result.catalog).toHaveLength(1);
    expect(result.catalog[0]).toMatchObject({
      id: "acer-aspire-go-15",
      priceValue: 2499,
      categories: ["basic", "student"],
    });
  });

  it("falls back when Supabase returns an error", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    mocks.ctx.error = { message: "relation missing" };
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { fetchNotebookCatalog } = await importNotebooks();
    const result = await fetchNotebookCatalog();

    expect(result.source).toBe("fallback");
    expect(result.catalog).toEqual(NOTEBOOK_CATALOG);
    errorSpy.mockRestore();
  });
});
