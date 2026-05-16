import React, { memo } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { motion, useReducedMotion } from "framer-motion";

const data = [
  { subject: "React", A: 90, fullMark: 100 },
  { subject: "Node.js", A: 85, fullMark: 100 },
  { subject: "Algorithms", A: 70, fullMark: 100 },
  { subject: "System Design", A: 60, fullMark: 100 },
  { subject: "Communication", A: 95, fullMark: 100 },
  { subject: "UI/UX", A: 80, fullMark: 100 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <span style={{ fontWeight: 600 }}>{payload[0].payload.subject}</span>: {payload[0].value}%
      </div>
    );
  }
  return null;
};

const SkillRadarChart = memo(() => {
  const shouldReduceMotion = useReducedMotion();

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
      style={{ display: "flex", flexDirection: "column" }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Skill Analysis</h3>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Your proficiency across key career domains.</p>
      
      <div style={{ width: "100%", height: "260px", flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Radar name="Student" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

SkillRadarChart.displayName = "SkillRadarChart";
export default SkillRadarChart;
