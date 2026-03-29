"use client";

import { useState } from "react";
import { Meal } from "./mockData";

interface EatenMeal {
  id: string;
  meal: Meal;
  time: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

interface TodaysMealsProps {
  meals: Meal[];
  onOpenMeal: (id: string) => void;
}

const MEAL_TYPES = [
  { value: "breakfast", label: "Breakfast", emoji: "☀️" },
  { value: "lunch", label: "Lunch", emoji: "🌤" },
  { value: "dinner", label: "Dinner", emoji: "🌙" },
  { value: "snack", label: "Snack", emoji: "🍿" },
] as const;

export default function TodaysMealsView({ meals, onOpenMeal }: TodaysMealsProps) {
  const [eatenMeals, setEatenMeals] = useState<EatenMeal[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState("");
  const [selectedType, setSelectedType] = useState<EatenMeal["mealType"]>("lunch");
  const [searchQuery, setSearchQuery] = useState("");

  const addEatenMeal = () => {
    if (!selectedMealId) return;
    const meal = meals.find(m => m.id === selectedMealId);
    if (!meal) return;
    const now = new Date();
    const entry: EatenMeal = {
      id: `eaten-${Date.now()}`,
      meal,
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      mealType: selectedType,
    };
    setEatenMeals(prev => [...prev, entry]);
    setSelectedMealId("");
    setSearchQuery("");
    setShowAdd(false);
  };

  const removeEaten = (id: string) => {
    setEatenMeals(prev => prev.filter(e => e.id !== id));
  };

  // Totals
  const totalCal = eatenMeals.reduce((s, e) => s + e.meal.calories, 0);
  const totalProtein = eatenMeals.reduce((s, e) => s + e.meal.protein, 0);
  const totalCarbs = eatenMeals.reduce((s, e) => s + e.meal.carbs, 0);
  const totalFat = eatenMeals.reduce((s, e) => s + e.meal.fat, 0);

  const calGoal = 2000;
  const calPct = Math.min(Math.round((totalCal / calGoal) * 100), 100);
  const circumference = 2 * Math.PI * 50;

  // Filter meals for the add dropdown
  const filteredMeals = searchQuery
    ? meals.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : meals;

  // Group eaten meals by type
  const grouped = MEAL_TYPES.map(t => ({
    ...t,
    items: eatenMeals.filter(e => e.mealType === t.value),
  }));

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
            Today&apos;s Meals
          </h1>
          <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
            Log what you&apos;ve eaten today to track your nutrition.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} id="log-meal-btn">
          {showAdd ? "Cancel" : "+ Log Meal"}
        </button>
      </div>

      {/* Add Eaten Meal Form */}
      {showAdd && (
        <div className="glass-card scale-in">
          <div className="glass-card-inner" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="section-header">
              <span className="section-title">Log a Meal</span>
            </div>

            {/* Meal Type Selector */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Meal Type</label>
              <div style={{ display: "flex", gap: 6 }}>
                {MEAL_TYPES.map(t => (
                  <button key={t.value} type="button"
                    className={`pill ${selectedType === t.value ? "active" : ""}`}
                    onClick={() => setSelectedType(t.value)}
                    style={{ padding: "6px 14px", fontSize: "0.8rem" }}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Meal Search & Select */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Choose a Meal</label>
              <div className="search-bar" style={{ marginBottom: 8 }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input placeholder="Search your meals..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 200, overflowY: "auto" }}>
                {filteredMeals.map(m => (
                  <button key={m.id} type="button"
                    onClick={() => { setSelectedMealId(m.id); setSearchQuery(m.name); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 10px", borderRadius: 10, textAlign: "left", width: "100%",
                      background: selectedMealId === m.id ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.03)",
                      border: selectedMealId === m.id ? "1px solid rgba(255,107,53,0.25)" : "1px solid var(--color-border)",
                      color: "var(--color-text-secondary)", cursor: "pointer",
                      transition: "all 0.15s",
                    }}>
                    <span style={{ fontSize: "1.3rem" }}>{m.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{m.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}>
                        {m.calories} kcal · {m.protein}g protein
                      </div>
                    </div>
                  </button>
                ))}
                {filteredMeals.length === 0 && (
                  <div style={{ padding: "1rem", textAlign: "center", color: "var(--color-text-dim)", fontSize: "0.85rem" }}>
                    No meals found. Create one in the Recipes tab!
                  </div>
                )}
              </div>
            </div>

            <button type="button" className="btn btn-primary" onClick={addEatenMeal}
              style={{ alignSelf: "flex-start", opacity: selectedMealId ? 1 : 0.5 }}
              disabled={!selectedMealId}>
              ✅ Log This Meal
            </button>
          </div>
        </div>
      )}

      {/* Today's Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1.25rem", alignItems: "start" }}>
        {/* Calorie Ring */}
        <div className="glass-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: "0.75rem" }}>
            <svg width="120" height="120" className="progress-ring" style={{ position: "absolute", inset: 0 }}>
              <circle className="progress-ring-bg" cx="60" cy="60" r="50" strokeWidth="8" fill="none" />
              <circle className="progress-ring-fill" cx="60" cy="60" r="50" strokeWidth="8" fill="none"
                stroke="var(--color-accent)"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (calPct / 100) * circumference} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--color-accent)" }}>{totalCal}</span>
              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: "var(--color-text-dim)" }}>of {calGoal} kcal</span>
            </div>
          </div>
          <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-secondary)" }}>
            {eatenMeals.length} meal{eatenMeals.length !== 1 ? "s" : ""} logged
          </div>
        </div>

        {/* Macro Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "Protein", val: totalProtein, unit: "g", color: "#8b5cf6", target: 120 },
            { label: "Carbs", val: totalCarbs, unit: "g", color: "#f59e0b", target: 250 },
            { label: "Fat", val: totalFat, unit: "g", color: "#ec4899", target: 65 },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: "1.3rem" }}>
                {s.val}<span style={{ fontSize: "0.75rem", fontWeight: 600 }}>{s.unit}</span>
              </div>
              <div className="macro-bar" style={{ marginTop: 8 }}>
                <div style={{ width: `${Math.min((s.val / s.target) * 100, 100)}%`, background: s.color }} />
              </div>
              <div className="stat-sub">of {s.target}{s.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Meals by Type */}
      {grouped.map(group => (
        <div key={group.value} className="glass-card">
          <div className="glass-card-inner">
            <div className="section-header">
              <span className="section-title" style={{ fontSize: "0.95rem" }}>
                {group.emoji} {group.label}
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", fontWeight: 600 }}>
                {group.items.reduce((s, e) => s + e.meal.calories, 0)} kcal
              </span>
            </div>
            {group.items.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {group.items.map(entry => (
                  <div key={entry.id} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 12,
                    background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}>
                    <span style={{ fontSize: "1.3rem" }}>{entry.meal.image}</span>
                    <div style={{ flex: 1 }} onClick={() => onOpenMeal(entry.meal.id)}>
                      <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{entry.meal.name}</div>
                      <div style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}>
                        {entry.time} · {entry.meal.calories} kcal · {entry.meal.protein}g protein
                      </div>
                    </div>
                    <button onClick={() => removeEaten(entry.id)} style={{
                      background: "none", border: "none", color: "var(--color-text-dim)",
                      cursor: "pointer", padding: 4, borderRadius: 6, fontSize: "0.75rem",
                    }}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "0.75rem", textAlign: "center", color: "var(--color-text-dim)", fontSize: "0.8rem", fontStyle: "italic" }}>
                Nothing logged yet
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
