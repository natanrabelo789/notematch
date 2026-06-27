import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Shared, mutable mock state for the Supabase client. Created via vi.hoisted so
// it is available inside the (hoisted) vi.mock factory below.
const mocks = vi.hoisted(() => {
  const ctx = {
    insertError: null as null | { message: string },
    selectError: null as null | { message: string },
  };
  const insert = vi.fn(async (_payload: Record<string, unknown>) => ({
    error: ctx.insertError,
  }));
  const select = vi.fn(async () => ({ error: ctx.selectError }));
  const from = vi.fn(() => ({ insert, select }));
  const createClient = vi.fn(() => ({ from }));
  return { ctx, insert, select, from, createClient };
});

vi.mock("@supabase/supabase-js", () => ({
  createClient: mocks.createClient,
}));

const ORIGINAL_ENV = { ...process.env };

/** Re-import the module fresh so its internal Supabase client cache is reset. */
async function importLeads() {
  vi.resetModules();
  return import("@/lib/leads");
}

function configureSupabaseEnv() {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
}

beforeEach(() => {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  mocks.ctx.insertError = null;
  mocks.ctx.selectError = null;
});

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
});

const SAMPLE_LEAD = {
  name: "Ana",
  email: "ana@example.com",
  phone: "11999999999",
  budget: "Até R$ 4.000",
  usage: "estudos",
  accessories: ["Mouse"],
  stage: "done" as const,
  chatHistory: [],
  source: "chat_widget",
};

describe("isValidEmail", () => {
  it.each([
    ["ana@example.com", true],
    ["a.b-c@sub.domain.io", true],
    ["plainaddress", false],
    ["no@dot", false],
    ["@no-local.com", false],
    ["spaces in@email.com", false],
    ["", false],
  ])("validates %j as %s", async (email, expected) => {
    const { isValidEmail } = await importLeads();
    expect(isValidEmail(email)).toBe(expected);
  });
});

describe("saveLead", () => {
  it("logs to console (does not call Supabase) when env is missing", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { saveLead } = await importLeads();

    const result = await saveLead(SAMPLE_LEAD);

    expect(result).toEqual({ saved: true, mode: "console" });
    expect(mocks.createClient).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("persists to Supabase and maps fields to snake_case when configured", async () => {
    configureSupabaseEnv();
    const { saveLead } = await importLeads();

    const result = await saveLead(SAMPLE_LEAD);

    expect(result).toEqual({ saved: true, mode: "supabase" });
    expect(mocks.from).toHaveBeenCalledWith("leads");
    expect(mocks.insert).toHaveBeenCalledTimes(1);
    const payload = mocks.insert.mock.calls[0][0];
    expect(payload).toMatchObject({
      name: "Ana",
      email: "ana@example.com",
      chat_history: [],
      source: "chat_widget",
    });
    expect(typeof payload.created_at).toBe("string");
  });

  it("throws when the Supabase insert returns an error", async () => {
    configureSupabaseEnv();
    mocks.ctx.insertError = { message: "insert failed" };
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const { saveLead } = await importLeads();

    await expect(saveLead(SAMPLE_LEAD)).rejects.toThrow("insert failed");
    errorSpy.mockRestore();
  });
});

describe("checkLeadStorage", () => {
  it("reports not configured when both env vars are missing", async () => {
    const { checkLeadStorage } = await importLeads();
    const status = await checkLeadStorage();
    expect(status).toEqual({
      configured: false,
      urlPresent: false,
      serviceKeyPresent: false,
      canConnect: false,
    });
  });

  it("reports partial config when only the URL is present", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    const { checkLeadStorage } = await importLeads();
    const status = await checkLeadStorage();
    expect(status.configured).toBe(false);
    expect(status.urlPresent).toBe(true);
    expect(status.serviceKeyPresent).toBe(false);
  });

  it("reports canConnect true when configured and the query succeeds", async () => {
    configureSupabaseEnv();
    const { checkLeadStorage } = await importLeads();
    const status = await checkLeadStorage();
    expect(status).toMatchObject({ configured: true, canConnect: true });
    expect(status.error).toBeUndefined();
  });

  it("reports canConnect false with the error message when the query fails", async () => {
    configureSupabaseEnv();
    mocks.ctx.selectError = { message: "permission denied" };
    const { checkLeadStorage } = await importLeads();
    const status = await checkLeadStorage();
    expect(status.canConnect).toBe(false);
    expect(status.error).toBe("permission denied");
  });
});
