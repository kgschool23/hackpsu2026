"use client";

import { useState } from "react";
import { GroceryItem } from "./mockData";

interface GroceryProps {
  items: GroceryItem[];
  setItems: (items: GroceryItem[]) => void;
}

const CATEGORY_OPTIONS = ["Produce", "Protein", "Dairy", "Grains", "Pantry", "Frozen", "Beverages", "Snacks", "Other"];

export default function GroceryView({ items, setItems }: GroceryProps) {
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("1");
  const [newCategory, setNewCategory] = useState("Produce");
  const [showForm, setShowForm] = useState(false);

  const toggleCheck = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
  };
  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newItem: GroceryItem = {
      id: `g-manual-${Date.now()}`,
      name: newName.trim(),
      qty: newQty || "1",
      category: newCategory,
      checked: false,
    };
    setItems([...items, newItem]);
    setNewName("");
    setNewQty("1");
  };

  const categories = [...new Set(items.map(i => i.category))];
  const checkedCount = items.filter(i => i.checked).length;
  const pct = items.length ? Math.round((checkedCount / items.length) * 100) : 0;

  return (
    <div className="fade-in-up" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>Grocery List</h1>
          <p style={{ color: "var(--color-text-dim)", fontWeight: 500, fontSize: "0.9rem" }}>
            Auto-generated from your meal plan, or add items manually.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="add-grocery-btn">
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {/* Add Item Form */}
      {showForm && (
        <form onSubmit={addItem} className="glass-card scale-in">
          <div className="glass-card-inner">
            <div className="section-header">
              <span className="section-title">Add Grocery Item</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "end" }}>
              <div style={{ flex: 2, minWidth: 160 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item Name</label>
                <input className="input-field" placeholder="e.g. Bananas, Olive Oil" required
                  value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div style={{ width: 80 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Qty</label>
                <input className="input-field" placeholder="1" value={newQty} onChange={e => setNewQty(e.target.value)} />
              </div>
              <div style={{ flex: 1, minWidth: 130 }}>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-text-dim)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</label>
                <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}
                  style={{ background: "rgba(255,255,255,0.04)", cursor: "pointer" }}>
                  {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <button type="submit" className="btn btn-primary" style={{ whiteSpace: "nowrap" }}>
                Add to List
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Progress */}
      <div className="stat-card" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--color-text-secondary)" }}>Shopping Progress</span>
            <span style={{ fontSize: "0.8rem", fontWeight: 800, color: "var(--color-teal)" }}>{pct}%</span>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: "linear-gradient(90deg, var(--color-teal), #33e0be)", borderRadius: 4, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", marginTop: 4 }}>
            {checkedCount} of {items.length} items
          </div>
        </div>
      </div>

      {/* By Category */}
      {categories.map(cat => {
        const catItems = items.filter(i => i.category === cat);
        return (
          <div key={cat} className="glass-card">
            <div className="glass-card-inner">
              <div className="section-header">
                <span className="section-title" style={{ fontSize: "0.95rem" }}>{cat}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--color-text-dim)", fontWeight: 600 }}>
                  {catItems.filter(i => i.checked).length}/{catItems.length}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {catItems.map(item => (
                  <div key={item.id} className="grocery-item">
                    <button
                      className={`grocery-check ${item.checked ? "checked" : ""}`}
                      onClick={() => toggleCheck(item.id)}
                    >
                      {item.checked && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <span className={`grocery-text ${item.checked ? "checked" : ""}`} style={{ flex: 1 }}>
                      {item.name}
                    </span>
                    {item.qty !== "1" && (
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "var(--color-text-dim)", background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 6 }}>
                        ×{item.qty}
                      </span>
                    )}
                    <button onClick={() => removeItem(item.id)} style={{
                      background: "none", border: "none", color: "var(--color-text-dim)",
                      cursor: "pointer", padding: 4, borderRadius: 6, fontSize: "0.8rem",
                    }}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <div className="glass-card" style={{ textAlign: "center", padding: "3rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🛒</div>
          <div style={{ color: "var(--color-text-dim)", fontWeight: 600 }}>
            Your grocery list is empty. Plan some meals or click <strong>&quot;+ Add Item&quot;</strong> above to get started!
          </div>
        </div>
      )}
    </div>
  );
}
