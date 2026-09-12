import type { LeadData } from "./types";
import { getSupabaseAdmin } from "./supabase";

export async function checkLeadStorage(): Promise<{
  configured: boolean;
  urlPresent: boolean;
  serviceKeyPresent: boolean;
  canConnect: boolean;
  error?: string;
}> {
  const urlPresent = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKeyPresent = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const configured = urlPresent && serviceKeyPresent;

  if (!configured) {
    return { configured, urlPresent, serviceKeyPresent, canConnect: false };
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { configured, urlPresent, serviceKeyPresent, canConnect: false };
  }

  const { error } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true });

  return {
    configured,
    urlPresent,
    serviceKeyPresent,
    canConnect: !error,
    error: error?.message,
  };
}

export async function saveLead(lead: LeadData): Promise<{
  saved: boolean;
  mode: "supabase" | "console";
}> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.warn(
      "[NoteMatch] Supabase not configured (missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY). Lead logged to console only:",
      lead
    );
    return { saved: true, mode: "console" };
  }

  const { error } = await supabase.from("leads").insert({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    budget: lead.budget,
    usage: lead.usage,
    accessories: lead.accessories,
    stage: lead.stage,
    chat_history: lead.chatHistory,
    source: lead.source,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("[NoteMatch] Supabase error:", error);
    throw new Error(error.message);
  }

  return { saved: true, mode: "supabase" };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
