"use client";

import React, { useState } from "react";
import { Meal, DAYS, WeekDay, WeekPlan } from "./mockData";

interface MealPlanProps {
  meals: Meal[];
  weekPlan: WeekPlan;
  setWeekPlan: (p: WeekPlan) => void;
  onOpenMeal: (id: string) => void;
}

export default function MealPlanView({ meals, weekPlan, setWeekPlan, onOpenMeal }: MealPlanProps) {
  const [dragMealId, setDragMealId] = useState<string | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);

  const handleDragStart = (mealId: string) => setDragMealId(mealId);
  const handleDragEnd = () => { setDragMealId(null); setDragOverTarget(null); };
  const handleDragOver = (e: React.DragEvent, target: string) => { e.preventDefault(); setDragOverTarget(target); };
  const handleDragLeave = () => setDragOverTarget(null);

  const handleDrop = (day: WeekDay, slotIdx: number) => {
    if (!dragMealId) return;
    const newPlan = { ...weekPlan };
    newPlan[day] = [...newPlan[day]];
    newPlan[day][slotIdx] = { ...newPlan[day][slotIdx], mealId: dragMealId };
    setWeekPlan(newPlan);
    setDragMealId(null);
    setDragOverTarget(null);
  };

  const removeMeal = (day: WeekDay, slotIdx: number) => {
    const newPlan = { ...weekPlan };
    newPlan[day] = [...newPlan[day]];
    newPlan[day][slotIdx] = { ...newPlan[day][slotIdx], mealId: null };
    setWeekPlan(newPlan);
  };

  const SLOT_LABELS = ["Breakfast", "Lunch", "Dinner"];
  const SLOT_EMOJI = ["☀️", "🌤", "🌙"];

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Weekly Meal Plan
        </h1>
        <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
          Drag meals from the palette below and drop them onto your weekly slots.
        </p>
      </div>

      {/* Week Grid */}
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${DAYS.length}, 1fr)`, gap: 8, minWidth: 800 }}>
          {/* Header Row */}
          <div />
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: "center", fontWeight: 800, fontSize: "0.8rem", color: "var(--color-text-secondary)",
              padding: "8px 0", borderRadius: 10, background: "rgba(255,255,255,0.03)",
            }}>{d}</div>
          ))}

          {/* Slot Rows */}
          {[0, 1, 2].map(slotIdx => (
            <React.Fragment key={`row-${slotIdx}`}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-dim)",
              }}>
                <span>{SLOT_EMOJI[slotIdx]}</span> {SLOT_LABELS[slotIdx]}
              </div>
              {DAYS.map(d => {
                const slot = weekPlan[d][slotIdx];
                const meal = slot.mealId ? meals.find(m => m.id === slot.mealId) : null;
                const target = `${d}-${slotIdx}`;
                const isOver = dragOverTarget === target;
                return (
                  <div key={target}
                    onDragOver={(e) => handleDragOver(e, target)}
                    onDragLeave={handleDragLeave}
                    onDrop={() => handleDrop(d, slotIdx)}
                    style={{
                      minHeight: 72, borderRadius: 12,
                      border: `1.5px dashed ${isOver ? "var(--color-accent)" : "rgba(255,255,255,0.08)"}`,
                      background: isOver ? "rgba(255,107,53,0.06)" : "rgba(255,255,255,0.02)",
                      padding: 6, transition: "all 0.2s",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {meal ? (
                      <div style={{
                        width: "100%", padding: "6px 8px", borderRadius: 10,
                        background: "var(--color-bg-surface)", border: "1px solid var(--color-border)",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                        fontSize: "0.75rem", fontWeight: 600, position: "relative",
                      }} onClick={() => onOpenMeal(meal.id)}>
                        <span style={{ fontSize: "1.1rem" }}>{meal.image}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{meal.name}</div>
                          <div style={{ fontSize: "0.65rem", color: "var(--color-text-dim)" }}>{meal.calories} kcal</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeMeal(d, slotIdx); }}
                          style={{
                            width: 20, height: 20, borderRadius: 6, border: "none",
                            background: "rgba(251,113,133,0.15)", color: "var(--color-critical)",
                            cursor: "pointer", fontSize: "0.7rem", display: "flex",
                            alignItems: "center", justifyContent: "center",
                          }}>✕</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}>+</span>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Meal Palette */}
      <div className="glass-card">
        <div className="glass-card-inner">
          <div className="section-header">
            <span className="section-title">🍽 Drag a Meal</span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {meals.map(m => (
              <div key={m.id} draggable
                onDragStart={() => handleDragStart(m.id)}
                onDragEnd={handleDragEnd}
                className="draggable"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "8px 14px", borderRadius: 12,
                  background: dragMealId === m.id ? "rgba(255,107,53,0.12)" : "rgba(255,255,255,0.04)",
                  border: `1px solid ${dragMealId === m.id ? "rgba(255,107,53,0.3)" : "var(--color-border)"}`,
                  fontSize: "0.8rem", fontWeight: 600, color: "var(--color-text-secondary)",
                  transition: "all 0.2s",
                }}>
                <span style={{ fontSize: "1.1rem" }}>{m.image}</span>
                {m.name}
                <span style={{ fontSize: "0.7rem", color: "var(--color-text-dim)" }}>{m.calories}kcal</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
