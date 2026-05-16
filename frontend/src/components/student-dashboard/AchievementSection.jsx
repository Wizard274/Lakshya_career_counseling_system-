import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Award, Flame, Star, Zap } from "lucide-react";

const AchievementSection = memo(() => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const achievements = [
    { title: "7-Day Streak", desc: "Logged in consistently", icon: <Flame size={24} />, color: "#f97316", unlocked: true },
    { title: "Career Explorer", desc: "Completed 3 aptitudes", icon: <CompassIcon size={24} />, color: "#3b82f6", unlocked: true },
    { title: "Top 10%", desc: "In mock interview scores", icon: <Award size={24} />, color: "#8b5cf6", unlocked: false },
    { title: "Fast Learner", desc: "Finished React Path", icon: <Zap size={24} />, color: "#eab308", unlocked: false },
  ];

  return (
    <motion.div 
      className="glass-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
          <Star size={18} color="var(--warning)" fill="var(--warning)" /> Achievements & XP
        </h3>
        <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--primary)" }}>1,250 XP</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
        {achievements.map((ach, i) => (
          <Tilt key={i} tiltMaxAngleX={shouldReduceMotion ? 0 : 5} tiltMaxAngleY={shouldReduceMotion ? 0 : 5} perspective={1000} transitionSpeed={1000} scale={shouldReduceMotion ? 1 : 1.05}>
            <div className="interactive" style={{ padding: "16px", borderRadius: "16px", background: ach.unlocked ? `color-mix(in srgb, ${ach.color} 10%, var(--bg-surface))` : "var(--bg-page)", border: `1px solid ${ach.unlocked ? `color-mix(in srgb, ${ach.color} 30%, transparent)` : 'var(--border)'}`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", opacity: ach.unlocked ? 1 : 0.6, filter: ach.unlocked ? "none" : "grayscale(100%)", transition: "all 0.2s" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: ach.unlocked ? ach.color : "var(--border)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: ach.unlocked ? `0 4px 15px color-mix(in srgb, ${ach.color} 40%, transparent)` : "none" }}>
                {ach.icon}
              </div>
              <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-heading)", marginBottom: "4px" }}>{ach.title}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{ach.desc}</div>
            </div>
          </Tilt>
        ))}
      </div>
    </motion.div>
  );
});

const CompassIcon = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);

AchievementSection.displayName = "AchievementSection";
export default AchievementSection;
