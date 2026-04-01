// pages/counselor/Appointments.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { formatDateShort, getStatusBadgeClass, getInitials } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const CounselorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => { fetchAppointments(); }, [page, statusFilter, startDate, endDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (statusFilter) params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await bookingService.getCounselorAppointments(params);
      setAppointments(data.appointments);
      setPagination(data.pagination || {});
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleStatusUpdate = async (id, status) => {
    const action = status === "approved" ? "approve" : status === "cancelled" ? "cancel" : "complete";
    if (!window.confirm(`${action.charAt(0).toUpperCase() + action.slice(1)} this appointment?`)) return;
    try {
      await bookingService.updateBooking(id, { status });
      toast.success(`Appointment ${status} ✦`);
      fetchAppointments();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Sessions</div>
          <h1>Manage Sessions ✦</h1>
          <p>Review, approve, and manage all your student booking requests.</p>
        </div>
      </div>

      <div className="filter-row" style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {["", "pending", "approved", "completed", "cancelled"].map((s) => (
            <button key={s} className={`btn btn-sm${statusFilter === s ? " btn-primary" : " btn-glass"}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}>
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>From:</label>
          <input type="date" className="filter-select" style={{ height: 32, padding: "0 10px" }} value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} />
          <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginLeft: 8 }}>To:</label>
          <input type="date" className="filter-select" style={{ height: 32, padding: "0 10px" }} value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} />
          {(startDate || endDate) && <button className="btn btn-sm btn-glass" onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }}>Clear</button>}
        </div>
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> : (
        <>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Student</th><th>Topic</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>No appointments found</td></tr>
                ) : appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 12 }}>{getInitials(apt.student?.name)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{apt.student?.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{apt.student?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: 13.5, maxWidth: 160 }}>{apt.topic}</td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{formatDateShort(apt.date)}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{apt.timeSlot}</div>
                    </td>
                    <td><span className={getStatusBadgeClass(apt.status)}>{apt.status}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {apt.status === "pending" && <>
                          <button className="btn btn-success btn-sm" onClick={() => handleStatusUpdate(apt._id, "approved")}>✓ Approve</button>
                          <button className="btn btn-danger btn-sm"  onClick={() => handleStatusUpdate(apt._id, "cancelled")}>✕ Reject</button>
                        </>}
                        {(apt.status === "approved" || apt.status === "confirmed") && <>
                          <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(apt._id, "completed")}>✓ Complete</button>
                          <Link to={`/counselor/appointments/${apt._id}/notes`} className="btn btn-glass btn-sm">📝 Notes</Link>
                        </>}
                        {apt.status === "completed" && (
                          <Link to={`/counselor/appointments/${apt._id}/notes`} className="btn btn-glass btn-sm">📝 Notes</Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i+1} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
              <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
};

export default CounselorAppointments;
