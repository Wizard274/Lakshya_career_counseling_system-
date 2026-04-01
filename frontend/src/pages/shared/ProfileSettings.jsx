// pages/shared/ProfileSettings.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import authService from "../../services/authService.js";
import userService from "../../services/userService.js";
import { getInitials } from "../../utils/helpers.js";

const ProfileSettings = () => {
  const user = authService.getStoredUser();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await userService.updateProfile(form);
      localStorage.setItem("userInfo", JSON.stringify({ ...user, ...data.user }));
      toast.success("Profile updated! ✦");
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    setPwLoading(true);
    try {
      await userService.changePassword(pwForm.currentPassword, pwForm.newPassword);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully! ✦");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="page-header">
        <div className="page-title">Profile Settings ✦</div>
        <div className="page-subtitle">Manage your personal information and security</div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
        
        {/* Profile Info Form */}
        <div className="card">
          <div className="card-header"><div className="card-title">✦ General Information</div></div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 24 }}>
              <div className="avatar-placeholder" style={{ width: 76, height: 76, fontSize: 30 }}>
                {getInitials(form.name)}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>{form.name}</div>
              <div style={{ fontSize: 13.5, color: "var(--text-muted)", marginTop: 4 }}>{user?.email} • {form.phone || user?.phone || "No Phone"}</div>
                <div style={{ marginTop: 8 }}><span className="badge badge-completed">{user?.role}</span></div>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="card">
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

export default ProfileSettings;
