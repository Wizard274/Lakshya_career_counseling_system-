// pages/auth/ForgotPassword.jsx — Lakshya Design
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import "../../styles/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Enter your email address");
    if (!/^\S+@\S+\.\S+$/.test(email)) return toast.error("Enter a valid email");
    setError(""); setLoading(true);
    try {
      const data = await authService.forgotPassword(email);
      toast.success(data.message || "OTP sent!");
      navigate("/verify-otp", { state: { email, purpose: "forgot-password" } });
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>
            <div><div className="auth-logo-text">Lakshya</div><div className="auth-logo-sub">Career Platform</div></div>
          </div>
          <div className="auth-hero">
            <div className="auth-hero-tag"><span className="auth-hero-dot" /> Account Recovery</div>
            <h1>Reset Your<br /><em>Password</em><br />Securely</h1>
            <p className="auth-hero-desc">Enter your registered email and we'll send a verification OTP instantly.</p>
            <div className="auth-features">
              {[
                { icon: "🔒", text: "Only registered emails allowed" },
                { icon: "⏱️", text: "OTP expires in 5 minutes" },
                { icon: "📂", text: "Check spam folder" },
              ].map((f) => (
                <div className="auth-feature" key={f.text}>
                  <div className="auth-feature-chip">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-stats-row">
            {[{ val: "Instant", lbl: "Delivery" }, { val: "Secure", lbl: "Reset Flow" }, { val: "5 min", lbl: "OTP Valid" }].map((s) => (
              <div className="auth-stat" key={s.lbl}><div className="val">{s.val}</div><div className="lbl">{s.lbl}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div style={{ fontSize: 52, marginBottom: 16 }}>🔑</div>
            <div className="auth-form-eyebrow">Account Recovery</div>
            <div className="auth-form-title">Forgot Password?</div>
            <div className="auth-form-sub">Enter your registered email to receive a reset OTP</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                style={{ borderColor: error ? "var(--rose)" : "", boxShadow: error ? "0 0 0 4px rgba(244,63,94,0.1)" : "" }}
                autoFocus required />

              {error && (
                <div className="form-error-box">
                  <span className="err-icon">❌</span>
                  <div>
                    <div className="err-msg">{error}</div>
                    {error.toLowerCase().includes("not registered") && (
                      <div className="err-link">Don't have an account? <Link to="/register">Create one →</Link></div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
              {loading ? "Checking..." : "Send Reset OTP →"}
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

export default ForgotPassword;
