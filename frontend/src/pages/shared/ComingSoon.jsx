import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Sparkles, ArrowLeft } from "lucide-react";
import StudentSidebar from "../../components/student-dashboard/StudentSidebar.jsx";
import DashboardTopbar from "../../components/student-dashboard/DashboardTopbar.jsx";
import { DashboardProvider } from "../../context/DashboardContext.jsx";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <DashboardProvider>
      <div className="student-dashboard-layout">
        <Helmet>
          <title>Coming Soon | Lakshya Career OS</title>
        </Helmet>

      <StudentSidebar />
      <div className="dashboard-main-wrapper">
        <DashboardTopbar />

        <div className="dashboard-content-scroll" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-card" style={{ maxWidth: "500px", textAlign: "center", padding: "40px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
              <Sparkles size={32} />
            </div>
            
            <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "12px", color: "var(--text-heading)" }}>
              Feature in Development
            </h1>
            
            <p style={{ color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" }}>
              We are working hard to bring you this premium feature as part of our new AI-Powered Career Operating System. Stay tuned!
            </p>

            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button onClick={() => navigate(-1)} className="btn" style={{ background: "var(--bg-page)", border: "1px solid var(--border)", color: "var(--text-body)", padding: "10px 20px" }}>
                <ArrowLeft size={16} style={{ marginRight: "8px" }} /> Go Back
              </button>
              <Link to="/student/dashboard" className="btn btn-primary" style={{ padding: "10px 24px" }}>
                Return to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardProvider>
  );
};

export default ComingSoon;
