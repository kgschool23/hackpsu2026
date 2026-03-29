"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import MealPlanView from "@/components/MealPlanView";
import RecipesView from "@/components/RecipesView";
import GroceryView from "@/components/GroceryView";
import TodaysMealsView from "@/components/TodaysMealsView";
import InventoryView from "@/components/InventoryView";
import MealDetail from "@/components/MealDetail";
import {
  MEALS as INITIAL_MEALS,
  DEFAULT_WEEK_PLAN,
  buildGroceryList,
  type Meal,
  type WeekPlan,
  type GroceryItem,
} from "@/components/mockData";

export default function AppPage() {
  const [activeView, setActiveView] = useState("dashboard");
  const [meals, setMeals] = useState<Meal[]>(INITIAL_MEALS);
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(DEFAULT_WEEK_PLAN);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);

  const [detailMealId, setDetailMealId] = useState<string | null>(null);

  // Rebuild grocery list when plan changes, preserving manual items
  useEffect(() => {
    const autoItems = buildGroceryList(weekPlan, meals);
    setGroceryItems(prev => {
      const manualItems = prev.filter(i => i.id.startsWith("g-manual-"));
      return [...autoItems, ...manualItems];
    });
  }, [weekPlan, meals]);

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
  };

  const toggleFav = (id: string) => {
    setMeals(meals.map(m => m.id === id ? { ...m, favorite: !m.favorite } : m));
  };



  const detailMeal = detailMealId ? meals.find(m => m.id === detailMealId) : null;

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      <main className="main-content">
        {activeView === "dashboard" && (
          <DashboardView
            meals={meals}
            weekPlan={weekPlan}
            onNavigate={setActiveView}
            onOpenMeal={setDetailMealId}
          />
        )}
        {activeView === "mealplan" && (
          <MealPlanView
            meals={meals}
            weekPlan={weekPlan}
            setWeekPlan={setWeekPlan}
            onOpenMeal={setDetailMealId}
          />
        )}
        {activeView === "recipes" && (
          <RecipesView
            meals={meals}
            onToggleFav={toggleFav}
            onOpenMeal={setDetailMealId}
            onAddMeal={addMeal}
          />
        )}
        {activeView === "grocery" && (
          <GroceryView
            items={groceryItems}
            setItems={setGroceryItems}
          />
        )}
        {activeView === "todaymeals" && (
          <TodaysMealsView
            meals={meals}
            onOpenMeal={setDetailMealId}
          />
        )}
        {activeView === "inventory" && <InventoryView />}
      </main>

      {/* Meal Detail Modal */}
      {detailMeal && (
        <MealDetail
          meal={detailMeal}
          onClose={() => setDetailMealId(null)}
          onToggleFav={toggleFav}
        />
      )}
    </div>
  );
}
