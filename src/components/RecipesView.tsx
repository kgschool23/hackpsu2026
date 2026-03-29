"use client";

import { useState, useMemo } from "react";
import { Meal } from "./mockData";

interface RecipesProps {
  meals: Meal[];
  onToggleFav: (id: string) => void;
  onOpenMeal: (id: string) => void;
  onAddMeal: (meal: Meal) => void;
}

const DIET_FILTERS = ["all", "high-protein", "vegetarian", "low-carb", "quick", "keto", "meal-prep"];
const EMOJI_OPTIONS = ["🥗", "🥘", "🥣", "🌮", "🐟", "🥤", "🍝", "🌯", "🍲", "🥩", "🍛", "🥪", "🍜", "🥙", "🍱", "🧆"];
const TAG_OPTIONS = ["high-protein", "vegetarian", "low-carb", "low-fat", "quick", "keto", "meal-prep", "vegan", "gluten-free"];

export default function RecipesView({ meals, onToggleFav, onOpenMeal, onAddMeal }: RecipesProps) {
  const [search, setSearch] = useState("");
  const [dietFilter, setDietFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "calories" | "prepTime">("name");
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  // Create Meal form state
  const [cName, setCName] = useState("");
  const [cEmoji, setCEmoji] = useState("🥗");
  const [cCalories, setCCalories] = useState("");
  const [cProtein, setCProtein] = useState("");
  const [cCarbs, setCCarbs] = useState("");
  const [cFat, setCFat] = useState("");
  const [cPrepTime, setCPrepTime] = useState("");
  const [cTags, setCTags] = useState<string[]>([]);
  const [cIngredients, setCIngredients] = useState("");
  const [cSteps, setCSteps] = useState("");

  const toggleTag = (tag: string) => {
    setCTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    const newMeal: Meal = {
      id: `m-custom-${Date.now()}`,
      name: cName.trim(),
      image: cEmoji,
      calories: parseInt(cCalories) || 0,
      protein: parseInt(cProtein) || 0,
      carbs: parseInt(cCarbs) || 0,
      fat: parseInt(cFat) || 0,
      fiber: 0,
      prepTime: parseInt(cPrepTime) || 0,
      dietTags: cTags,
      ingredients: cIngredients.split(",").map(s => s.trim()).filter(Boolean),
      steps: cSteps.split("\n").map(s => s.trim()).filter(Boolean),
      favorite: false,
    };
    onAddMeal(newMeal);
    // Reset form
    setCName(""); setCEmoji("🥗"); setCCalories(""); setCProtein("");
    setCCarbs(""); setCFat(""); setCPrepTime(""); setCTags([]);
    setCIngredients(""); setCSteps("");
    setShowCreate(false);
  };

  const filtered = useMemo(() => {
    let result = [...meals];
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    if (dietFilter !== "all") result = result.filter(m => m.dietTags.includes(dietFilter));
    if (showFavsOnly) result = result.filter(m => m.favorite);
    result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return a[sortBy] - b[sortBy];
    });
    return result;
  }, [meals, search, dietFilter, sortBy, showFavsOnly]);

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Recipes</h1>
          <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
            Browse recommendations or create your own meals.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(!showCreate)} id="create-meal-btn">
          {showCreate ? "Cancel" : "+ Create Meal"}
        </button>
      </div>

      {/* Create Meal Form */}
      {showCreate && (
        <form onSubmit={handleCreateMeal} className="glass-card scale-in">
          <div className="glass-card-inner" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="section-header">
              <span className="section-title">Create Your Own Meal</span>
            </div>

            {/* Row 1: Emoji + Name */}
            <div style={{ display: "flex", gap: 10, alignItems: "end" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Icon</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {EMOJI_OPTIONS.map(e => (
                    <button key={e} type="button" onClick={() => setCEmoji(e)} style={{
                      width: 36, height: 36, borderRadius: 8, fontSize: "1.2rem",
                      border: cEmoji === e ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                      background: cEmoji === e ? "rgba(255,107,53,0.1)" : "rgba(255,255,255,0.03)",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{e}</button>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Meal Name</label>
                <input className="input-field" placeholder="e.g. My Power Bowl" required
                  value={cName} onChange={e => setCName(e.target.value)} />
              </div>
            </div>

            {/* Row 2: Nutrition */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Nutrition</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { label: "Calories", val: cCalories, set: setCCalories, ph: "520", clr: "var(--color-accent)" },
                  { label: "Protein (g)", val: cProtein, set: setCProtein, ph: "42", clr: "#8b5cf6" },
                  { label: "Carbs (g)", val: cCarbs, set: setCCarbs, ph: "48", clr: "#f59e0b" },
                  { label: "Fat (g)", val: cFat, set: setCFat, ph: "14", clr: "#ec4899" },
                  { label: "Prep (min)", val: cPrepTime, set: setCPrepTime, ph: "25", clr: "var(--color-teal)" },
                ].map(f => (
                  <div key={f.label} style={{ flex: 1, minWidth: 80 }}>
                    <div style={{ fontSize: "0.65rem", fontWeight: 700, color: f.clr, marginBottom: 2 }}>{f.label}</div>
                    <input className="input-field" type="number" min="0" placeholder={f.ph}
                      value={f.val} onChange={e => f.set(e.target.value)} style={{ textAlign: "center" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Tags */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Diet Tags</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {TAG_OPTIONS.map(t => (
                  <button key={t} type="button" className={`pill ${cTags.includes(t) ? "active" : ""}`}
                    onClick={() => toggleTag(t)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Row 4: Ingredients */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Ingredients (comma-separated)</label>
              <input className="input-field" placeholder="e.g. Chicken, Rice, Avocado, Lime"
                value={cIngredients} onChange={e => setCIngredients(e.target.value)} />
            </div>

            {/* Row 5: Steps */}
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Instructions (one step per line)</label>
              <textarea className="input-field" rows={3} placeholder={"Season and grill chicken\nCook rice\nAssemble bowl"}
                value={cSteps} onChange={e => setCSteps(e.target.value)}
                style={{ resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
              ✨ Create Meal
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="search-bar" id="recipe-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input placeholder="Search meals..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {DIET_FILTERS.map(f => (
          <button key={f} className={`pill ${dietFilter === f ? "active" : ""}`} onClick={() => setDietFilter(f)}>
            {f === "all" ? "All" : f}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button className={`pill ${showFavsOnly ? "active" : ""}`} onClick={() => setShowFavsOnly(!showFavsOnly)}
            style={{ color: showFavsOnly ? "#ec4899" : undefined }}>
            ♥ Favorites
          </button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
            style={{
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--color-border)",
              borderRadius: 10, padding: "6px 10px", color: "var(--color-text-secondary)",
              fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", outline: "none",
            }}>
            <option value="name">Name</option>
            <option value="calories">Calories</option>
            <option value="prepTime">Prep Time</option>
          </select>
        </div>
      </div>

      {/* Meal Grid */}
      <div className="grid-meals stagger">
        {filtered.map(m => {
          const totalMacro = m.protein + m.carbs + m.fat;
          return (
            <div key={m.id} className="meal-card fade-in-up" onClick={() => onOpenMeal(m.id)}>
              <div style={{
                height: 120, borderRadius: 12, marginBottom: 10,
                background: "linear-gradient(135deg, rgba(255,107,53,0.08), rgba(0,212,170,0.06))",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem",
              }}>{m.image}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <div className="meal-card-title">{m.name}</div>
                  <div className="meal-card-meta">
                    <span>🔥 {m.calories} kcal</span>
                    <span>⏱ {m.prepTime} min</span>
                  </div>
                </div>
                <button className={`fav-btn ${m.favorite ? "active" : ""}`}
                  onClick={e => { e.stopPropagation(); onToggleFav(m.id); }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={m.favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              {/* Mini tags */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
                {m.dietTags.slice(0, 2).map(t => <span key={t} className="pill" style={{ fontSize: "0.6rem", padding: "2px 6px" }}>{t}</span>)}
              </div>
              {/* Macro bar */}
              {totalMacro > 0 && (
                <div className="macro-bar" style={{ marginTop: 10 }}>
                  <div style={{ width: `${(m.protein / totalMacro) * 100}%`, background: "#8b5cf6" }} />
                  <div style={{ width: `${(m.carbs / totalMacro) * 100}%`, background: "#f59e0b" }} />
                  <div style={{ width: `${(m.fat / totalMacro) * 100}%`, background: "#ec4899" }} />
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "var(--color-text-dim)" }}>
            No meals match your filters. Try creating your own!
          </div>
        )}
      </div>
    </div>
  );
}
