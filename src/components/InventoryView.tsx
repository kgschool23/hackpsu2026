"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import type { ScheduleResponse, InventoryItem } from "@/types/schedule";

const STATUS_COLORS: Record<string, string> = {
  fresh: "#34d399",
  warning: "#fbbf24",
  critical: "#fb7185",
};

export default function InventoryView() {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [ingredientName, setIngredientName] = useState("");
  const [ttlDays, setTtlDays] = useState("");

  const fetchSchedule = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/schedule");
      if (!res.ok) throw new Error("Fetch failed");
      const json: ScheduleResponse = await res.json();
      setData(json);
      setError(false);
    } catch {
      // Try the Next.js mock route as fallback
      try {
        const res = await fetch("/api/schedule");
        if (!res.ok) throw new Error("Fetch failed");
        const json: ScheduleResponse = await res.json();
        setData(json);
        setError(false);
      } catch {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSchedule(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: ingredientName, days_to_live: parseInt(ttlDays, 10) }),
      });
      if (!res.ok) throw new Error("Failed");
      setIngredientName(""); setTtlDays("");
      fetchSchedule();
    } catch { setError(true); }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/inventory/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      fetchSchedule();
    } catch { setError(true); }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
      <div style={{ width: 40, height: 40, border: "3px solid rgba(255,107,53,0.2)", borderTopColor: "var(--color-accent)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !data) return (
    <div className="glass-card fade-in-up" style={{ textAlign: "center", padding: "3rem" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>⚠️</div>
      <h2 style={{ fontWeight: 800, marginBottom: 4 }}>Backend Offline</h2>
      <p style={{ color: "var(--color-text-dim)", fontSize: "0.9rem" }}>
        Could not reach the backend on port 8000. Start it with <code>uvicorn main:app --reload</code>
      </p>
    </div>
  );

  const chartData = data.inventory.map((item) => ({
    ...item,
    fill: STATUS_COLORS[item.status] || STATUS_COLORS.fresh,
  }));

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Pantry Inventory</h1>
        <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
          Track expiration dates and get AI-optimized meal schedules.
        </p>
      </div>

      {/* Add Form */}
      <div className="glass-card">
        <div className="glass-card-inner">
          <div className="section-header">
            <span className="section-title">Add Item</span>
          </div>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input className="input-field" style={{ flex: 2, minWidth: 180 }} placeholder="e.g. Fresh Milk"
              required value={ingredientName} onChange={e => setIngredientName(e.target.value)} />
            <input className="input-field" style={{ flex: 1, minWidth: 100 }} type="number" min="1"
              placeholder="Days left" required value={ttlDays} onChange={e => setTtlDays(e.target.value)} />
            <button type="submit" className="btn btn-primary">Add to Pantry</button>
          </form>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card">
        <div className="glass-card-inner">
          <div className="section-header">
            <span className="section-title">Expiration Timeline</span>
            <div style={{ display: "flex", gap: 12, fontSize: "0.75rem", fontWeight: 700 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fb7185", display: "inline-block" }} /> Critical</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24", display: "inline-block" }} /> Soon</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block" }} /> Fresh</span>
            </div>
          </div>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="8 8" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 'dataMax + 2']} stroke="#64748b"
                  tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b"
                  tick={{ fill: "#cbd5e1", fontSize: 12, fontWeight: 700 }} width={110} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }}
                  contentStyle={{ backgroundColor: "rgba(12,12,20,0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px" }}
                  itemStyle={{ color: "#f8fafc", fontWeight: 700 }}
                  formatter={(value: number, _name: string, props: { payload: InventoryItem }) => [`${value} days`, `${props.payload.status.toUpperCase()}`]}
                  labelStyle={{ display: "none" }} />
                <Bar dataKey="days_to_live" barSize={24} radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Item List */}
      <div className="glass-card">
        <div className="glass-card-inner">
          <div className="section-header">
            <span className="section-title">Manage Items</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 }}>
            {data.inventory.map(item => (
              <div key={item.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 12px", borderRadius: 12,
                background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)",
                transition: "all 0.2s",
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem" }}>{item.name}</div>
                  <span className={`status-badge ${item.status}`}>{item.days_to_live}d · {item.status}</span>
                </div>
                <button onClick={() => handleDelete(item.id)} style={{
                  background: "none", border: "none", color: "var(--color-text-dim)",
                  cursor: "pointer", padding: 6, borderRadius: 8,
                }}>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Path Schedule */}
      {data.critical_path.length > 0 && (
        <div className="glass-card">
          <div className="glass-card-inner">
            <div className="section-header">
              <span className="section-title">🧠 AI Meal Schedule</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.critical_path.map((meal, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "start", gap: 12,
                  padding: "12px", borderRadius: 14,
                  background: "rgba(255,255,255,0.03)", border: "1px solid var(--color-border)",
                }}>
                  <div style={{
                    fontWeight: 900, fontSize: "0.75rem", color: "var(--color-accent)",
                    background: "rgba(255,107,53,0.1)", padding: "4px 10px", borderRadius: 8,
                    border: "1px solid rgba(255,107,53,0.2)", whiteSpace: "nowrap",
                  }}>DAY {String(meal.day).padStart(2, "0")}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 4 }}>{meal.meal_name}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {meal.consumed_ingredients.map(ing => (
                        <span key={ing} style={{
                          padding: "3px 8px", borderRadius: 8, fontSize: "0.7rem", fontWeight: 600,
                          background: "rgba(0,212,170,0.08)", border: "1px solid rgba(0,212,170,0.15)", color: "var(--color-teal-light)",
                        }}>{ing}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
