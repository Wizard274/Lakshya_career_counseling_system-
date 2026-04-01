// pages/admin/Appointments.jsx
import React, { useState, useEffect } from "react";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import adminService from "../../services/adminService.js";
import { formatDateShort, getStatusBadgeClass } from "../../utils/helpers.js";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate]       = useState("");
  const [endDate, setEndDate]           = useState("");
  const [page, setPage]                 = useState(1);
  const [pagination, setPagination]     = useState({});

  useEffect(() => { fetchAppointments(); }, [page, statusFilter, startDate, endDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await adminService.getAllAppointments(params);
      setAppointments(data.appointments); setPagination(data.pagination);
    } catch { } finally { setLoading(false); }
  };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Platform Activity</div>
          <h1>All Appointments ✦</h1>
          <p>{pagination.total || 0} total appointments across the platform.</p>
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
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Student</th><th>Counselor</th><th>Topic</th><th>Date</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {appointments.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>No appointments found</td></tr> :
                appointments.map((apt) => (
                  <tr key={apt._id}>
                    <td style={{ fontWeight: 600, fontSize: 13.5 }}>{apt.student?.name}</td>
                    <td style={{ fontSize: 13.5 }}>{apt.counselor?.name}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{apt.topic}</td>
                    <td style={{ fontSize: 13 }}>{formatDateShort(apt.date)}</td>
                    <td style={{ fontSize: 13 }}>{apt.timeSlot}</td>
                    <td><span className={getStatusBadgeClass(apt.status)}>{apt.status}</span></td>
                  </tr>
                ))}
            </tbody>
          </table>
          {pagination.pages > 1 && (
            <div className="pagination" style={{ padding: 16 }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              {[...Array(Math.min(pagination.pages, 7))].map((_, i) => <button key={i+1} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>)}
              <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default AdminAppointments;
