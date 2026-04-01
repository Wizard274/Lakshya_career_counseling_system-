// pages/auth/UserRegister.jsx — Lakshya Design
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import "../../styles/auth.css";

const UserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [role, setRole]       = useState("student");
  const [form, setForm]       = useState({ name: "", email: "", password: "", phone: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email || !form.password || !form.phone.trim()) return toast.error("Fill in all required fields");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await authService.register({ ...form, role });
      toast.success("OTP sent! Check your inbox 📧");
      navigate("/verify-otp", { state: { email: form.email, purpose: "registration" } });
    } catch (err) { toast.error(err.response?.data?.message || "Registration failed"); }
    finally { setLoading(false); }
  };

  const pwStrength = () => {
    const l = form.password.length;
    if (!l) return null;
    if (l < 6)  return { w: "25%", c: "var(--rose)",    t: "Too short" };
    if (l < 10) return { w: "60%", c: "var(--warning)", t: "Good" };
    return              { w: "100%", c: "var(--green)",  t: "Strong ✓" };
  };
  const pw = pwStrength();

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">🎯</div>
            <div>
              <div className="auth-logo-text">Lakshya</div>
              <div className="auth-logo-sub">Career Platform</div>
            </div>
          </div>
          <div className="auth-hero">
            <div className="auth-hero-tag"><span className="auth-hero-dot" /> Start Free Today</div>
            <h1>Your <em>Career<br />Path</em> Starts<br />Right Here</h1>
            <p className="auth-hero-desc">Join thousands who found clarity, direction and success with expert career guidance.</p>
            <div className="auth-features">
              {[
                { icon: "✅", text: "Free to join, no credit card" },
                { icon: "🔐", text: "Secure OTP verification" },
                { icon: "⚡", text: "Access dashboard instantly" },
                { icon: "🎯", text: "Match with top counselors" },
              ].map((f) => (
                <div className="auth-feature" key={f.text}>
                  <div className="auth-feature-chip">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-stats-row">
            {[{ val: "5 min", lbl: "Setup" }, { val: "24/7", lbl: "Available" }, { val: "4.9★", lbl: "Rating" }].map((s) => (
              <div className="auth-stat" key={s.lbl}><div className="val">{s.val}</div><div className="lbl">{s.lbl}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div className="auth-form-eyebrow">Get Started</div>
            <div className="auth-form-title">Create Account</div>
            <div className="auth-form-sub">Join Lakshya and navigate your career with confidence</div>
          </div>

          <div className="form-group">
            <label className="form-label">I am joining as</label>
            <div className="role-grid">
              {[
                { val: "student",   icon: "🎓", label: "Student",   sub: "Book sessions" },
                { val: "counselor", icon: "👨‍🏫", label: "Counselor", sub: "Offer guidance" },
              ].map((r) => (
                <div key={r.val} className={`role-card${role === r.val ? " selected" : ""}`} onClick={() => setRole(r.val)}>
                  <span className="role-card-icon">{r.icon}</span>
                  <div className="role-card-label">{r.label}</div>
                  <div className="role-card-sub">{r.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" className="form-input" placeholder="John Smith" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input type="tel" className="form-input" placeholder="+91 1234567890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-group">
                <input type={showPw ? "text" : "password"} className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" className="input-suffix-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>{showPw ? "🙈" : "👁️"}</button>
              </div>
              {pw && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, borderRadius: 99, background: "#e4e4e7", overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: pw.w, background: pw.c, borderRadius: 99, transition: "all 0.3s" }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: pw.c }}>{pw.t}</div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" style={{ marginTop: 6 }} disabled={loading}>
              {loading ? "Sending OTP..." : "Create Account & Get OTP →"}
            </button>
          </form>

          <div className="auth-link-row" style={{ marginTop: 18 }}>
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
          <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "var(--text-muted)" }}>🔒 256-bit encrypted · Your data is safe</div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
