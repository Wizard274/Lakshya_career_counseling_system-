// pages/admin/Dashboard.jsx — CHART FIX
// Bar chart was invisible — replaced gradient Cell with solid fill
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import PageLayout from "../../components/PageLayout.jsx";
import adminService from "../../services/adminService.js";
import { formatDateShort, getStatusBadgeClass } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const MONTHS  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PIE_CLR = ["#7c3aed","#06b6d4","#10b981","#f43f5e"];

// ── Custom bar label (shows count on top of each bar) ─────
const CustomBarLabel = ({ x, y, width, value }) => {
  if (!value) return null;
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#7c3aed"
      textAnchor="middle"
      fontSize={12}
      fontWeight={700}
    >
      {value}
    </text>
  );
};

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
      <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ color: "#7c3aed", fontWeight: 700 }}>
        📅 {payload[0].value} booking{payload[0].value !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageLayout>
      <div className="loader-center">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    </PageLayout>
  );

  const { stats: s, recentAppointments, monthlyData } = data || {};

  // ── Bar chart data ─────────────────────────────────────
  const barData = (monthlyData || []).map((d) => ({
    month: MONTHS[d._id.month - 1],
    bookings: d.count,
  }));

  // ── Pie chart data ─────────────────────────────────────
  const pieData = [
    { name: "Pending",   value: s?.pendingAppointments   || 0 },
    { name: "Approved",  value: s?.approvedAppointments  || 0 },
    { name: "Completed", value: s?.completedAppointments || 0 },
    { name: "Cancelled", value: s?.cancelledAppointments || 0 },
  ].filter((d) => d.value > 0);

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Admin Control</div>
          <h1>Admin Dashboard ✦</h1>
          <p>Full platform overview — manage users, counselors, and monitor all activity.</p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link to="/admin/counselors" className="btn btn-glass">👨‍🏫 Manage Counselors</Link>
            <Link to="/admin/reports" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>
              📊 Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid anim-stagger">
        {[
          { label: "Total Students",     value: s?.totalStudents     || 0, icon: "🎓", glow: "rgba(37,99,235,0.08)"  },
          { label: "Active Counselors",  value: s?.totalCounselors   || 0, icon: "👨‍🏫", glow: "rgba(16,185,129,0.08)" },
          { label: "Pending Approvals",  value: s?.pendingCounselors || 0, icon: "⏳", glow: "rgba(245,158,11,0.08)"  },
          { label: "Total Appointments", value: s?.totalAppointments || 0, icon: "📅", glow: "rgba(124,58,237,0.08)"  },
        ].map((stat) => (
          <div className="stat-card anim-fadeup" key={stat.label} style={{ "--stat-glow": stat.glow }}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick action cards */}
      <div className="action-grid" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <Link to="/admin/counselors"   className="action-card ac-purple"><div className="ac-icon">👨‍🏫</div><div className="ac-label">Counselors</div></Link>
        <Link to="/admin/users"        className="action-card ac-cyan"><div className="ac-icon">🎓</div><div className="ac-label">Students</div></Link>
        <Link to="/admin/appointments" className="action-card ac-rose"><div className="ac-icon">📅</div><div className="ac-label">Appointments</div></Link>
        <Link to="/admin/reports"      className="action-card ac-aurora"><div className="ac-icon">📊</div><div className="ac-label">Reports</div></Link>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>

        {/* ── Bar chart — Monthly Bookings ──────────────── */}
        <div className="chart-card">
          <div className="chart-title">📈 Monthly Bookings</div>
          {barData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">📅</div>
              <p>No booking data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={barData}
                margin={{ top: 24, right: 16, left: 0, bottom: 4 }}
              >
                {/* Gradient definition — MUST be in <defs> outside <Bar> */}
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#7c3aed" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.85} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(124,58,237,0.08)"
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

                {/* ── FIX: fill="url(#barGradient)" — gradient defined in defs above ── */}
                <Bar
                  dataKey="bookings"
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={60}
                  label={<CustomBarLabel />}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Pie chart — Status Distribution ──────────── */}
        <div className="chart-card">
          <div className="chart-title">🎯 Status Distribution</div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: "40px 0" }}>
              <div className="empty-icon">🎯</div>
              <p>No appointment data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={35}
                    dataKey="value"
                    strokeWidth={2}
                    stroke="none"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_CLR[i % PIE_CLR.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      fontSize: 13,
                      boxShadow: "var(--shadow-lg)",
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-color)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 4 }}>
                {pieData.map((d, i) => (
                  <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "var(--text-secondary)" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_CLR[i], flexShrink: 0 }} />
                    {d.name}: <strong style={{ color: "var(--text-primary)" }}>{d.value}</strong>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Appointments table */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">✦ Recent Appointments</div>
          <Link to="/admin/appointments" style={{ fontSize: 13, fontWeight: 700, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            View All →
          </Link>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Counselor</th>
                <th>Topic</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!recentAppointments?.length ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 36, color: "var(--text-muted)" }}>
                    No appointments yet
                  </td>
                </tr>
              ) : recentAppointments.map((apt) => (
                <tr key={apt._id}>
                  <td style={{ fontWeight: 600 }}>{apt.student?.name}</td>
                  <td>{apt.counselor?.name}</td>
                  <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {apt.topic}
                  </td>
                  <td>{formatDateShort(apt.date)}</td>
                  <td>
                    <span className={getStatusBadgeClass(apt.status)}>{apt.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdminDashboard;
