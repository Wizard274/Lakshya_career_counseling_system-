// pages/student/MyAppointments.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { getDayNumber, getMonthAbbr, formatDateShort, getStatusBadgeClass } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchAppointments(); }, [page, statusFilter]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      const data = await bookingService.getBookings(params);
      setAppointments(data.appointments);
      setPagination(data.pagination);
    } catch { } finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    try {
      await bookingService.updateBooking(id, { status: "cancelled", cancelReason: "Cancelled by student" });
      toast.success("Appointment cancelled");
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">My Journey</div>
          <h1>My Sessions ✦</h1>
          <p>Track and manage all your career counseling appointments.</p>
          <Link to="/student/counselors" className="btn btn-glass" style={{ marginTop: 16 }}>+ Book New Session</Link>
        </div>
      </div>

      <div className="filter-row">
        {["", "pending", "approved", "confirmed", "completed", "cancelled"].map((s) => (
          <button key={s} className={`btn btn-sm${statusFilter === s ? " btn-primary" : " btn-glass"}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> :
        appointments.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-icon">✦</div><h4>No appointments found</h4><p>Try a different filter or book a new session</p><Link to="/student/counselors" className="btn btn-primary">Find Counselors</Link></div></div>
        ) : (
          <>
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
                      <span>📅 {formatDateShort(apt.date)}</span>
                    </div>
                    {apt.meetingLink ? (
                      <a href={apt.meetingLink} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--purple)", marginTop: 6, display: "inline-block", fontWeight: 600 }}>🔗 Join Session</a>
                    ) : (
                      <span style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6, display: "inline-block", fontWeight: 500 }}>Meeting link will be available after approval</span>
                    )}
                  </div>
                  <div className="apt-actions">
                    <span className={getStatusBadgeClass(apt.status)}>{apt.status === "payment_done" ? "awaiting otp" : apt.status}</span>
                    {apt.status === "completed" && <Link to={`/student/feedback/${apt._id}`} className="btn btn-rose btn-sm">⭐ Review</Link>}
                    {apt.status === "payment_done" && <Link to={`/student/verify-booking/${apt._id}`} className="btn btn-warning btn-sm">🔑 Enter OTP</Link>}
                    {apt.status === "approved" && <Link to={`/student/payment/${apt._id}`} className="btn btn-success btn-sm">💳 Pay Now</Link>}
                    {(apt.status === "pending" || apt.status === "approved") && <button className="btn btn-danger btn-sm" onClick={() => handleCancel(apt._id)}>Cancel</button>}
                  </div>
                </div>
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
                {[...Array(pagination.pages)].map((_, i) => <button key={i+1} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>)}
                <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )
      }
    </PageLayout>
  );
};

export default MyAppointments;
