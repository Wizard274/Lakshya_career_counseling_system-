// pages/counselor/SessionNotes.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { formatDateShort, getInitials, getStatusBadgeClass } from "../../utils/helpers.js";

const SessionNotes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [notes, setNotes]             = useState("");
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    bookingService.getBookingById(id).then((data) => {
      setAppointment(data.appointment);
      setNotes(data.appointment.sessionNotes || "");
    }).catch(() => { toast.error("Not found"); navigate("/counselor/appointments"); })
    .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try { await bookingService.addSessionNotes(id, notes); toast.success("Notes saved! ✦"); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <PageLayout><div className="loader-center"><div className="spinner" /></div></PageLayout>;

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Session Notes ✦</div>
        <div className="page-subtitle">Document your session insights privately</div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {appointment && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title">Session Details</div>
              <span className={getStatusBadgeClass(appointment.status)}>{appointment.status}</span>
            </div>
            <div className="card-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="form-label">Student</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
                    <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 13 }}>{getInitials(appointment.student?.name)}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{appointment.student?.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{appointment.student?.email}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="form-label">Session Info</div>
                  <div style={{ fontSize: 13.5, marginTop: 6, lineHeight: 1.9 }}>
                    <div>📅 {formatDateShort(appointment.date)}</div>
                    <div>🕐 {appointment.timeSlot}</div>
                    <div>📋 {appointment.topic}</div>
                  </div>
                </div>
              </div>
              {appointment.description && (
                <div style={{ marginTop: 14, padding: 14, background: "rgba(124,58,237,0.04)", borderRadius: "var(--r-lg)", fontSize: 13.5, color: "var(--text-secondary)", border: "1px solid rgba(124,58,237,0.1)" }}>
                  <strong>Student notes:</strong> {appointment.description}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header"><div className="card-title">📝 Private Notes</div></div>
          <div className="card-body">
            <p style={{ fontSize: 13.5, color: "var(--text-muted)", marginBottom: 14 }}>These notes are private — only you can see them.</p>
            <textarea className="form-input" rows={10}
              placeholder="Key discussion points, recommendations, action items, follow-up..."
              value={notes} onChange={(e) => setNotes(e.target.value)}
              style={{ resize: "vertical", minHeight: 200 }} />
            <div style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "right", marginTop: 4 }}>{notes.length} characters</div>
            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button className="btn btn-glass" onClick={() => navigate("/counselor/appointments")}>← Back</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "💾 Save Notes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default SessionNotes;
