// ============================================
// context/ThemeContext.jsx - NEW
// Dark mode toggle with system preference support
// ============================================

import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

// ── Provider component ────────────────────────────────────
export const ThemeProvider = ({ children }) => {
  // Check saved preference, then system preference
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("app_theme");
    if (saved) return saved === "dark";
    // Use system preference as default
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to <html> element whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute("data-theme", "dark");
    } else {
      root.removeAttribute("data-theme");
    }
    localStorage.setItem("app_theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ── Custom hook ───────────────────────────────────────────
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};

export default ThemeContext;
