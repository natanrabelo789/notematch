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
  /**
   * Reference price label (e.g. "R$ 2.499").
   *
   * AMAZON ASSOCIATES COMPLIANCE: This field is NOT currently displayed to
   * users. Per Participation Requirements §2(b), prices may only be shown if
   * (a) served by Amazon via a Special Link, or (b) obtained via the Creators
   * API / PA API. Hardcoded prices violate this rule. The field is kept in the
   * data structure for future PA API integration only.
   */
  price: string;
  /**
   * Numeric reference price (e.g. 2499). Used internally for budget matching.
   *
   * AMAZON ASSOCIATES COMPLIANCE: Not displayed to users (see `price` above).
   * Kept for internal budget filtering and future PA API integration only.
   */
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
  /** True when free-text query could not be mapped to notebook criteria. */
  unclear?: boolean;
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
