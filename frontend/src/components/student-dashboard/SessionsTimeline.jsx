import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Clock, Calendar as CalendarIcon, User } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const SessionsTimeline = memo(({ appointments }) => {
  const shouldReduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (!appointments || appointments.length === 0) {
    return (
      <motion.div className="glass-card" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Upcoming Sessions</h3>
        <div style={{ padding: "32px 0", textAlign: "center" }}>
          <div style={{ fontSize: "32px", marginBottom: "12px", opacity: 0.5 }}>📅</div>
          <h4 style={{ fontSize: "14.5px", fontWeight: "600", marginBottom: "4px" }}>No upcoming sessions</h4>
          <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginBottom: "16px" }}>Book your first career counseling session.</p>
          <Link to="/student/counselors" className="btn btn-primary" style={{ padding: "8px 16px", fontSize: "13px" }}>Find Counselor</Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="glass-card"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>Upcoming Sessions</h3>
        <Link to="/student/appointments" style={{ fontSize: "12.5px", color: "var(--primary)", fontWeight: "600", textDecoration: "none" }}>View All</Link>
      </div>

      <div className="timeline-container">
        {appointments.map((apt) => (
          <div key={apt._id} className="timeline-item">
            <div className={`timeline-dot ${apt.status}`} />
            <div className="timeline-content interactive">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div className="timeline-title">{apt.topic}</div>
                <span className={`badge ${apt.status}`} style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "10px", background: `var(--${apt.status === 'pending' ? 'warning' : apt.status === 'completed' ? 'success' : 'primary'}-bg)`, color: `var(--${apt.status === 'pending' ? 'warning' : apt.status === 'completed' ? 'success' : 'primary'})` }}>
                  {apt.status}
                </span>
              </div>
              <div className="timeline-meta">
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><CalendarIcon size={14} /> {format(new Date(apt.date), "MMM dd, yyyy")}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Clock size={14} /> {apt.timeSlot}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "bold" }}>
                  {apt.counselor?.name?.charAt(0) || "C"}
                </div>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text-body)" }}>{apt.counselor?.name || "Counselor"}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
});

SessionsTimeline.displayName = "SessionsTimeline";
export default SessionsTimeline;
