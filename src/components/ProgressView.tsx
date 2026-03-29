"use client";

import { Meal, DAYS, WeekPlan } from "./mockData";

interface ProgressProps {
  meals: Meal[];
  weekPlan: WeekPlan;
  completedMeals: string[];
  onToggleComplete: (key: string) => void;
}

export default function ProgressView({ meals, weekPlan, completedMeals, onToggleComplete }: ProgressProps) {
  // Build flat list of planned meals
  const planned: { key: string; day: string; type: string; meal: Meal }[] = [];
  DAYS.forEach(d => {
    weekPlan[d].forEach((s, i) => {
      if (s.mealId) {
        const meal = meals.find(m => m.id === s.mealId);
        if (meal) planned.push({ key: `${d}-${i}`, day: d, type: s.type, meal });
      }
    });
  });

  const totalPlanned = planned.length;
  const doneCount = completedMeals.length;
  const pct = totalPlanned ? Math.round((doneCount / totalPlanned) * 100) : 0;

  const totalCalConsumed = planned.filter(p => completedMeals.includes(p.key)).reduce((s, p) => s + p.meal.calories, 0);
  const totalProtConsumed = planned.filter(p => completedMeals.includes(p.key)).reduce((s, p) => s + p.meal.protein, 0);

  const circumference = 2 * Math.PI * 54;

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Progress</h1>
        <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
          Track your meals completed and nutrition consumed this week.
        </p>
      </div>

      {/* Big Ring + Stats */}
      <div className="grid-2col">
        <div className="glass-card">
          <div className="glass-card-inner" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            <div style={{ position: "relative", width: 130, height: 130, marginBottom: "1rem" }}>
              <svg width="130" height="130" className="progress-ring" style={{ position: "absolute", inset: 0 }}>
                <circle className="progress-ring-bg" cx="65" cy="65" r="54" strokeWidth="10" fill="none" />
                <circle className="progress-ring-fill" cx="65" cy="65" r="54" strokeWidth="10" fill="none"
                  stroke="var(--color-accent)"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - (pct / 100) * circumference} />
              </svg>
              <div style={{
                position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "2rem", fontWeight: 900, color: "var(--color-accent)" }}>{pct}%</span>
                <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-text-dim)" }}>complete</span>
              </div>
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--color-text-secondary)" }}>
              {doneCount} of {totalPlanned} meals
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[
            { label: "Calories Consumed", val: `${totalCalConsumed}`, unit: "kcal", color: "var(--color-accent)" },
            { label: "Protein Consumed", val: `${totalProtConsumed}`, unit: "g", color: "#8b5cf6" },
            { label: "Meals Remaining", val: `${totalPlanned - doneCount}`, unit: "", color: "var(--color-teal)" },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color, fontSize: "1.4rem" }}>
                {s.val}<span style={{ fontSize: "0.8rem", fontWeight: 600 }}> {s.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Meal Checklist */}
      <div className="glass-card">
        <div className="glass-card-inner">
          <div className="section-header">
            <span className="section-title">Meal Checklist</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {planned.map(p => {
              const done = completedMeals.includes(p.key);
              return (
                <div key={p.key} className="grocery-item" style={{ opacity: done ? 0.5 : 1 }}>
                  <button className={`grocery-check ${done ? "checked" : ""}`} onClick={() => onToggleComplete(p.key)}>
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  <span style={{ fontSize: "1rem" }}>{p.meal.image}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600, textDecoration: done ? "line-through" : "none", color: "var(--color-text-secondary)" }}>{p.meal.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}>{p.day} · {p.type}</div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-dim)" }}>{p.meal.calories} kcal</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
