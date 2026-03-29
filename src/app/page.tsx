"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import type { ScheduleResponse, InventoryItem, CriticalPathMeal } from "@/types/schedule";

// ────────────────────────────────────────────────────────
// COLOR MAPPING & ICONS
// ────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  fresh: "var(--color-status-fresh)",
  warning: "var(--color-status-warning)",
  critical: "var(--color-status-critical)",
};

const ICONS = {
  home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>,
  tutorial: <><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></>,
  pantry: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></>,
  analytics: <><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></>,
  dashboard: <><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></>,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"home" | "tutorial" | "pantry" | "analytics" | "dashboard">("home");
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Global State Manager
  const refreshData = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/schedule")
      .then((res) => res.json())
      .then((json: ScheduleResponse) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch engine data:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSimulateRun = () => {
    setLoading(true);
    fetch("http://localhost:8000/api/inventory/seed", { method: "POST" })
      .then((res) => res.json())
      .then(setData)
      .finally(() => {
        setLoading(false);
        setActiveTab("dashboard");
      });
  };

  const handleDelete = (id: string) => {
    fetch(`http://localhost:8000/api/inventory/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(setData);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-[5vh] font-sans text-[var(--color-text-primary)] relative z-10 w-full overflow-hidden">
      
      {/* ── UNIFIED GLASS PANEL WITH SIDE NAV ── */}
      <div className="unified-glass-panel flex w-full max-w-[1800px] h-full min-h-[90vh] animate-fade-in-up">
        
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-[80px] md:w-[280px] flex flex-col items-center md:items-start py-8 md:p-8 border-r border-[rgba(255,255,255,0.4)] bg-[rgba(255,255,255,0.15)] relative z-20">
          
          <div className="flex items-center gap-4 mb-14 px-0 md:px-2 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 shadow-[0_4px_16px_rgba(79,70,229,0.3)] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <span className="hidden md:block text-2xl font-black tracking-tight text-indigo-950">PrepSmart</span>
          </div>
          
          <nav className="flex flex-col gap-8 w-full mt-4">
            <SidebarBtn icon={ICONS.home} label="Overview" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
            <SidebarBtn icon={ICONS.tutorial} label="How it Works" active={activeTab === "tutorial"} onClick={() => setActiveTab("tutorial")} />
            <div className="w-full h-px bg-indigo-900/10 my-2"></div>
            <SidebarBtn icon={ICONS.pantry} label="My Fridge" active={activeTab === "pantry"} onClick={() => setActiveTab("pantry")} />
            <SidebarBtn icon={ICONS.analytics} label="Savings Impact" active={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
            <SidebarBtn icon={ICONS.dashboard} label="Meal Plan" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} />
          </nav>
          
          <div className="mt-auto w-full pt-12 pb-6">
            <button 
              onClick={handleSimulateRun} 
              className="w-full hidden md:flex btn-secondary items-center justify-center gap-3 py-4 text-sm group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:rotate-12 transition-transform">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              Simulate Grocery Run
            </button>
            <button 
              onClick={() => setActiveTab("dashboard")} 
              className="w-full hidden mt-4 md:flex btn-glass items-center justify-center gap-3 py-5"
            >
              See Meal Plan
            </button>
          </div>
        </aside>

        {/* ── ROUTING CONTENT ── */}
        <main className="flex-1 w-full relative overflow-y-auto overflow-x-hidden p-6 md:p-12">
          {activeTab === "home" && <HomeView onNavigate={setActiveTab} />}
          {activeTab === "tutorial" && <TutorialView onNavigate={setActiveTab} />}
          {activeTab === "pantry" && <PantryView data={data} loading={loading} onDelete={handleDelete} />}
          {activeTab === "analytics" && <AnalyticsView data={data} />}
          {activeTab === "dashboard" && <DashboardEngine data={data} setData={setData} loading={loading} />}
        </main>

      </div>
    </div>
  );
}

// ==========================================
// SUBCOMPONENTS
// ==========================================

function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex items-center md:px-8 py-5 rounded-2xl transition-all ${active ? "bg-white/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),0_4px_12px_rgba(31,38,135,0.05)] text-indigo-900" : "hover:bg-white/20 text-indigo-800/70 hover:text-indigo-900"}`}
    >
      <div className={`w-full flex items-center justify-center md:justify-start gap-4`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          {icon}
        </svg>
        <span className={`hidden md:block text-lg font-bold tracking-wide ${active ? "opacity-100" : "opacity-80"}`}>{label}</span>
      </div>
      {active && <div className="hidden md:block absolute left-0 w-[4px] h-3/5 bg-indigo-600 rounded-r-lg"></div>}
    </button>
  );
}

// ==========================================
// PANTRY VIEW (CRUD)
// ==========================================
function PantryView({ data, loading, onDelete }: { data: ScheduleResponse | null, loading: boolean, onDelete: (id: string) => void }) {
  if (loading) return <LoadingSpinner />;
  const inventory = data?.inventory || [];

  return (
    <div className="animate-fade-in-up w-full max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-12 border-b border-indigo-900/10 pb-6">
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-950 tracking-tighter drop-shadow-sm mb-2">My Fridge</h2>
          <p className="text-indigo-800/80 font-bold">Keep track of all your fresh ingredients ({inventory.length} total items).</p>
        </div>
      </div>
      
      {inventory.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-60">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-4">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <span className="text-2xl font-black tracking-widest uppercase">Fridge is Empty</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {inventory.map((item) => (
            <div key={item.id} className="bento-card p-6 flex flex-col items-start relative group hover:scale-[1.02] transition-transform">
              <button 
                onClick={() => onDelete(item.id)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 text-indigo-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600 shadow-[0_4px_10px_rgba(0,0,0,0.05)]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
              
              <div className="text-xs font-black tracking-widest uppercase mb-3 flex items-center gap-2">
                 <span className={`status-indicator status-indicator--${item.status}`}></span>
                 {item.status}
              </div>
              <h3 className="text-xl font-extrabold text-indigo-950 mb-4">{item.name}</h3>
              <div className="mt-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-xs font-bold text-indigo-800 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                Expires in: {item.days_to_live} {item.days_to_live === 1 ? 'Day' : 'Days'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ANALYTICS VIEW
// ==========================================
function AnalyticsView({ data }: { data: ScheduleResponse | null }) {
  if (!data) return <LoadingSpinner />;
  
  const inv = data.inventory;
  const critical = inv.filter(i => i.status === "critical").length;
  const warning = inv.filter(i => i.status === "warning").length;
  const fresh = inv.filter(i => i.status === "fresh").length;
  
  // Fake calculation metrics for wow-factor
  const estValueSaved = inv.length * 4.25; 
  const wastePercent = data.critical_path.length === 0 && inv.length > 0 ? 100 : 0;

  const chartData = [
    { name: "Critical (<2d)", items: critical, fill: "var(--color-status-critical)" },
    { name: "Warning (3-5d)", items: warning, fill: "var(--color-status-warning)" },
    { name: "Fresh (>5d)", items: fresh, fill: "var(--color-status-fresh)" }
  ];

  return (
    <div className="animate-fade-in-up w-full max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-10 border-b border-indigo-900/10 pb-6">
        <h2 className="text-4xl font-extrabold text-indigo-950 tracking-tighter drop-shadow-sm mb-2">Your Savings Impact</h2>
        <p className="text-indigo-800/80 font-bold">See how much money you save by following your optimized meal plan.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bento-card p-8 flex flex-col border-l-4 border-l-pink-500">
          <span className="text-xs font-black text-indigo-600 tracking-widest uppercase mb-2">Money Saved This Week</span>
          <span className="text-5xl font-black text-indigo-950">${estValueSaved.toFixed(2)}</span>
        </div>
        <div className="bento-card p-8 flex flex-col border-l-4 border-l-indigo-500">
          <span className="text-xs font-black text-indigo-600 tracking-widest uppercase mb-2">Wasted Food %</span>
          <span className={`text-5xl font-black ${wastePercent === 0 ? 'text-emerald-500' : 'text-red-500'}`}>{wastePercent}%</span>
        </div>
        <div className="bento-card p-8 flex flex-col border-l-4 border-l-cyan-500">
          <span className="text-xs font-black text-indigo-600 tracking-widest uppercase mb-2">Items in Fridge</span>
          <span className="text-5xl font-black text-indigo-950">{inv.length}</span>
        </div>
      </div>
      
      <div className="bento-card p-8 flex-1 w-full min-h-[400px]">
        <h3 className="text-xl font-black text-indigo-900 mb-8 tracking-tight">Fridge Freshness Breakdown</h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 5 }} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.4)" />
            <XAxis type="number" stroke="rgba(30, 27, 75, 0.4)" fontSize={12} fontWeight={700} />
            <YAxis dataKey="name" type="category" stroke="rgba(30, 27, 75, 0.8)" fontSize={12} fontWeight={800} width={120} />
            <Tooltip 
              cursor={{fill: "rgba(255,255,255,0.4)"}}
              contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', fontWeight: 'bold', color: '#1e1b4b' }} 
            />
            <Bar dataKey="items" radius={[0, 8, 8, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==========================================
// DASHBOARD ENGINE
// ==========================================
function DashboardEngine({ data, setData, loading }: { data: ScheduleResponse | null, setData: any, loading: boolean }) {
  const [ingredientName, setIngredientName] = useState("");
  const [ttlDays, setTtlDays] = useState("");
  const [expandedBlock, setExpandedBlock] = useState<number | null>(null);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(ttlDays, 10);
    if (!ingredientName || isNaN(days)) return;

    fetch("http://localhost:8000/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: ingredientName, days_to_live: days }),
    })
      .then((res) => res.json())
      .then((json: ScheduleResponse) => {
        setData(json);
        setIngredientName("");
        setTtlDays("");
      })
      .catch(console.error);
  };

  const handleClearEverything = () => {
    fetch("http://localhost:8000/api/inventory", { method: "DELETE" })
      .then((res) => res.json())
      .then(setData);
  }

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in-up">
      {/* ── LEFT: INPUT FORM ── */}
      <section className="bento-card xl:col-span-4 p-8 flex flex-col gap-6 relative" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.4)] pb-5">
           <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/50 bg-indigo-50 text-indigo-600">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            <h2 className="text-xl font-extrabold text-indigo-950 tracking-tight">Add New Item</h2>
          </div>
          <button onClick={handleClearEverything} className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-full transition-colors border border-red-200">Clear Fridge</button>
        </div>
        
        <form onSubmit={handleAddIngredient} className="flex flex-col gap-8 flex-1 mt-4">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black text-indigo-800 uppercase tracking-widest pl-2">Ingredient Name</label>
            <input type="text" required value={ingredientName} onChange={(e) => setIngredientName(e.target.value)} placeholder="e.g. Avocado" className="input-glass" />
          </div>
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black text-indigo-800 uppercase tracking-widest pl-2">Days Until Expiration</label>
            <input type="number" required min="1" value={ttlDays} onChange={(e) => setTtlDays(e.target.value)} placeholder="e.g. 3" className="input-glass" />
          </div>
          <div className="mt-auto pt-6 border-t border-[rgba(255,255,255,0.4)]">
            <button type="submit" className="btn-glass w-full flex items-center justify-center gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add to Fridge
            </button>
          </div>
        </form>
      </section>

      {/* ── RIGHT: TIMELINE ── */}
      <section className="bento-card xl:col-span-8 p-8 flex flex-col h-[650px] xl:h-[750px] overflow-hidden relative" style={{ animationDelay: "200ms" }}>
        <div className="flex flex-col gap-1 border-b border-[rgba(255,255,255,0.4)] pb-5 mb-6 z-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/50 bg-[var(--color-secondary)] text-white">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            </div>
            <h2 className="text-xl font-extrabold text-indigo-950 tracking-tight">Your Optimized Meal Plan</h2>
          </div>
          <span className="text-[0.75rem] text-indigo-600 font-black uppercase tracking-widest pl-14">Follow this schedule strictly to prevent all food waste.</span>
        </div>
        
        <div className="flex-1 overflow-y-auto pr-4 mr-[-8px] flex flex-col gap-10 pb-8 pt-4">
          {!data || data.critical_path.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6 opacity-90 pt-10">
              <div className="w-24 h-24 rounded-[30px] bg-red-100/50 backdrop-blur-md flex items-center justify-center border-4 border-white shadow-[0_8px_30px_rgba(239,68,68,0.2)]">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-status-critical)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
              </div>
              <div>
                <h3 className="text-3xl font-black text-indigo-950">Need More Ingredients!</h3>
                <p className="text-sm font-bold text-red-600 mt-2 uppercase tracking-widest bg-red-50/50 inline-block px-4 py-2 rounded-full border border-red-200">Add a few more items to your fridge to generate a full weekly plan.</p>
              </div>
            </div>
          ) : (
            data.critical_path.map((meal, idx, arr) => {
              const isExpanded = expandedBlock === idx;
              return (
                <div key={idx} className="relative pl-12 animate-fade-in-up" style={{ animationDelay: `${200 + (idx * 50)}ms` }}>
                  <div className="absolute left-[3px] top-6 -translate-y-1/2 timeline-dot z-20"></div>
                  {idx !== arr.length - 1 && <div className="timeline-line absolute left-[11px] top-6 bottom-[-40px] w-1 bg-white/80 z-0"></div>}
                  
                  <div 
                    onClick={() => setExpandedBlock(isExpanded ? null : idx)}
                    className="cursor-pointer bg-[rgba(255,255,255,0.6)] backdrop-blur-md border border-[rgba(255,255,255,0.9)] rounded-[20px] transition-all hover:bg-white/90 hover:shadow-[0_8px_30px_rgba(31,38,135,0.1)] group text-left w-full relative overflow-hidden"
                  >
                    {/* Header Summary */}
                    <div className="p-6">
                      <div className="text-[0.8rem] font-black text-indigo-500 tracking-widest mb-1.5 uppercase flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-indigo-500"></span> Day {meal.day}
                        </div>
                        <svg className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      <div className="text-2xl font-black text-indigo-950 leading-tight mb-4 tracking-tight">
                        {meal.meal_name}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {meal.consumed_ingredients.map((ing, i) => (
                          <span key={i} className="text-[0.7rem] uppercase font-black tracking-widest bg-white border border-white/60 text-indigo-800 px-3 py-1.5 rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.03)]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Collapsible Recipe Details */}
                    {isExpanded && meal.description && (
                      <div className="px-6 py-6 border-t border-indigo-900/10 bg-indigo-50/50">
                        <div className="flex items-center gap-6 mb-4">
                          <div className="flex items-center gap-2 text-indigo-900">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                             <span className="font-extrabold text-sm">{meal.prep_time} Min Prep</span>
                          </div>
                          <div className="flex items-center gap-2 text-indigo-900">
                             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                             <span className="font-extrabold text-sm">{meal.calories} Cals</span>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-indigo-800/80 leading-relaxed whitespace-pre-line bg-white/60 p-4 rounded-xl border border-white shadow-sm">
                           {meal.description}
                        </div>
                        <button className="mt-4 w-full bg-indigo-600 text-white font-black text-sm uppercase tracking-widest py-3 rounded-xl hover:bg-indigo-700 transition-colors">
                           Mark as Cooked
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

    </div>
  );
}

// ==========================================
// OTHER VIEWS
// ==========================================
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-[50vh] w-full animate-fade-in-up">
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-full border-[6px] border-[rgba(255,255,255,0.4)] border-t-indigo-600 animate-spin"></div>
        <span className="text-indigo-900 font-black tracking-widest text-sm uppercase">Generating Meal Plan...</span>
      </div>
    </div>
  );
}

function HomeView({ onNavigate }: { onNavigate: (v: "dashboard" | "tutorial") => void }) {
  return (
    <div className="h-full w-full flex items-center animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-8 pl-4 pr-12 z-10 items-start">
          <div className="inline-block px-4 py-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/60 shadow-[0_4px_12px_rgba(31,38,135,0.05)] text-sm font-bold text-indigo-700 tracking-widest uppercase mb-4">
            Save Money, Prevent Waste
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-indigo-950 leading-[1.1] tracking-tighter drop-shadow-sm">
            Intelligent <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Meal Planning</span>
          </h1>
          <p className="text-indigo-900/80 font-medium text-lg md:text-xl leading-relaxed max-w-xl">
            Stop throwing away expired groceries. Simply tell us what's in your fridge, and our smart engine generates the perfect weekly meal schedule designed to use every ingredient right before it goes bad.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6">
            <button onClick={() => onNavigate("dashboard")} className="btn-glass w-full sm:w-auto px-10">
              Get Organized
            </button>
            <button onClick={() => onNavigate("tutorial")} className="btn-secondary w-full sm:w-auto px-10">
              Read Docs
            </button>
          </div>
        </div>
        
        <div className="relative flex justify-center lg:justify-end animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <div className="w-full max-w-[600px] aspect-square relative flex items-center justify-center pr-8 lg:pr-0">
              <img 
                src="/glossy_3d_hero.png" 
                alt="Glossy 3D Hero Graphic" 
                className="w-[120%] h-[120%] object-contain absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_20px_40px_rgba(31,38,135,0.2)] hover:scale-105 transition-transform duration-700 hover:rotate-2"
              />
            </div>
            {/* Context Floating Cards */}
            <div className="absolute top-10 left-10 bento-card p-4 rounded-2xl md:flex hidden floating-element" style={{ animationDuration: '4s' }}>
                <span className="text-2xl font-black text-indigo-600">0%</span>
                <span className="text-sm font-bold text-indigo-900/70 ml-2 mt-1 uppercase tracking-widest">Waste</span>
            </div>
        </div>
      </div>
    </div>
  );
}

function TutorialView({ onNavigate }: { onNavigate: (v: "dashboard") => void }) {
  return (
    <div className="p-8 w-full max-w-4xl mx-auto animate-fade-in-up pt-12">
      <div className="mb-14 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-950 mb-4 tracking-tighter drop-shadow-sm">How PrepSmart Works</h2>
        <p className="text-indigo-900/70 font-bold text-lg max-w-xl mx-auto">We make saving money and preventing food waste incredibly simple.</p>
      </div>
      
      <div className="flex flex-col gap-8">
        <div className="bento-card p-8 hover:bg-white/50 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-black rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_16px_rgba(79,70,229,0.3)]">1</div>
            <div>
              <h3 className="text-2xl font-extrabold text-indigo-950 mb-2 tracking-tight">Log Your Groceries</h3>
              <p className="text-indigo-800/80 leading-relaxed font-medium">Just tell us what you bought and roughly how many days it stays fresh in your fridge.</p>
            </div>
          </div>
        </div>
        
        <div className="bento-card p-8 hover:bg-white/50 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-pink-400 to-pink-600 text-white font-black rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_16px_rgba(236,72,153,0.3)]">2</div>
            <div>
              <h3 className="text-2xl font-extrabold text-indigo-950 mb-2 tracking-tight">We Do The Math</h3>
              <p className="text-indigo-800/80 leading-relaxed font-medium">Our smart algorithm scans millions of combinations to find the absolute perfect order to cook your meals.</p>
            </div>
          </div>
        </div>
        
        <div className="bento-card p-8 hover:bg-white/50 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-14 h-14 shrink-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white font-black rounded-2xl flex items-center justify-center text-2xl shadow-[0_8px_16px_rgba(56,189,248,0.3)]">3</div>
            <div>
              <h3 className="text-2xl font-extrabold text-indigo-950 mb-2 tracking-tight">Cook & Save</h3>
              <p className="text-indigo-800/80 leading-relaxed font-medium">Follow your custom weekly meal plan. Every ingredient gets used right before it goes bad, saving you hundreds of dollars!</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <button onClick={() => onNavigate("dashboard")} className="btn-glass px-12 py-5 text-xl">
          Start Planning →
        </button>
      </div>
    </div>
  );
}
