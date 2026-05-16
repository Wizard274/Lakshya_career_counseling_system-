import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="dashboard-content-scroll" style={{ opacity: 0.7 }}>
      {/* Hero Skeleton */}
      <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "var(--radius-card)", marginBottom: "24px" }} />
      
      {/* Analytics Grid Skeleton */}
      <div className="dash-grid-middle">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="skeleton" style={{ width: "48px", height: "48px", borderRadius: "12px" }} />
            <div className="skeleton" style={{ width: "80%", height: "32px", borderRadius: "4px" }} />
            <div className="skeleton" style={{ width: "60%", height: "16px", borderRadius: "4px" }} />
          </div>
        ))}
      </div>

      {/* Main Bottom Grid Skeleton */}
      <div className="dash-grid-bottom">
        <div className="glass-card" style={{ height: "400px" }}>
          <div className="skeleton" style={{ width: "30%", height: "24px", borderRadius: "4px", marginBottom: "24px" }} />
          <div className="skeleton" style={{ width: "100%", height: "100%", borderRadius: "8px" }} />
        </div>
        <div className="glass-card" style={{ height: "400px" }}>
          <div className="skeleton" style={{ width: "40%", height: "24px", borderRadius: "4px", marginBottom: "24px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div className="skeleton" style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div className="skeleton" style={{ width: "100%", height: "16px", borderRadius: "4px" }} />
                  <div className="skeleton" style={{ width: "70%", height: "12px", borderRadius: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
