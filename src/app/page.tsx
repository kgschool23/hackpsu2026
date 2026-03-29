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
} from "recharts";
import type { ScheduleResponse, InventoryItem } from "@/types/schedule";

// ────────────────────────────────────────────────────────
// COLOR MAPPING
// ────────────────────────────────────────────────────────
const STATUS_COLORS: Record<string, string> = {
  fresh: "var(--color-neon-green)",
  warning: "var(--color-neon-yellow)",
  critical: "var(--color-neon-red)",
};

export default function DashboardPage() {
  const [data, setData] = useState<ScheduleResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [ingredientName, setIngredientName] = useState("");
  const [ttlDays, setTtlDays] = useState("");

  useEffect(() => {
    fetch("/api/schedule")
      .then((res) => res.json())
      .then((json: ScheduleResponse) => {
        setData(json);
        setLoading(false);
      });
  }, []);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(
      `[CRITICAL PATH] Added new ingredient: ${ingredientName} | TTL: ${ttlDays} days`
    );
    setIngredientName("");
    setTtlDays("");
  };

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <span className="text-[var(--color-neon-green)] text-xl cursor-blink">
          INITIALIZING ECP SYSTEM
        </span>
      </div>
    );
  }

  // Prep Recharts data
  const chartData = data.inventory.map((item) => ({
    ...item,
    fill: STATUS_COLORS[item.status] || STATUS_COLORS.fresh,
  }));

  return (
    <main className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8 flex-1">
      <header className="border-b border-[var(--color-border)] pb-4 fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight uppercase">
          ECP <span className="text-[var(--color-neon-cyan)]">//</span> Expiration Critical Path
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          SYSTEM_TIME: {new Date(data.generated_at).toLocaleString()}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* ── LEFT COLUMN ── */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* CONTROL PANEL */}
          <section className="panel p-5 fade-in-up" style={{ animationDelay: "100ms" }}>
            <h2 className="text-xl font-bold text-[var(--color-neon-green)] mb-4 flex items-center gap-2">
              <span className="status-dot status-dot--fresh"></span>
              CONTROL_PANEL.EXE
            </h2>
            <form onSubmit={handleAddIngredient} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1">
                <label className="text-xs text-[var(--color-text-dim)] uppercase">
                  Ingredient Name
                </label>
                <input
                  type="text"
                  required
                  value={ingredientName}
                  onChange={(e) => setIngredientName(e.target.value)}
                  placeholder="e.g. Tofu"
                  className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 focus:outline-none focus:border-[var(--color-neon-green)]"
                />
              </div>
              <div className="w-full sm:w-32 flex flex-col gap-1">
                <label className="text-xs text-[var(--color-text-dim)] uppercase">
                  TTL (Days)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={ttlDays}
                  onChange={(e) => setTtlDays(e.target.value)}
                  placeholder="e.g. 5"
                  className="bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-primary)] p-2 focus:outline-none focus:border-[var(--color-neon-green)]"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[var(--color-border)] hover:bg-[var(--color-neon-green)] hover:text-black font-bold text-white px-6 py-2 transition-colors border border-[var(--color-border-dim)]"
                >
                  ADD_ENTRY()
                </button>
              </div>
            </form>
          </section>

          {/* SYSTEM INVENTORY (CHART) */}
          <section className="panel p-5 h-[500px] flex flex-col fade-in-up" style={{ animationDelay: "200ms" }}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[var(--color-text-primary)]">
              <span className="w-2 h-2 bg-[var(--color-neon-cyan)] block"></span>
              SYSTEM_INVENTORY
            </h2>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={true}
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    type="number"
                    domain={[0, 14]}
                    stroke="var(--color-text-dim)"
                    tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                    tickCount={15}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--color-text-dim)"
                    tick={{ fill: "var(--color-text-secondary)", fontSize: 12 }}
                    width={120}
                  />
                  <Tooltip
                    cursor={{ fill: "var(--color-bg-surface)" }}
                    contentStyle={{
                      backgroundColor: "var(--color-bg-panel)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0px",
                    }}
                    itemStyle={{ color: "var(--color-text-primary)" }}
                    formatter={(value: number, name: string, props: { payload: InventoryItem }) => {
                      return [`${value} days`, `Status: ${props.payload.status.toUpperCase()}`];
                    }}
                    labelStyle={{ display: "none" }}
                  />
                  <Bar dataKey="days_to_live" barSize={16}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <div className="flex items-center gap-1.5"><span className="status-dot status-dot--critical"></span> CRITICAL</div>
              <div className="flex items-center gap-1.5"><span className="status-dot status-dot--warning"></span> WARNING</div>
              <div className="flex items-center gap-1.5"><span className="status-dot status-dot--fresh"></span> FRESH</div>
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:col-span-1 border-l-0 lg:border-l border-[var(--color-border)] lg:pl-6 space-y-4 fade-in-up" style={{ animationDelay: "300ms" }}>
          <h2 className="text-xl font-bold tracking-tight bg-[var(--color-bg-surface)] p-2 border border-[var(--color-border)] inline-block">
            TERMINAL_OUTPUT
          </h2>
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-secondary)] mb-2 inline-block ml-4 cursor-blink">
            Executing sequence...
          </div>
          
          <div className="space-y-4 font-mono text-sm pl-4 relative before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-[var(--color-border)]">
            {data.critical_path.map((meal, idx) => (
              <div key={idx} className="relative before:absolute before:-left-4 before:top-2 before:w-3 before:h-px before:bg-[var(--color-border)]">
                <div className="text-[var(--color-neon-yellow)] font-bold mb-1">
                  [&gt;] DAY {meal.day.toString().padStart(2, "0")}: {meal.meal_name.toUpperCase()}
                </div>
                <div className="text-[var(--color-text-dim)] pl-6">
                  TARGETS_ACQUIRED:
                  <ul className="list-disc list-inside mt-1 ml-2 text-[var(--color-text-secondary)] space-y-1">
                    {meal.consumed_ingredients.map((ing, i) => (
                      <li key={i}>{ing.toUpperCase()}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
