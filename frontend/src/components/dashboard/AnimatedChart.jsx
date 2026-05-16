import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext.jsx";

const data = [
  { name: "Jan", sessions: 4 },
  { name: "Feb", sessions: 7 },
  { name: "Mar", sessions: 5 },
  { name: "Apr", sessions: 12 },
  { name: "May", sessions: 8 },
  { name: "Jun", sessions: 15 },
];

const AnimatedChart = () => {
  const { isDark } = useTheme();

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isDark ? "#818cf8" : "#6366f1"} stopOpacity={0.8} />
              <stop offset="95%" stopColor={isDark ? "#818cf8" : "#6366f1"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} />
          <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} />
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
              color: isDark ? "#fff" : "#000",
              borderRadius: "8px"
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="sessions" 
            stroke={isDark ? "#818cf8" : "#6366f1"} 
            fillOpacity={1} 
            fill="url(#colorSessions)" 
            animationDuration={1500} 
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnimatedChart;
