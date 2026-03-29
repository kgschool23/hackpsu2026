// ──────────────────────────────────────────────────
// MOCK DATA — All meal prep data for demonstration
// ──────────────────────────────────────────────────

export interface Meal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  prepTime: number;    // minutes
  dietTags: string[];
  ingredients: string[];
  steps: string[];
  favorite: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  qty: string;
  category: string;
  checked: boolean;
}

export const MEALS: Meal[] = [
  {
    id: "m1", name: "Grilled Chicken Bowl", image: "🥗",
    calories: 520, protein: 42, carbs: 48, fat: 14, fiber: 6, prepTime: 25,
    dietTags: ["high-protein", "low-fat"],
    ingredients: ["Chicken Breast", "Brown Rice", "Avocado", "Corn", "Lime"],
    steps: ["Season chicken with salt, pepper and paprika", "Grill chicken 6 min per side", "Cook rice per instructions", "Slice avocado", "Assemble bowl and squeeze lime"],
    favorite: false,
  },
  {
    id: "m2", name: "Veggie Stir-Fry", image: "🥘",
    calories: 380, protein: 12, carbs: 52, fat: 14, fiber: 9, prepTime: 15,
    dietTags: ["vegetarian", "quick"],
    ingredients: ["Bell Peppers", "Broccoli", "Soy Sauce", "Garlic", "Tofu", "Sesame Oil"],
    steps: ["Press and cube tofu", "Heat sesame oil in wok", "Sauté garlic 30 seconds", "Add vegetables, cook 5 min", "Add tofu and soy sauce, toss 3 min"],
    favorite: false,
  },
  {
    id: "m3", name: "Overnight Oats", image: "🥣",
    calories: 340, protein: 14, carbs: 58, fat: 8, fiber: 7, prepTime: 5,
    dietTags: ["vegetarian", "quick", "meal-prep"],
    ingredients: ["Rolled Oats", "Greek Yogurt", "Honey", "Berries", "Chia Seeds"],
    steps: ["Combine oats, yogurt, and milk in jar", "Add chia seeds and honey", "Refrigerate overnight", "Top with berries before serving"],
    favorite: false,
  },
  {
    id: "m4", name: "Beef Tacos", image: "🌮",
    calories: 610, protein: 35, carbs: 42, fat: 32, fiber: 4, prepTime: 20,
    dietTags: ["high-protein"],
    ingredients: ["Ground Beef", "Tortillas", "Tomatoes", "Lettuce", "Cheese", "Sour Cream"],
    steps: ["Brown beef with taco seasoning", "Warm tortillas", "Dice tomatoes and lettuce", "Assemble tacos with toppings"],
    favorite: false,
  },
  {
    id: "m5", name: "Salmon & Asparagus", image: "🐟",
    calories: 470, protein: 38, carbs: 18, fat: 28, fiber: 5, prepTime: 30,
    dietTags: ["high-protein", "low-carb", "keto"],
    ingredients: ["Salmon Fillet", "Asparagus", "Lemon", "Olive Oil", "Garlic"],
    steps: ["Preheat oven to 400°F", "Season salmon with lemon and garlic", "Toss asparagus in olive oil", "Bake together for 18 min"],
    favorite: false,
  },
  {
    id: "m6", name: "Protein Smoothie", image: "🥤",
    calories: 290, protein: 30, carbs: 32, fat: 6, fiber: 4, prepTime: 5,
    dietTags: ["quick", "high-protein", "vegetarian"],
    ingredients: ["Protein Powder", "Banana", "Spinach", "Almond Milk", "Peanut Butter"],
    steps: ["Add all ingredients to blender", "Blend on high for 60 seconds", "Pour and enjoy"],
    favorite: false,
  },
  {
    id: "m7", name: "Pasta Primavera", image: "🍝",
    calories: 480, protein: 16, carbs: 68, fat: 16, fiber: 8, prepTime: 25,
    dietTags: ["vegetarian"],
    ingredients: ["Penne Pasta", "Zucchini", "Cherry Tomatoes", "Parmesan", "Basil", "Olive Oil"],
    steps: ["Cook pasta al dente", "Sauté zucchini and tomatoes", "Toss pasta with vegetables", "Top with parmesan and basil"],
    favorite: false,
  },
  {
    id: "m8", name: "Turkey Wrap", image: "🌯",
    calories: 420, protein: 32, carbs: 38, fat: 16, fiber: 3, prepTime: 10,
    dietTags: ["high-protein", "quick"],
    ingredients: ["Turkey Slices", "Whole Wheat Wrap", "Hummus", "Spinach", "Tomato"],
    steps: ["Spread hummus on wrap", "Layer turkey, spinach, and tomato", "Roll tightly and slice in half"],
    favorite: false,
  },
];

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface MealSlot {
  type: "breakfast" | "lunch" | "dinner";
  mealId: string | null;
}

export type WeekPlan = Record<WeekDay, MealSlot[]>;

export const DAYS: WeekDay[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const DEFAULT_WEEK_PLAN: WeekPlan = {
  Mon: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Tue: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Wed: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Thu: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Fri: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Sat: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
  Sun: [
    { type: "breakfast", mealId: null },
    { type: "lunch", mealId: null },
    { type: "dinner", mealId: null },
  ],
};

export function buildGroceryList(plan: WeekPlan, meals: Meal[]): GroceryItem[] {
  const needed: Record<string, string> = {};
  for (const day of DAYS) {
    for (const slot of plan[day]) {
      if (slot.mealId) {
        const meal = meals.find((m) => m.id === slot.mealId);
        if (meal) {
          meal.ingredients.forEach((ing) => {
            if (!needed[ing]) {
              needed[ing] = guessCategory(ing);
            }
          });
        }
      }
    }
  }
  return Object.entries(needed).map(([name, category], i) => ({
    id: `g-${i}`,
    name,
    qty: "1",
    category,
    checked: false,
  }));
}

function guessCategory(name: string): string {
  const lower = name.toLowerCase();
  if (["chicken", "beef", "turkey", "salmon", "tofu"].some((k) => lower.includes(k)))
    return "Protein";
  if (["milk", "yogurt", "cheese", "cream", "butter"].some((k) => lower.includes(k)))
    return "Dairy";
  if (["rice", "pasta", "oats", "wrap", "tortilla", "bread"].some((k) => lower.includes(k)))
    return "Grains";
  if (["banana", "berries", "lemon", "lime", "avocado", "tomato"].some((k) => lower.includes(k)))
    return "Produce";
  return "Pantry";
}
