import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Lightbulb, Code, UserPlus, FileText } from "lucide-react";

const RecommendationCards = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const recommendations = [
    { title: "Learn Advanced React", desc: "Based on your interest in Frontend Dev", icon: <Code size={20} />, tag: "Skill", color: "var(--primary)" },
    { title: "Improve Aptitude Skills", desc: "Suggested before upcoming tests", icon: <Lightbulb size={20} />, tag: "Preparation", color: "var(--warning)" },
    { title: "Book Mock Interview", desc: "Practice with a certified counselor", icon: <UserPlus size={20} />, tag: "Action", color: "var(--success)" },
    { title: "Update Resume", desc: "Add your recent React Native project", icon: <FileText size={20} />, tag: "Profile", color: "var(--info)" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <motion.div 
      className="glass-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <SparklesIcon /> AI Recommendations
        </h3>
        <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}>Refresh</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {recommendations.map((rec, i) => (
          <div key={i} className="interactive" style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg-page)", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `color-mix(in srgb, ${rec.color} 15%, transparent)`, color: rec.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {rec.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text-heading)" }}>{rec.title}</span>
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: `color-mix(in srgb, ${rec.color} 10%, transparent)`, color: rec.color, fontWeight: "600" }}>{rec.tag}</span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{rec.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

const SparklesIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary)" }}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4M3 5h4"/>
  </svg>
);

RecommendationCards.displayName = "RecommendationCards";
export default RecommendationCards;
