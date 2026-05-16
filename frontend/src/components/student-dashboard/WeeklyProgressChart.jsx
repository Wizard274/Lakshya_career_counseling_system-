import React, { memo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion, useReducedMotion } from "framer-motion";

const data = [
  { name: "Mon", hours: 2.5 },
  { name: "Tue", hours: 3.8 },
  { name: "Wed", hours: 1.5 },
  { name: "Thu", hours: 4.2 },
  { name: "Fri", hours: 2.0 },
  { name: "Sat", hours: 5.5 },
  { name: "Sun", hours: 3.0 },
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "rgba(15, 23, 42, 0.9)", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 12px", borderRadius: "8px", color: "white", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
        <span style={{ fontWeight: 600 }}>{payload[0].payload.name}</span>: {payload[0].value} hours
      </div>
    );
  }
  return null;
};

const WeeklyProgressChart = memo(() => {
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Weekly Progress</h3>
        <select style={{ background: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-body)", fontSize: "12px", padding: "4px 8px", borderRadius: "6px", outline: "none" }}>
          <option>This Week</option>
          <option>Last Week</option>
        </select>
      </div>
      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Hours spent learning and practicing.</p>
      
      <div style={{ width: "100%", height: "260px", flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--bg-page)" }} />
            <Bar dataKey="hours" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
});

WeeklyProgressChart.displayName = "WeeklyProgressChart";
export default WeeklyProgressChart;
