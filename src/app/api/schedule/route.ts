// ──────────────────────────────────────────────────────────
// MOCK BACKEND — /api/schedule
// Returns deterministic mock data for the scheduling algo.
// Swap this file for real logic without touching the UI.
// ──────────────────────────────────────────────────────────

import type { ScheduleResponse } from "@/types/schedule";

export const dynamic = "force-dynamic";

const MOCK_DATA: ScheduleResponse = {
  generated_at: new Date().toISOString(),
  inventory: [
    { id: "inv-001", name: "Chicken Breast",   days_to_live: 2,  status: "critical" },
    { id: "inv-002", name: "Ground Beef",      days_to_live: 3,  status: "critical" },
    { id: "inv-003", name: "Spinach",          days_to_live: 4,  status: "warning"  },
    { id: "inv-004", name: "Bell Peppers",     days_to_live: 5,  status: "warning"  },
    { id: "inv-005", name: "Milk (1 gal)",     days_to_live: 6,  status: "warning"  },
    { id: "inv-006", name: "Cheddar Cheese",   days_to_live: 8,  status: "fresh"    },
    { id: "inv-007", name: "Eggs (dozen)",     days_to_live: 10, status: "fresh"    },
    { id: "inv-008", name: "Tortillas",        days_to_live: 12, status: "fresh"    },
    { id: "inv-009", name: "Greek Yogurt",     days_to_live: 7,  status: "fresh"    },
    { id: "inv-010", name: "Tomatoes",         days_to_live: 3,  status: "critical" },
    { id: "inv-011", name: "Avocados",         days_to_live: 2,  status: "critical" },
    { id: "inv-012", name: "Rice (dry)",       days_to_live: 14, status: "fresh"    },
  ],
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
