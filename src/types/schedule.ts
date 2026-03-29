// ──────────────────────────────────────────────────────────
// EXPIRATION CRITICAL PATH — Shared Type Contracts
// ──────────────────────────────────────────────────────────

export type IngredientStatus = "fresh" | "warning" | "critical";

export interface InventoryItem {
  id: string;
  name: string;
  days_to_live: number;
  status: IngredientStatus;
}

export interface CriticalPathMeal {
  day: number;
  meal_name: string;
  consumed_ingredients: string[];
}

export interface ScheduleResponse {
  inventory: InventoryItem[];
  critical_path: CriticalPathMeal[];
  generated_at: string;
}
