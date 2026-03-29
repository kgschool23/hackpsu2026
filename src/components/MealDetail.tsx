"use client";

import { Meal } from "./mockData";

interface MealDetailProps {
  meal: Meal;
  onClose: () => void;
  onToggleFav: (id: string) => void;
}

export default function MealDetail({ meal, onClose, onToggleFav }: MealDetailProps) {
  const totalMacro = meal.protein + meal.carbs + meal.fat;
  const pPct = Math.round((meal.protein / totalMacro) * 100);
  const cPct = Math.round((meal.carbs / totalMacro) * 100);
  const fPct = 100 - pPct - cPct;

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        {/* Hero */}
        <div style={{
          height: 180,
          background: "linear-gradient(135deg, rgba(255,107,53,0.15), rgba(0,212,170,0.1))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "4rem",
          position: "relative",
        }}>
          {meal.image}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(0,0,0,0.3)", border: "none",
              color: "white", cursor: "pointer", fontSize: "1.2rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >✕</button>
        </div>

        <div style={{ padding: "1.5rem" }}>
          {/* Title Row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
            <div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: 4 }}>{meal.name}</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {meal.dietTags.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            </div>
            <button className={`fav-btn ${meal.favorite ? "active" : ""}`} onClick={() => onToggleFav(meal.id)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={meal.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: "1.25rem" }}>
            {[
              { label: "Calories", value: `${meal.calories}`, unit: "kcal", color: "#ff6b35" },
              { label: "Protein", value: `${meal.protein}g`, unit: "", color: "#8b5cf6" },
              { label: "Carbs", value: `${meal.carbs}g`, unit: "", color: "#f59e0b" },
              { label: "Prep", value: `${meal.prepTime}`, unit: "min", color: "#00d4aa" },
            ].map((s) => (
              <div key={s.label} style={{
                textAlign: "center", padding: "0.75rem 0.5rem",
                background: "rgba(255,255,255,0.03)", borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "var(--color-text-dim)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: s.color }}>{s.value}<span style={{ fontSize: "0.7rem", fontWeight: 600 }}>{s.unit}</span></div>
              </div>
            ))}
          </div>

          {/* Macro Bar */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: 700, marginBottom: 6, color: "var(--color-text-dim)" }}>
              <span style={{ color: "#8b5cf6" }}>Protein {pPct}%</span>
              <span style={{ color: "#f59e0b" }}>Carbs {cPct}%</span>
              <span style={{ color: "#ec4899" }}>Fat {fPct}%</span>
            </div>
            <div className="macro-bar">
              <div style={{ width: `${pPct}%`, background: "#8b5cf6" }} />
              <div style={{ width: `${cPct}%`, background: "#f59e0b" }} />
              <div style={{ width: `${fPct}%`, background: "#ec4899" }} />
            </div>
          </div>

          {/* Ingredients */}
          <div style={{ marginBottom: "1.25rem" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
              Ingredients
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {meal.ingredients.map((ing) => (
                <span key={ing} style={{
                  padding: "6px 12px", borderRadius: 10,
                  background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.15)",
                  fontSize: "0.8rem", fontWeight: 600, color: "var(--color-teal-light)",
                }}>{ing}</span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: 800, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-secondary)" }}>
              Instructions
            </h3>
            <ol style={{ paddingLeft: "1.2rem", display: "flex", flexDirection: "column", gap: 8 }}>
              {meal.steps.map((step, i) => (
                <li key={i} style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
