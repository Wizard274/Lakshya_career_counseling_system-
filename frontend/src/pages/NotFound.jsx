// pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import authService from "../services/authService.js";
import { getRoleDashboard } from "../utils/helpers.js";

const NotFound = () => {
  const user = authService.getStoredUser();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-page)",
      padding: 24,
      textAlign: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: "20%", left: "20%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "15%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ fontSize: 80, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>✦</div>

        <div style={{ fontFamily: "var(--font-display)", fontSize: 96, fontWeight: 900, lineHeight: 1, letterSpacing: "-4px", marginBottom: 12, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          404
        </div>

        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: "var(--text-secondary)", marginBottom: 14 }}>
          Page Not Found
        </h2>

        <p style={{ color: "var(--text-muted)", fontSize: 15, marginBottom: 36, maxWidth: 400, lineHeight: 1.7 }}>
          This path doesn't exist on our career map. Let's navigate you back to familiar territory.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to={user ? getRoleDashboard(user.role) : "/login"} className="btn btn-primary btn-lg">
            ✦ Go to Dashboard
          </Link>
          <button className="btn btn-glass btn-lg" onClick={() => window.history.back()}>
            ← Go Back
          </button>
        </div>
      </div>

      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
    </div>
  );
};

export default NotFound;
