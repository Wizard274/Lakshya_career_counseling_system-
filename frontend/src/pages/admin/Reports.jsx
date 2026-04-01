// pages/admin/Reports.jsx — CHART FIX
// Bar chart was invisible — fixed gradient definition
import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import PageLayout from "../../components/PageLayout.jsx";
import adminService from "../../services/adminService.js";
import "../../styles/dashboard.css";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const COLORS  = ["#7c3aed","#06b6d4","#10b981","#f43f5e"];

// ── Custom tooltip ────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-color)",
      borderRadius: 12,
      padding: "10px 16px",
      boxShadow: "var(--shadow-lg)",
      fontSize: 13,
    }}>
      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#7c3aed", fontWeight: 700 }}>
        📅 {payload[0].value} booking{payload[0].value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const Reports = () => {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageLayout>
      <div className="loader-center"><div className="spinner" /><p>Loading reports...</p></div>
    </PageLayout>
  );

  const { stats: s, monthlyData } = stats || {};

  const barData = (monthlyData || []).map((d) => ({
    month: MONTHS[d._id.month - 1],
    bookings: d.count,
  }));

  const pieData = [
    { name: "Pending",   value: s?.pendingAppointments   || 0 },
    { name: "Approved",  value: s?.approvedAppointments  || 0 },
    { name: "Completed", value: s?.completedAppointments || 0 },
    { name: "Cancelled", value: s?.cancelledAppointments || 0 },
  ].filter((d) => d.value > 0);

  const completionRate   = s?.totalAppointments ? Math.round((s.completedAppointments  / s.totalAppointments) * 100) : 0;
  const cancellationRate = s?.totalAppointments ? Math.round((s.cancelledAppointments  / s.totalAppointments) * 100) : 0;

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Analytics</div>
          <h1>Reports & Analytics ✦</h1>
          <p>Deep dive into platform performance metrics and booking trends.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid anim-stagger">
        {[
          { label: "Total Users",       value: (s?.totalStudents || 0) + (s?.totalCounselors || 0), icon: "👥", glow: "rgba(124,58,237,0.08)" },
          { label: "Completion Rate",   value: `${completionRate}%`,   icon: "✅", glow: "rgba(16,185,129,0.08)"  },
          { label: "Cancellation Rate", value: `${cancellationRate}%`, icon: "❌", glow: "rgba(244,63,94,0.08)"   },
          { label: "Active Counselors", value: s?.totalCounselors || 0, icon: "🌟", glow: "rgba(6,182,212,0.08)"  },
        ].map((card) => (
          <div className="stat-card anim-fadeup" key={card.label} style={{ "--stat-glow": card.glow }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* ── Bar chart — FIX: gradient in defs, not inside Bar ── */}
        <div className="chart-card">
          <div className="chart-title">📈 Monthly Booking Trend</div>
          {barData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">📅</div>
              <p>No booking data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barData} margin={{ top: 24, right: 16, left: 0, bottom: 4 }}>
                {/* Gradient must be in <defs> at top level of BarChart */}
                <defs>
                  <linearGradient id="reportBarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#7c3aed" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.8} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(124,58,237,0.07)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tick={{ fill: "var(--text-muted, #a1a1aa)", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={12}
                  tick={{ fill: "var(--text-muted, #a1a1aa)", fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="bookings"
                  fill="url(#reportBarGrad)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Pie chart ────────────────────────────────── */}
        <div className="chart-card">
          <div className="chart-title">🎯 Distribution</div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">🎯</div>
              <p>No data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={30}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 13,
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 8 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: COLORS[i] }} />
                    {d.name}: <strong style={{ color: "var(--text-primary)" }}>{d.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary grid */}
      <div className="card">
        <div className="card-header"><div className="card-title">✦ Platform Summary</div></div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {[
              { label: "Total Students",      value: s?.totalStudents          || 0 },
              { label: "Approved Counselors", value: s?.totalCounselors        || 0 },
              { label: "Pending Counselors",  value: s?.pendingCounselors      || 0 },
              { label: "Total Appointments",  value: s?.totalAppointments      || 0 },
              { label: "Pending",             value: s?.pendingAppointments    || 0 },
              { label: "Completed Sessions",  value: s?.completedAppointments  || 0 },
              { label: "Cancelled Sessions",  value: s?.cancelledAppointments  || 0 },
              { label: "Completion Rate",     value: `${completionRate}%` },
            ].map((row) => (
              <div key={row.label} style={{
                padding: "16px 18px",
                background: "rgba(124,58,237,0.03)",
                borderRadius: "var(--r-xl)",
                border: "1px solid rgba(124,58,237,0.08)",
              }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 6, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {row.label}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "#7c3aed" }}>
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Reports;
