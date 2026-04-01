// pages/counselor/Availability.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import bookingService from "../../services/bookingService.js";
import authService from "../../services/authService.js";
import { DAYS_OF_WEEK, TIME_SLOTS } from "../../utils/constants.js";
import "../../styles/dashboard.css";

const buildInitial = () => DAYS_OF_WEEK.map((day) => ({ day, slots: [], enabled: false }));

const Availability = () => {
  const [availability, setAvailability] = useState(buildInitial());
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchLatest = async () => {
      try {
        const user = await authService.getMe();
        if (user?.availability?.length > 0) {
          const merged = buildInitial().map(d => {
            const found = user.availability.find(a => a.day === d.day);
            return found ? { day: d.day, slots: found.slots, enabled: true } : d;
          });
          setAvailability(merged);
        }
      } catch (err) {
        console.error("Failed to load availability from server.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const toggleDay = (i) => setAvailability((prev) =>
    prev.map((d, idx) => idx === i ? { ...d, enabled: !d.enabled, slots: !d.enabled ? d.slots : [] } : d)
  );

  const toggleSlot = (dayIdx, slot) => setAvailability((prev) =>
    prev.map((d, i) => {
      if (i !== dayIdx) return d;
      const slots = d.slots.includes(slot) ? d.slots.filter((s) => s !== slot) : [...d.slots, slot].sort();
      return { ...d, slots };
    })
  );

  const toggleAllSlots = (dayIdx) => setAvailability((prev) =>
    prev.map((d, i) => i !== dayIdx ? d : { ...d, slots: d.slots.length === TIME_SLOTS.length ? [] : [...TIME_SLOTS] })
  );

  const handleSave = async () => {
    const toSave = availability.filter((d) => d.enabled && d.slots.length > 0).map(({ day, slots }) => ({ day, slots }));
    setSaving(true);
    try { 
      await bookingService.setAvailability(toSave); 
      toast.success("Availability saved! ✦"); 
      const user = authService.getStoredUser();
      localStorage.setItem("userInfo", JSON.stringify({ ...user, availability: toSave }));
    }
    catch (err) { toast.error(err.response?.data?.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const totalSlots = availability.reduce((sum, d) => sum + (d.enabled ? d.slots.length : 0), 0);

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Schedule</div>
          <h1>Set Your Availability ✦</h1>
          <p>Configure your weekly schedule. Students can only book during your available slots.</p>
        </div>
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> : (
        <>
          {/* Summary */}
          <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", gap: 32 }}>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "var(--primary)" }}>
                {availability.filter((d) => d.enabled && d.slots.length > 0).length}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Days</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 900, color: "var(--primary)" }}>
                {totalSlots}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Slots</div>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleSave} disabled={saving || totalSlots === 0}>
            {saving ? "Saving..." : "💾 Save Schedule"}
          </button>
        </div>
      </div>

      {/* Day cards */}
      <div className="schedule-list">
        {availability.map((dayObj, dayIdx) => (
          <div key={dayObj.day} className={`schedule-day${dayObj.enabled ? " active" : ""}`}>
            <div className="schedule-day-head">
              <label className="schedule-day-left">
                <input type="checkbox" checked={dayObj.enabled} onChange={() => toggleDay(dayIdx)}
                  style={{ width: 18, height: 18, cursor: "pointer", accentColor: "var(--purple)" }} />
                <span className="schedule-day-name">{dayObj.day}</span>
                {dayObj.enabled && <span className="schedule-day-count">{dayObj.slots.length} slot{dayObj.slots.length !== 1 ? "s" : ""}</span>}
              </label>
              {dayObj.enabled && (
                <button className="btn btn-ghost btn-sm" style={{ fontSize: 12 }} onClick={() => toggleAllSlots(dayIdx)}>
                  {dayObj.slots.length === TIME_SLOTS.length ? "Clear All" : "Select All"}
                </button>
              )}
            </div>
            {dayObj.enabled ? (
              <div className="schedule-slots">
                <div className="slots-chip-row">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} type="button" className={`slot-chip${dayObj.slots.includes(slot) ? " active" : ""}`}
                      onClick={() => toggleSlot(dayIdx, slot)}>{slot}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ padding: "10px 20px 14px", fontSize: 13, color: "var(--text-muted)" }}>
                Check to enable this day
              </div>
            )}
          </div>
        ))}
      </div>
      </>
      )}

    </PageLayout>
  );
};

export default Availability;
