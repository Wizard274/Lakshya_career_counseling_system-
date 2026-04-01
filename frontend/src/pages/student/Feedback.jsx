// pages/student/Feedback.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { formatDateShort, getInitials } from "../../utils/helpers.js";
import "../../styles/dashboard.css";

const StarRow = ({ label, value, onChange }) => (
  <div className="category-rating">
    <span className="category-label">{label}</span>
    <div className="mini-stars">
      {[1,2,3,4,5].map((s) => (
        <button key={s} type="button" className={`mini-star${value >= s ? " active" : ""}`} onClick={() => onChange(s)}>★</button>
      ))}
    </div>
  </div>
);

const FeedbackPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [submitting, setSubmitting]   = useState(false);
  const [form, setForm] = useState({ rating: 0, comment: "", categories: { helpfulness: 5, communication: 5, expertise: 5 } });

  useEffect(() => {
    bookingService.getBookingById(appointmentId).then((data) => {
      if (data.appointment.status !== "completed") { toast.error("Only for completed sessions"); navigate("/student/appointments"); return; }
      setAppointment(data.appointment);
    }).catch(() => { toast.error("Not found"); navigate("/student/appointments"); })
    .finally(() => setLoading(false));
  }, [appointmentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.rating === 0) return toast.error("Select overall rating");
    setSubmitting(true);
    try {
      await bookingService.submitFeedback(appointmentId, form);
      toast.success("Thank you for your review! ✦");
      navigate("/student/appointments");
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  if (loading) return <PageLayout><div className="loader-center"><div className="spinner" /></div></PageLayout>;

  const LABELS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Leave a Review ⭐</div>
        <div className="page-subtitle">Share your experience to help others</div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        {appointment && (
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-body" style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div className="avatar-placeholder" style={{ width: 54, height: 54, fontSize: 20 }}>{getInitials(appointment.counselor?.name)}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17 }}>{appointment.counselor?.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>📅 {formatDateShort(appointment.date)} · 🕐 {appointment.timeSlot}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>📋 {appointment.topic}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header"><div className="card-title">✦ Write Your Review</div></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Overall rating */}
              <div style={{ marginBottom: 24, padding: 20, background: "rgba(124,58,237,0.03)", borderRadius: "var(--r-xl)", border: "1px solid rgba(124,58,237,0.1)" }}>
                <label className="form-label" style={{ marginBottom: 12 }}>Overall Rating *</label>
                <div className="star-row">
                  {[1,2,3,4,5].map((s) => (
                    <button key={s} type="button" className={`star-btn${form.rating >= s ? " active" : ""}`} onClick={() => setForm({ ...form, rating: s })}>★</button>
                  ))}
                </div>
                {form.rating > 0 && (
                  <div style={{ marginTop: 8, fontSize: 14, fontWeight: 700, background: "var(--grad-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {LABELS[form.rating]} — {form.rating}/5
                  </div>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label className="form-label">Detailed Ratings</label>
                <StarRow label="Helpfulness" value={form.categories.helpfulness} onChange={(v) => setForm({ ...form, categories: { ...form.categories, helpfulness: v } })} />
                <StarRow label="Communication" value={form.categories.communication} onChange={(v) => setForm({ ...form, categories: { ...form.categories, communication: v } })} />
                <StarRow label="Expertise" value={form.categories.expertise} onChange={(v) => setForm({ ...form, categories: { ...form.categories, expertise: v } })} />
              </div>

              <div className="form-group">
                <label className="form-label">Comments (Optional)</label>
                <textarea className="form-input" rows={4} placeholder="Share your experience..." value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} maxLength={1000} style={{ resize: "vertical" }} />
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", textAlign: "right", marginTop: 4 }}>{form.comment.length}/1000</div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="button" className="btn btn-glass" onClick={() => navigate("/student/appointments")}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting || form.rating === 0}>
                  {submitting ? "Submitting..." : "Submit Review ✦"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default FeedbackPage;
