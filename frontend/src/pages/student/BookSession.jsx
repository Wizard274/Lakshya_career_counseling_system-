// pages/student/BookSession.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { getInitials, formatDate, formatCurrency } from "../../utils/helpers.js";
import { SESSION_TOPICS } from "../../utils/constants.js";
import "../../styles/dashboard.css";

const BookSession = () => {
  const { counselorId } = useParams();
  const navigate = useNavigate();
  const [counselor, setCounselor] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [slots, setSlots]         = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({ date: "", timeSlot: "", topic: "", description: "" });
  const [otherTopic, setOtherTopic] = useState("");

  useEffect(() => { fetchCounselor(); }, [counselorId]);
  useEffect(() => { if (form.date) fetchSlots(form.date); }, [form.date]);

  const fetchCounselor = async () => {
    try { const d = await bookingService.getCounselorById(counselorId); setCounselor(d.counselor); }
    catch { toast.error("Counselor not found"); navigate("/student/counselors"); }
    finally { setLoading(false); }
  };

  const fetchSlots = async (date) => {
    setSlotsLoading(true); setForm((f) => ({ ...f, timeSlot: "" }));
    try { const d = await bookingService.getAvailableSlots(counselorId, date); setSlots(d.slots || []); }
    catch { setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.timeSlot || !form.topic) return toast.error("Select date, time slot, and topic");
    if (form.topic === "Other" && !otherTopic.trim()) return toast.error("Please specify your topic");
    setSubmitting(true);
    try {
      const finalTopic = form.topic === "Other" ? otherTopic : form.topic;
      await bookingService.createBooking({ counselorId, ...form, topic: finalTopic });
      toast.success("Session booked! ✦");
      navigate("/student/appointments");
    } catch (err) { toast.error(err.response?.data?.message || "Booking failed"); }
    finally { setSubmitting(false); }
  };

  const minDate = new Date(); minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if (loading) return <PageLayout><div className="loader-center"><div className="spinner" /></div></PageLayout>;

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Book a Session <span style={{ WebkitTextFillColor: "initial" }}>✦</span></div>
        <div className="page-subtitle">Schedule with {counselor?.name}</div>
      </div>

      <div className="booking-grid">
        <div>
          {/* Counselor banner */}
          <div className="booking-banner">
            <div className="avatar-placeholder" style={{ width: 58, height: 58, fontSize: 22, flexShrink: 0 }}>{getInitials(counselor?.name)}</div>
            <div className="booking-banner-info">
              <div className="booking-banner-name">{counselor?.name}</div>
              <div className="booking-banner-meta">
                {counselor?.yearsOfExperience > 0 && `${counselor.yearsOfExperience} yrs · `}
                {counselor?.expertise?.slice(0,2).join(" · ")}
              </div>
              {counselor?.expertise?.length > 0 && (
                <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {counselor.expertise.slice(0, 3).map((t) => (
                    <span key={t} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99 }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="step-card">
              <div className="step-header"><div className="step-badge">1</div><div className="step-title">Select Date</div></div>
              <input type="date" className="form-input" min={minDateStr} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>

            {form.date && (
              <div className="step-card">
                <div className="step-header"><div className="step-badge">2</div><div className="step-title">Select Time Slot</div></div>
                {slotsLoading ? <div className="loader-center" style={{ padding: 30 }}><div className="spinner" /></div> :
                  slots.length === 0 ? <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No slots available. Try another date.</p> : (
                    <div className="slots-grid">
                      {slots.map((slot) => (
                        <button type="button" key={slot}
                          className={`slot-btn${form.timeSlot === slot ? " selected" : ""}`}
                          onClick={() => setForm({ ...form, timeSlot: slot })}>
                          {slot}
                        </button>
                      ))}
                    </div>
                  )
                }
              </div>
            )}

            <div className="step-card">
              <div className="step-header"><div className="step-badge">3</div><div className="step-title">Session Details</div></div>
              <div className="form-group">
                <label className="form-label">Topic *</label>
                <select className="form-input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} required>
                  <option value="">Select topic...</option>
                  {SESSION_TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
                  <option value="Other">Other</option>
                </select>
                {form.topic === "Other" && (
                  <input type="text" className="form-input" style={{ marginTop: 8 }} placeholder="Please specify topic" value={otherTopic} onChange={(e) => setOtherTopic(e.target.value)} required />
                )}
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes (Optional)</label>
                <textarea className="form-input" rows={3} placeholder="Anything specific to discuss?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: "vertical" }} />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-xl w-full" style={{ marginTop: 4 }}
              disabled={submitting || !form.date || !form.timeSlot || !form.topic}>
              {submitting ? "Booking..." : "Confirm Booking →"}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div className="booking-summary">
          <div className="booking-summary-head">
            <div className="booking-summary-head-title">✦ Booking Summary</div>
          </div>
          <div className="booking-summary-body">
            {[
              { lbl: "Counselor", val: counselor?.name },
              { lbl: "Date",      val: form.date ? formatDate(form.date) : "Not selected" },
              { lbl: "Time",      val: form.timeSlot || "Not selected" },
              { lbl: "Topic",     val: form.topic === "Other" ? otherTopic || "Not specified" : form.topic || "Not selected" },
              { lbl: "Rate",      val: counselor?.hourlyRate > 0 ? formatCurrency(counselor.hourlyRate) + "/hr" : "Free" },
            ].map((r) => (
              <div className="summary-row" key={r.lbl}>
                <span className="summary-lbl">{r.lbl}</span>
                <span className="summary-val">{r.val}</span>
              </div>
            ))}
          </div>
          <div className="booking-cta">
            <div className="notice notice-warning">⏳ Pending counselor approval</div>
            <div className="notice notice-info">✦ You'll get an email confirmation</div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default BookSession;
