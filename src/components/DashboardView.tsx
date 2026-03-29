"use client";

import { Meal, DAYS, WeekPlan } from "./mockData";

interface DashboardProps {
  meals: Meal[];
  weekPlan: WeekPlan;
  onNavigate: (view: string) => void;
  onOpenMeal: (id: string) => void;
}

export default function DashboardView({ meals, weekPlan, onNavigate, onOpenMeal }: DashboardProps) {
  // Calculate today's stats
  const today = DAYS[0]; // Mock: Monday
  const todaySlots = weekPlan[today];
  const todayMeals = todaySlots.filter(s => s.mealId).map(s => meals.find(m => m.id === s.mealId)!).filter(Boolean);
  const totalCal = todayMeals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = todayMeals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = todayMeals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = todayMeals.reduce((s, m) => s + m.fat, 0);

  const calGoal = 2000;
  const calPct = Math.min(Math.round((totalCal / calGoal) * 100), 100);
  const circumference = 2 * Math.PI * 42;
  const dashOffset = circumference - (calPct / 100) * circumference;

  // Count planned meals for the week
  let weekMealCount = 0;
  DAYS.forEach(d => weekPlan[d].forEach(s => { if (s.mealId) weekMealCount++; }));

  // Upcoming meals (next 3 w/ mealId)
  const upcoming: { day: string; type: string; meal: Meal }[] = [];
  for (const d of DAYS) {
    for (const s of weekPlan[d]) {
      if (s.mealId && upcoming.length < 3) {
        const meal = meals.find(m => m.id === s.mealId);
        if (meal) upcoming.push({ day: d, type: s.type, meal });
      }
    }
  }

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Greeting */}
      <div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>
          Good evening! 👋
        </h1>
        <p style={{ color: "var(--color-text-dim)", fontWeight: 500 }}>
          Here&apos;s your meal prep overview for this week.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid-stats stagger">
        {/* Calorie Ring */}
        <div className="stat-card fade-in-up" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <svg width="64" height="64" className="progress-ring" style={{ flexShrink: 0 }}>
            <circle className="progress-ring-bg" cx="32" cy="32" r="26" strokeWidth="6" fill="none" />
            <circle className="progress-ring-fill" cx="32" cy="32" r="26" strokeWidth="6" fill="none"
              stroke="var(--color-accent)" strokeDasharray={2 * Math.PI * 26} strokeDashoffset={2 * Math.PI * 26 - (calPct / 100) * 2 * Math.PI * 26} />
          </svg>
          <div>
            <div className="stat-label">Today&apos;s Calories</div>
            <div className="stat-value" style={{ color: "var(--color-accent)" }}>{totalCal}</div>
            <div className="stat-sub">of {calGoal} kcal</div>
          </div>
        </div>

        <div className="stat-card fade-in-up">
          <div className="stat-label">Protein</div>
          <div className="stat-value" style={{ color: "#8b5cf6" }}>{totalProtein}g</div>
          <div className="stat-sub">target 120g</div>
          <div className="macro-bar" style={{ marginTop: 8 }}>
            <div style={{ width: `${Math.min((totalProtein / 120) * 100, 100)}%`, background: "#8b5cf6" }} />
          </div>
        </div>

        <div className="stat-card fade-in-up">
          <div className="stat-label">Carbs</div>
          <div className="stat-value" style={{ color: "#f59e0b" }}>{totalCarbs}g</div>
          <div className="stat-sub">target 250g</div>
          <div className="macro-bar" style={{ marginTop: 8 }}>
            <div style={{ width: `${Math.min((totalCarbs / 250) * 100, 100)}%`, background: "#f59e0b" }} />
          </div>
        </div>

        <div className="stat-card fade-in-up">
          <div className="stat-label">Meals Planned</div>
          <div className="stat-value" style={{ color: "var(--color-teal)" }}>{weekMealCount}<span style={{ fontSize: "1rem", fontWeight: 600 }}>/21</span></div>
          <div className="stat-sub">this week</div>
        </div>
      </div>

      {/* Two Column: Week Overview + Upcoming */}
      <div className="grid-2col">
        {/* Week Mini View */}
        <div className="glass-card">
          <div className="glass-card-inner">
            <div className="section-header">
              <span className="section-title">Weekly Overview</span>
              <span className="section-action" onClick={() => onNavigate("mealplan")}>View Plan →</span>
            </div>
            <div className="day-selector">
              {DAYS.map((d, i) => {
                const hasMeals = weekPlan[d].some(s => s.mealId);
                return (
                  <div key={d} className={`day-btn ${i === 0 ? "active" : ""} ${hasMeals ? "has-meals" : ""}`}>
                    <span style={{ fontSize: "0.6rem" }}>{d}</span>
                    <span className="day-num">{24 + i}</span>
                  </div>
                );
              })}
            </div>
            {/* Today's meals mini list */}
            <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: 8 }}>
              {todaySlots.map((slot) => {
                const meal = slot.mealId ? meals.find(m => m.id === slot.mealId) : null;
                return (
                  <div key={slot.type} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "8px 10px", borderRadius: 10,
                    background: meal ? "rgba(255,255,255,0.03)" : "transparent",
                    cursor: meal ? "pointer" : "default",
                  }} onClick={() => meal && onOpenMeal(meal.id)}>
                    <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", color: "var(--color-text-dim)", width: 56 }}>
                      {slot.type}
                    </span>
                    {meal ? (
                      <>
                        <span style={{ fontSize: "1.1rem" }}>{meal.image}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-text-secondary)" }}>{meal.name}</span>
                        <span style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-text-dim)" }}>{meal.calories} kcal</span>
                      </>
                    ) : (
                      <span style={{ fontSize: "0.8rem", fontWeight: 500, color: "var(--color-text-dim)", fontStyle: "italic" }}>Not planned</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Meals */}
        <div className="glass-card">
          <div className="glass-card-inner">
            <div className="section-header">
              <span className="section-title">Upcoming Meals</span>
              <span className="section-action" onClick={() => onNavigate("recipes")}>Browse →</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcoming.map((u, i) => (
                <div key={i} className="meal-card" onClick={() => onOpenMeal(u.meal.id)}
                  style={{ padding: "0.75rem", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(0,212,170,0.08))",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", flexShrink: 0,
                  }}>{u.meal.image}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{u.meal.name}</div>
                    <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-text-dim)" }}>
                      {u.day} · {u.type} · {u.meal.calories} kcal
                    </div>
                  </div>
                  <svg width="16" height="16" fill="none" stroke="var(--color-text-dim)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
