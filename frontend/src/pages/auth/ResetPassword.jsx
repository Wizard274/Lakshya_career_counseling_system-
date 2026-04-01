// pages/auth/ResetPassword.jsx — Lakshya Design
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import "../../styles/auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const email    = useLocation().state?.email || "";
  const [form, setForm]     = useState({ newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 6) return toast.error("Min. 6 characters");
    if (form.newPassword !== form.confirmPassword) return toast.error("Passwords don't match");
    setLoading(true);
    try {
      await authService.resetPassword(email, form.newPassword);
      toast.success("Password reset! Log in with your new password.");
      navigate("/login");
    } catch (err) { toast.error(err.response?.data?.message || "Reset failed"); }
    finally { setLoading(false); }
  };

  const pw = (() => {
    const l = form.newPassword.length;
    if (!l) return null;
    if (l < 6)  return { w: "25%",  c: "var(--rose)",    t: "Too short" };
    if (l < 10) return { w: "60%",  c: "var(--warning)", t: "Good" };
    return              { w: "100%", c: "var(--green)",   t: "Strong ✓" };
  })();

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>
            <div><div className="auth-logo-text">Lakshya</div><div className="auth-logo-sub">Career Platform</div></div>
          </div>
          <div className="auth-hero">
            <div className="auth-hero-tag"><span className="auth-hero-dot" /> Final Step</div>
            <h1>Create a<br /><em>Strong</em><br />Password</h1>
            <p className="auth-hero-desc">Choose a strong password. You'll use it to log in to Lakshya.</p>
            <div className="auth-features">
              {[
                { icon: "🔒", text: "Minimum 6 characters" },
                { icon: "💪", text: "Mix letters & numbers" },
                { icon: "🚫", text: "Avoid common passwords" },
              ].map((f) => (
                <div className="auth-feature" key={f.text}>
                  <div className="auth-feature-chip">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-stats-row">
            {[{ val: "bcrypt", lbl: "Hashing" }, { val: "256-bit", lbl: "Encryption" }, { val: "Safe", lbl: "Storage" }].map((s) => (
              <div className="auth-stat" key={s.lbl}><div className="val">{s.val}</div><div className="lbl">{s.lbl}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔐</div>
            <div className="auth-form-eyebrow">Almost Done</div>
            <div className="auth-form-title">New Password</div>
            <div className="auth-form-sub">Set a new password for <strong style={{ color: "var(--text-primary)" }}>{email}</strong></div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <div className="input-group">
                <input type={showPw ? "text" : "password"} className="form-input" placeholder="Min. 6 characters"
                  value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} required />
                <button type="button" className="input-suffix-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? "🙈" : "👁️"}
                </button>
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

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type={showPw ? "text" : "password"} className="form-input" placeholder="Repeat password"
                value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                style={{ borderColor: form.confirmPassword && form.confirmPassword !== form.newPassword ? "var(--rose)" : "" }} required />
              {form.confirmPassword && form.confirmPassword !== form.newPassword && (
                <div className="form-error">✕ Passwords don't match</div>
              )}
              {form.confirmPassword && form.confirmPassword === form.newPassword && form.newPassword.length >= 6 && (
                <div style={{ fontSize: 12, color: "var(--green)", marginTop: 5, fontWeight: 700 }}>✓ Passwords match</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password →"}
            </button>
          </form>

          <div className="auth-link-row" style={{ marginTop: 20 }}>
            <Link to="/login">← Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
