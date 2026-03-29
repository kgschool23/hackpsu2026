// ──────────────────────────────────────────────────────────
// MOCK BACKEND — /api/schedule
// Returns deterministic mock data for the scheduling algo.
// Swap this file for real logic without touching the UI.
// ──────────────────────────────────────────────────────────

import type { ScheduleResponse } from "@/types/schedule";

export const dynamic = "force-dynamic";

const MOCK_DATA: ScheduleResponse = {
  generated_at: new Date().toISOString(),
  inventory: [],
  critical_path: [
    {
      day: 1,
      meal_name: "Grilled Chicken & Avocado Bowl",
      consumed_ingredients: ["Chicken Breast", "Avocados", "Rice (dry)"],
    },
    {
      day: 2,
      meal_name: "Beef & Tomato Stir-Fry",
      consumed_ingredients: ["Ground Beef", "Tomatoes", "Bell Peppers"],
    },
    {
      day: 3,
      meal_name: "Spinach & Cheese Quesadilla",
      consumed_ingredients: ["Spinach", "Cheddar Cheese", "Tortillas"],
    },
    {
      day: 4,
      meal_name: "Milk-Braised Eggs w/ Peppers",
      consumed_ingredients: ["Milk (1 gal)", "Eggs (dozen)", "Bell Peppers"],
    },
    {
      day: 5,
      meal_name: "Yogurt Parfait (passive consume)",
      consumed_ingredients: ["Greek Yogurt"],
    },
    {
      day: 7,
      meal_name: "Cheese Omelette",
      consumed_ingredients: ["Eggs (dozen)", "Cheddar Cheese"],
    },
    {
      day: 10,
      meal_name: "Rice & Bean Bowl (pantry clear)",
      consumed_ingredients: ["Rice (dry)", "Tortillas"],
    },
  ],
};

export async function GET() {
  return Response.json(MOCK_DATA);
}
