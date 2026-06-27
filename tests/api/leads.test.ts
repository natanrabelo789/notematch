import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET, POST } from "@/app/api/leads/route";
import { checkLeadStorage, saveLead } from "@/lib/leads";

// Mock the side-effecting helpers, but keep the real isValidEmail so the
// route's validation behaviour is exercised end-to-end.
vi.mock("@/lib/leads", async (importActual) => {
  const actual = await importActual<typeof import("@/lib/leads")>();
  return {
    ...actual,
    saveLead: vi.fn(),
    checkLeadStorage: vi.fn(),
  };
});

const saveLeadMock = vi.mocked(saveLead);
const checkLeadStorageMock = vi.mocked(checkLeadStorage);

function makeRequest(body: unknown, { raw = false } = {}) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

beforeEach(() => {
  saveLeadMock.mockResolvedValue({ saved: true, mode: "console" });
});

describe("GET /api/leads", () => {
  it("returns the lead storage status", async () => {
    checkLeadStorageMock.mockResolvedValue({
      configured: true,
      urlPresent: true,
      serviceKeyPresent: true,
      canConnect: true,
    });

    const res = await GET();
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({ configured: true });
  });
});

describe("POST /api/leads", () => {
  it("rejects a missing email with 400 and does not save", async () => {
    const res = await POST(makeRequest({ name: "Ana" }));
    expect(res.status).toBe(400);
    expect(saveLeadMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email with 400 and does not save", async () => {
    const res = await POST(makeRequest({ email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(saveLeadMock).not.toHaveBeenCalled();
  });

  it("saves a valid lead and returns the save result", async () => {
    saveLeadMock.mockResolvedValue({ saved: true, mode: "supabase" });

    const res = await POST(
      makeRequest({
        email: "ana@example.com",
        name: "Ana",
        usage: "estudos",
        accessories: ["Mouse"],
      })
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ saved: true, mode: "supabase" });
    expect(saveLeadMock).toHaveBeenCalledTimes(1);
    expect(saveLeadMock.mock.calls[0][0]).toMatchObject({
      email: "ana@example.com",
      name: "Ana",
      accessories: ["Mouse"],
    });
  });

  it("applies defaults for omitted optional fields", async () => {
    await POST(makeRequest({ email: "ana@example.com" }));
    expect(saveLeadMock.mock.calls[0][0]).toMatchObject({
      name: "",
      phone: "",
      budget: "",
      usage: "",
      accessories: [],
      stage: "done",
      chatHistory: [],
      source: "chat_widget",
    });
  });

  it("returns 500 with detail when saving fails", async () => {
    saveLeadMock.mockRejectedValue(new Error("db down"));
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(makeRequest({ email: "ana@example.com" }));

    expect(res.status).toBe(500);
    await expect(res.json()).resolves.toMatchObject({ detail: "db down" });
    errorSpy.mockRestore();
  });

  it("returns 500 when the body is not valid JSON", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await POST(makeRequest("{ broken", { raw: true }));
    expect(res.status).toBe(500);
    errorSpy.mockRestore();
  });
});
