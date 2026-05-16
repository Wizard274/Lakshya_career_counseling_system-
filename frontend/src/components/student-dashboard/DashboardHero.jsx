import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const DashboardHero = memo(({ user, readinessScore }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="dash-hero"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="hero-blob" style={{ top: "-50%", left: "-10%", width: "400px", height: "400px", background: "var(--accent-light)" }} />
      <div className="hero-blob" style={{ bottom: "-50%", right: "-10%", width: "300px", height: "300px", background: "var(--secondary)" }} />
      
      <div className="dash-hero-content">
        <h1 className="hero-title">Good Evening, {user?.name?.split(" ")[0]} 👋</h1>
        <p>Your career readiness improved by 12% this week. Keep up the great work and continue exploring learning paths.</p>
        <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
          <button className="btn interactive" style={{ background: "white", color: "var(--primary-color)", fontWeight: "600", padding: "10px 20px" }}>View Roadmap</button>
          <button className="btn interactive" style={{ background: "rgba(255,255,255,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", padding: "10px 20px" }}>Book Session</button>
        </div>
      </div>

      <div className="progress-ring-container">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
          <motion.circle 
            cx="60" cy="60" r="54" fill="none" stroke="#fff" strokeWidth="8"
            strokeDasharray="339.29"
            strokeDashoffset={339.29 - (339.29 * readinessScore) / 100}
            strokeLinecap="round"
            style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
            initial={{ strokeDashoffset: 339.29 }}
            animate={{ strokeDashoffset: 339.29 - (339.29 * readinessScore) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="progress-ring-text">
          <span className="val">{readinessScore}%</span>
          <span className="lbl">Ready</span>
        </div>
      </div>
    </motion.div>
  );
});

DashboardHero.displayName = "DashboardHero";
export default DashboardHero;
