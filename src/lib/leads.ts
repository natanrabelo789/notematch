import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { LeadData } from "./types";

let supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  if (!supabaseAdmin) {
    supabaseAdmin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return supabaseAdmin;
}

export async function saveLead(lead: LeadData): Promise<{
  saved: boolean;
  mode: "supabase" | "console";
}> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    console.log("[NoteMatch] Lead (dev mode):", lead);
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
    throw new Error("Failed to save lead");
  }

  return { saved: true, mode: "supabase" };
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
