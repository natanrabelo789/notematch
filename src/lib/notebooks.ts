import { NOTEBOOK_CATALOG } from "./catalog";
import { getSupabaseAdmin } from "./supabase";
import type { Notebook, NotebookCategory } from "./types";

const VALID_CATEGORIES = new Set<NotebookCategory>([
  "basic",
  "student",
  "gaming",
  "design",
  "engineering",
  "programming",
]);

interface NotebookRow {
  id: string;
  name: string;
  brand: string;
  price: string;
  price_value: number;
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  description: string;
  reason: string;
  categories: string[] | null;
}

function mapRow(row: NotebookRow): Notebook {
  const categories = (row.categories ?? []).filter(
    (category): category is NotebookCategory =>
      VALID_CATEGORIES.has(category as NotebookCategory)
  );

  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    price: row.price,
    priceValue: row.price_value,
    processor: row.processor,
    ram: row.ram,
    storage: row.storage,
    gpu: row.gpu,
    screen: row.screen,
    description: row.description,
    reason: row.reason,
    categories: categories.length > 0 ? categories : ["basic"],
  };
}

export async function fetchNotebookCatalog(): Promise<{
  catalog: Notebook[];
  source: "supabase" | "fallback";
}> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return { catalog: NOTEBOOK_CATALOG, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("notebooks")
    .select(
      "id, name, brand, price, price_value, processor, ram, storage, gpu, screen, description, reason, categories"
    )
    .order("price_value", { ascending: true });

  if (error) {
    console.error("[NoteMatch] Failed to load notebooks from Supabase:", error);
    return { catalog: NOTEBOOK_CATALOG, source: "fallback" };
  }

  if (!data || data.length === 0) {
    console.warn(
      "[NoteMatch] notebooks table is empty; using local catalog fallback."
    );
    return { catalog: NOTEBOOK_CATALOG, source: "fallback" };
  }

  return {
    catalog: (data as NotebookRow[]).map(mapRow),
    source: "supabase",
  };
}
