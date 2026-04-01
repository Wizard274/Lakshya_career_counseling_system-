// pages/auth/UserLogin.jsx — Stormy Morning Theme
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import { getRoleDashboard } from "../../utils/helpers.js";
import "../../styles/auth.css";

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const [form, setForm]       = useState({ email: "", password: "" });

  useEffect(() => {
    const user = authService.getStoredUser();
    if (user && localStorage.getItem("userToken"))
      navigate(getRoleDashboard(user.role), { replace: true });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("Please fill in all fields");
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(getRoleDashboard(data.user.role));
    } catch (err) {
      const errData = err.response?.data;
      if (errData?.needsVerification) {
        toast.error("Please verify your email first");
        navigate("/verify-otp", { state: { email: errData.email, purpose: "registration" } });
      } else {
        toast.error(errData?.message || "Invalid credentials. Please try again.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">

      {/* ── LEFT: Brand panel ──────────────────────── */}
      <div className="auth-left">
        <div className="auth-left-grid" />
        <div className="auth-left-content">

          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">🎯</div>
            <div>
              <div className="auth-logo-text">Lakshya</div>
              <div className="auth-logo-sub">Career Navigation Platform</div>
            </div>
          </div>

          {/* Hero */}
          <div className="auth-hero">
            <div className="auth-hero-tag">
              <span className="auth-hero-dot" />
              Your Career. Your Direction.
            </div>
            <h1>Navigate Your<br /><em>Career</em> with<br />Confidence</h1>
            <p className="auth-hero-desc">
              Connect with certified career counselors. Get personalized
              guidance, expert sessions, and actionable plans to reach your goals.
            </p>

            <div className="auth-features">
              {[
                { icon: "🎯", text: "Personalized 1-on-1 career sessions" },
                { icon: "⚡", text: "Book in under 60 seconds" },
                { icon: "🔒", text: "Secure and confidential guidance" },
                { icon: "✦",  text: "Verified expert counselors only" },
              ].map((f) => (
                <div className="auth-feature" key={f.text}>
                  <div className="auth-feature-chip">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="auth-stats-row">
            {[
              { val: "2,400+", lbl: "Students" },
              { val: "150+",   lbl: "Counselors" },
              { val: "98%",    lbl: "Satisfaction" },
            ].map((s) => (
              <div className="auth-stat" key={s.lbl}>
                <div className="val">{s.val}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Form panel ──────────────────────── */}
      <div className="auth-right">
        <div className="auth-form-box">

          <div className="auth-form-header">
            <div className="auth-form-eyebrow">Welcome Back</div>
            <div className="auth-form-title">Sign in to Lakshya</div>
            <div className="auth-form-sub">Enter your credentials to continue your career journey</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>Password</span>
                <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: "var(--primary)", textTransform: "none", letterSpacing: 0 }}>
                  Forgot password?
                </Link>
              </label>
              <div className="input-group">
                <input
                  type={showPw ? "text" : "password"}
                  className="form-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button type="button" className="input-suffix-btn" onClick={() => setShowPw(!showPw)} tabIndex={-1}>
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full btn-lg"
              style={{ marginTop: 8 }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                  Signing in...
                </span>
              ) : "Sign In →"}
            </button>
          </form>

          <div className="auth-divider"><span>New to Lakshya?</span></div>

          <Link to="/register" className="btn btn-outline w-full" style={{ justifyContent: "center" }}>
            Create Free Account
          </Link>

        </div>
      </div>
    </div>
  );
};

export default UserLogin;
