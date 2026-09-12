export type BudgetRange = "ate-4000" | "4000-6000" | "acima-6000";

export type UserType = "myself" | "gift";

export type NotebookCategory =
  | "basic"
  | "student"
  | "gaming"
  | "design"
  | "engineering"
  | "programming";

export interface Notebook {
  id: string;
  name: string;
  brand: string;
  price: string;
  priceValue: number;
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  screen: string;
  description: string;
  reason: string;
  categories: NotebookCategory[];
}

export interface RecommendationRequest {
  usage: string;
  brand?: string;
  budgetRange: BudgetRange;
  /** Optional free-text description; parsed when structured fields are incomplete. */
  query?: string;
}

export interface RecommendationResponse {
  recommendations: Notebook[];
  category: NotebookCategory;
  budgetLabel: string;
  catalogSource?: "supabase" | "fallback";
  budgetDetected?: boolean;
  brandDetected?: boolean;
  interpretation?: string;
}

export interface ChatMessage {
  role: "user" | "bot";
  message: string;
  timestamp: string;
}

export type LeadStage =
  | "initial"
  | "budget_discussion"
  | "usage_discussion"
  | "offer_contact"
  | "ask_name"
  | "ask_email"
  | "ask_phone"
  | "done";

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  budget: string;
  usage: string;
  accessories: string[];
  stage: LeadStage;
  chatHistory: ChatMessage[];
  source: string;
}

export interface ComparedNotebook extends Notebook {
  index: number;
}
