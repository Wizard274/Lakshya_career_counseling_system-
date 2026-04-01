// pages/counselor/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import authService from "../../services/authService.js";
import { getDayNumber, getMonthAbbr, getStatusBadgeClass } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const CounselorDashboard = () => {
  const user = authService.getStoredUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });

  useEffect(() => {
    bookingService.getCounselorAppointments({ limit: 5 }).then((data) => {
      setAppointments(data.appointments);
      const all = data.appointments;
      setStats({ total: data.pagination?.total || all.length, pending: all.filter((a) => a.status === "pending").length, approved: all.filter((a) => a.status === "approved").length, completed: all.filter((a) => a.status === "completed").length });
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLayout><div className="loader-center"><div className="spinner" /></div></PageLayout>;

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Counselor Panel</div>
          <h1>Welcome, {user?.name?.split(" ")[0]}! ✦</h1>
          <p>Manage your sessions, availability, and help students navigate their career paths.</p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link to="/counselor/appointments" className="btn btn-glass">📋 Sessions</Link>
            <Link to="/counselor/availability" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>🕐 Availability</Link>
          </div>
        </div>
      </div>

      {!user?.isApproved && (
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "var(--r-xl)", padding: "16px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12, fontSize: 14 }}>
          <span style={{ fontSize: 22 }}>⚠️</span>
          <div><strong>Profile pending admin approval.</strong> <Link to="/counselor/profile" style={{ color: "var(--warning)", fontWeight: 700, textDecoration: "underline" }}>Complete profile →</Link></div>
        </div>
      )}

      <div className="stats-grid anim-stagger">
        {[
          { label: "Total Sessions",    value: stats.total,     icon: "📅", glow: "rgba(124,58,237,0.08)" },
          { label: "Pending Requests",  value: stats.pending,   icon: "⏳", glow: "rgba(244,63,94,0.08)"  },
          { label: "Upcoming",          value: stats.approved,  icon: "🔜", glow: "rgba(6,182,212,0.08)"  },
          { label: "Completed",         value: stats.completed, icon: "✅", glow: "rgba(16,185,129,0.08)" },
        ].map((s) => (
          <div className="stat-card anim-fadeup" key={s.label} style={{ "--stat-glow": s.glow }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="action-grid">
        <Link to="/counselor/appointments" className="action-card ac-purple"><div className="ac-icon">📋</div><div className="ac-label">Sessions</div><div className="ac-sub">Manage appointments</div></Link>
        <Link to="/counselor/availability"  className="action-card ac-cyan"><div className="ac-icon">🕐</div><div className="ac-label">Availability</div><div className="ac-sub">Set your schedule</div></Link>
        <Link to="/counselor/profile"       className="action-card ac-rose"><div className="ac-icon">👤</div><div className="ac-label">Profile</div><div className="ac-sub">Edit information</div></Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">✦ Upcoming Sessions</div>
          <Link to="/counselor/appointments" style={{ fontSize: 13, fontWeight: 700, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>View All →</Link>
        </div>
        <div className="card-body" style={{ padding: appointments.length === 0 ? 24 : "8px 16px 16px" }}>
          {appointments.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">✦</div><h4>No sessions yet</h4><p>Set your availability to start receiving bookings</p></div>
          ) : (
            <div className="appointment-list">
              {appointments.map((apt) => (
                <div className="apt-card" key={apt._id} data-status={apt.status}>
                  <div className="apt-date"><div className="apt-day">{getDayNumber(apt.date)}</div><div className="apt-month">{getMonthAbbr(apt.date)}</div></div>
                  <div className="apt-info">
                    <div className="apt-topic">{apt.topic}</div>
                    <div className="apt-meta"><span>🎓 {apt.student?.name}</span><span>🕐 {apt.timeSlot}</span></div>
                  </div>
                  <div className="apt-actions"><span className={getStatusBadgeClass(apt.status)}>{apt.status}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CounselorDashboard;
