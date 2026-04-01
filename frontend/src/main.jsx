// ============================================
// main.jsx - LanguageProvider removed
// Only ThemeProvider kept
// ============================================

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Theme context only
import { ThemeProvider } from "./context/ThemeContext.jsx";

// Global styles
import "./styles/global.css";
import "./styles/navbar.css";
import "./styles/auth.css";
import "./styles/dashboard.css";
import "./styles/darkmode.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
