"use client";

import React from "react";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "mealplan", label: "Meal Plan", icon: "calendar" },
  { id: "recipes", label: "Recipes", icon: "book" },
  { id: "grocery", label: "Grocery List", icon: "cart" },
  { id: "todaymeals", label: "Today's Meals", icon: "utensils" },
  { id: "inventory", label: "Inventory", icon: "box" },
];

const ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  book: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  cart: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
    </svg>
  ),
  utensils: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v6m0 0c0 2-2 3-2 5v9m2-14c0 2 2 3 2 5v9M6 2c0 3-2 5-2 8a2 2 0 002 2h0a2 2 0 002-2c0-3-2-5-2-8m0 10v10" />
    </svg>
  ),
  box: (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🍽</div>
          <h1>PrepSmart</h1>
        </div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              className={`sidebar-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span className="sidebar-icon">{ICONS[item.icon]}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        <div className="bottom-nav-inner">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <button
              key={item.id}
              className={`bottom-nav-item ${activeView === item.id ? "active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              {ICONS[item.icon]}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
