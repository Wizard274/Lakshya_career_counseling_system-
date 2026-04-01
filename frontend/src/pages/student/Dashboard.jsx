// pages/student/Dashboard.jsx — Lakshya Design
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import authService from "../../services/authService.js";
import { getDayNumber, getMonthAbbr, getStatusBadgeClass } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const StudentDashboard = () => {
  const user = authService.getStoredUser();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, upcoming: 0 });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const data = await bookingService.getBookings({ limit: 5 });
      setAppointments(data.appointments);
      const all = data.appointments;
      setStats({
        total:     data.pagination.total,
        pending:   all.filter((a) => a.status === "pending").length,
        completed: all.filter((a) => a.status === "completed").length,
        upcoming:  all.filter((a) => a.status === "approved").length,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) return <PageLayout><div className="loader-center"><div className="spinner" /><p>Loading your dashboard...</p></div></PageLayout>;

  return (
    <PageLayout>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Student Dashboard</div>
          <h1>Welcome back, {user?.name?.split(" ")[0]}! ✦</h1>
          <p>Track your career journey, sessions, and upcoming appointments all in one place.</p>
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            <Link to="/student/counselors" className="btn btn-glass">🔍 Find Counselors</Link>
            <Link to="/student/appointments" className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>📅 My Sessions</Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid anim-stagger">
        {[
          { label: "Total Bookings",   value: stats.total,     icon: "📅", glow: "rgba(124,58,237,0.08)" },
          { label: "Upcoming",         value: stats.upcoming,  icon: "🔜", glow: "rgba(6,182,212,0.08)"  },
          { label: "Pending Approval", value: stats.pending,   icon: "⏳", glow: "rgba(245,158,11,0.08)" },
          { label: "Completed",        value: stats.completed, icon: "✅", glow: "rgba(16,185,129,0.08)" },
        ].map((s) => (
          <div className="stat-card anim-fadeup" key={s.label} style={{ "--stat-glow": s.glow }}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="action-grid">
        <Link to="/student/counselors" className="action-card ac-purple">
          <div className="ac-icon">🔍</div>
          <div className="ac-label">Find Counselors</div>
          <div className="ac-sub">Browse expert career guides</div>
        </Link>
        <Link to="/student/appointments" className="action-card ac-cyan">
          <div className="ac-icon">📅</div>
          <div className="ac-label">My Sessions</div>
          <div className="ac-sub">View all appointments</div>
        </Link>
      </div>

      {/* Recent appointments */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">✦ Recent Sessions</div>
          <Link to="/student/appointments" style={{ fontSize: 13, fontWeight: 700, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>View All →</Link>
        </div>
        <div className="card-body" style={{ padding: appointments.length === 0 ? 24 : "8px 16px 16px" }}>
          {appointments.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h4>No sessions yet</h4>
              <p>Book your first career counseling session and start your journey</p>
              <Link to="/student/counselors" className="btn btn-primary">Find a Counselor</Link>
            </div>
          ) : (
            <div className="appointment-list">
              {appointments.map((apt) => (
                <div className="apt-card" key={apt._id} data-status={apt.status}>
                  <div className="apt-date">
                    <div className="apt-day">{getDayNumber(apt.date)}</div>
                    <div className="apt-month">{getMonthAbbr(apt.date)}</div>
                  </div>
                  <div className="apt-info">
                    <div className="apt-topic">{apt.topic}</div>
                    <div className="apt-meta">
                      <span>👨‍🏫 {apt.counselor?.name}</span>
                      <span>🕐 {apt.timeSlot}</span>
                    </div>
                  </div>
                  <div className="apt-actions">
                    <span className={getStatusBadgeClass(apt.status)}>{apt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default StudentDashboard;
