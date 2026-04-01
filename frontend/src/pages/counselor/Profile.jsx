// pages/counselor/Profile.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import bookingService from "../../services/bookingService.js";
import authService from "../../services/authService.js";
import userService from "../../services/userService.js";
import { EXPERTISE_OPTIONS } from "../../utils/constants.js";
import { getInitials } from "../../utils/helpers.js";

const CounselorProfile = () => {
  const user = authService.getStoredUser();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", bio: user?.bio || "",
    qualifications: user?.qualifications || "", yearsOfExperience: user?.yearsOfExperience || 0,
    hourlyRate: user?.hourlyRate || 0, expertise: user?.expertise || [],
  });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [customExpertise, setCustomExpertise] = useState("");

  const toggleExpertise = (tag) => setForm((f) => ({
    ...f, expertise: f.expertise.includes(tag) ? f.expertise.filter((e) => e !== tag) : [...f.expertise, tag],
  }));

  const handleAddCustomExpertise = () => {
    const tag = customExpertise.trim();
    if (tag && !form.expertise.includes(tag)) {
      setForm((f) => ({ ...f, expertise: [...f.expertise, tag] }));
    }
    setCustomExpertise("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      const data = await bookingService.updateCounselorProfile(form);
      localStorage.setItem("userInfo", JSON.stringify({ ...authService.getStoredUser(), ...data.counselor }));
      toast.success("Profile updated! ✦");
    } catch (err) { toast.error(err.response?.data?.message || "Update failed"); }
    finally { setLoading(false); }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error("Passwords do not match");
    setPwLoading(true);
    try {
      await userService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully! ✦");
    } catch (err) { toast.error(err.response?.data?.message || "Password change failed"); }
    finally { setPwLoading(false); }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Edit Profile ✦</div>
        <div className="page-subtitle">Update your professional information</div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div className="card-body" style={{ display: "flex", alignItems: "center", gap: 22, padding: 28 }}>
            <div className="avatar-placeholder" style={{ width: 76, height: 76, fontSize: 30 }}>{getInitials(form.name)}</div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{form.name}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 4 }}>{user?.email} • {form.phone || user?.phone || "No Phone"}</div>
              <div style={{ marginTop: 10 }}>
                <span className={`badge ${user?.isApproved ? "badge-completed" : "badge-pending"}`}>
                  {user?.isApproved ? "✓ Approved" : "⏳ Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">✦ Edit Profile</div></div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" placeholder="+91 1234567890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea className="form-input" rows={4} placeholder="Write about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={500} style={{ resize: "vertical" }} />
              </div>
              <div className="form-group">
                <label className="form-label">Qualifications</label>
                <input type="text" className="form-input" placeholder="MBA, Certified Career Coach..." value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input type="number" className="form-input" min={0} max={50} value={form.yearsOfExperience} onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Hourly Rate (USD)</label>
                  <input type="number" className="form-input" min={0} placeholder="0 = Free" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Areas of Expertise</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
                  {EXPERTISE_OPTIONS.map((tag) => (
                    <button key={tag} type="button" className={`tag${form.expertise.includes(tag) ? " active" : ""}`} onClick={() => toggleExpertise(tag)}>{tag}</button>
                  ))}
                  {form.expertise.filter(tag => !EXPERTISE_OPTIONS.includes(tag)).map(tag => (
                    <button key={tag} type="button" className="tag active" onClick={() => toggleExpertise(tag)}>{tag} ✕</button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <input type="text" className="form-input" style={{ width: 220, height: 36, fontSize: 13 }} placeholder="Add other expertise..." value={customExpertise} onChange={(e) => setCustomExpertise(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomExpertise())} />
                  <button type="button" className="btn btn-sm btn-glass" onClick={handleAddCustomExpertise} disabled={!customExpertise.trim()}>Add</button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 16 }} disabled={loading}>{loading ? "Saving..." : "Save Profile →"}</button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header"><div className="card-title">🔒 Security</div></div>
          <div className="card-body">
            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required minLength={6} />
                </div>
              </div>
              <button type="submit" className="btn btn-outline" style={{ marginTop: 8 }} disabled={pwLoading}>
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CounselorProfile;
