// pages/auth/VerifyOtp.jsx — Lakshya Design
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import authService from "../../services/authService.js";
import { getRoleDashboard } from "../../utils/helpers.js";
import "../../styles/auth.css";

export const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email    = location.state?.email || "";
  const purpose  = location.state?.purpose || "registration";

  const [otp, setOtp]         = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer]     = useState(300);
  const [canResend, setCanResend] = useState(false);
  const refs = useRef([]);

  useEffect(() => { if (!email) navigate("/register"); }, [email, navigate]);

  useEffect(() => {
    const iv = setInterval(() => setTimer((t) => {
      if (t <= 1) { setCanResend(true); clearInterval(iv); return 0; }
      return t - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, []);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const change = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const n = [...otp]; n[i] = v.slice(-1); setOtp(n);
    if (v && i < 5) refs.current[i+1]?.focus();
  };

  const keyDown = (i, e) => { if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i-1]?.focus(); };

  const paste = (e) => {
    e.preventDefault();
    const p = e.clipboardData.getData("text").replace(/\D/g,"").slice(0,6);
    const n = [...otp]; p.split("").forEach((d,i) => { if(i<6) n[i]=d; }); setOtp(n);
    refs.current[Math.min(p.length,5)]?.focus();
  };

  const submit = async (e) => {
    e.preventDefault();
    const str = otp.join("");
    if (str.length < 6) return toast.error("Enter all 6 digits");
    setLoading(true);
    try {
      if (purpose === "registration") {
        const data = await authService.verifyOTP(email, str);
        toast.success("Verified! Welcome aboard 🎉");
        navigate(getRoleDashboard(data.user.role));
      } else {
        await authService.verifyResetOTP(email, str);
        toast.success("OTP verified!");
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) { toast.error(err.response?.data?.message || "Invalid OTP"); }
    finally { setLoading(false); }
  };

  const resend = async () => {
    try {
      await authService.resendOTP(email, purpose);
      toast.success("New OTP sent!");
      setTimer(300); setCanResend(false);
      setOtp(["","","","","",""]); refs.current[0]?.focus();
    } catch { toast.error("Failed to resend"); }
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
            <div className="auth-hero-tag"><span className="auth-hero-dot" /> Email Verification</div>
            <h1>Check Your<br /><em>Inbox</em></h1>
            <p className="auth-hero-desc">We've sent a 6-digit code to your email. Enter it to {purpose === "registration" ? "complete registration" : "reset your password"}.</p>
            <div className="auth-features">
              {[
                { icon: "📧", text: `Code sent to ${email}` },
                { icon: "⏱️", text: "OTP expires in 5 minutes" },
                { icon: "📂", text: "Check your spam folder" },
                { icon: "🔄", text: "Can request a new code" },
              ].map((f) => (
                <div className="auth-feature" key={f.text}>
                  <div className="auth-feature-chip">{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-stats-row">
            {[{ val: "6", lbl: "Digits" }, { val: "5 min", lbl: "Valid For" }, { val: "Safe", lbl: "Verified" }].map((s) => (
              <div className="auth-stat" key={s.lbl}><div className="val">{s.val}</div><div className="lbl">{s.lbl}</div></div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-box">
          <div className="auth-form-header">
            <div style={{ fontSize: 52, marginBottom: 16 }}>📧</div>
            <div className="auth-form-eyebrow">Verification</div>
            <div className="auth-form-title">Enter OTP</div>
            <div className="auth-form-sub">Code sent to <strong style={{ color: "var(--text-primary)" }}>{email}</strong></div>
          </div>

          <form onSubmit={submit}>
            <div className="otp-row" onPaste={paste}>
              {otp.map((d, i) => (
                <input key={i} ref={(el) => (refs.current[i] = el)} type="text" inputMode="numeric" maxLength={1}
                  className={`otp-digit${d ? " filled" : ""}`}
                  value={d} onChange={(e) => change(i, e.target.value)} onKeyDown={(e) => keyDown(i, e)}
                  autoFocus={i === 0} />
              ))}
            </div>

            <div className="otp-footer">
              {canResend ? <>Code expired. <button type="button" className="otp-resend" onClick={resend}>Resend OTP</button></> :
                <>Expires in <span className="otp-timer-value">{fmt(timer)}</span></>}
            </div>

            <button type="submit" className="btn btn-primary w-full btn-lg" style={{ marginTop: 16 }}
              disabled={loading || otp.join("").length < 6}>
              {loading ? "Verifying..." : "Verify & Continue →"}
            </button>
          </form>

          <div className="auth-link-row" style={{ marginTop: 20 }}>
            <Link to={purpose === "registration" ? "/register" : "/forgot-password"}>← Back</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
