import React, { Suspense, lazy } from "react";
import { Helmet } from "react-helmet-async";
import authService from "../../services/authService.js";
import { useDashboardData } from "../../hooks/useDashboardData.js";
import { DashboardProvider } from "../../context/DashboardContext.jsx";

// Core Layout Components
import StudentSidebar from "../../components/student-dashboard/StudentSidebar.jsx";
import DashboardTopbar from "../../components/student-dashboard/DashboardTopbar.jsx";
import DashboardHero from "../../components/student-dashboard/DashboardHero.jsx";
import AnalyticsCards from "../../components/student-dashboard/AnalyticsCards.jsx";
import DashboardSkeleton from "../../components/student-dashboard/DashboardSkeleton.jsx";
import ErrorBoundary from "../../components/common/ErrorBoundary.jsx";

// Lazy Load Heavy Chart & UI Components
const SkillRadarChart = lazy(() => import("../../components/student-dashboard/SkillRadarChart.jsx"));
const WeeklyProgressChart = lazy(() => import("../../components/student-dashboard/WeeklyProgressChart.jsx"));
const RecommendationCards = lazy(() => import("../../components/student-dashboard/RecommendationCards.jsx"));
const SessionsTimeline = lazy(() => import("../../components/student-dashboard/SessionsTimeline.jsx"));
const AchievementSection = lazy(() => import("../../components/student-dashboard/AchievementSection.jsx"));
const FloatingAIAssistant = lazy(() => import("../../components/student-dashboard/FloatingAIAssistant.jsx"));

const DashboardContent = () => {
  const user = authService.getStoredUser();
  const { appointments, stats, loading, error } = useDashboardData();

  if (loading) {
    return (
      <div className="student-dashboard-layout">
        <StudentSidebar />
        <div className="dashboard-main-wrapper">
          <DashboardTopbar />
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-dashboard-layout">
        <StudentSidebar />
        <div className="dashboard-main-wrapper">
          <DashboardTopbar />
          <div className="dashboard-content-scroll" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="glass-card" style={{ textAlign: "center", maxWidth: "400px" }}>
              <h3 style={{ color: "var(--danger)", marginBottom: "8px" }}>Failed to Load</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: "16px" }}>Retry</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="student-dashboard-layout">
      <StudentSidebar />
      <div className="dashboard-main-wrapper">
        <DashboardTopbar />
        
        <div className="dashboard-content-scroll">
          <DashboardHero user={user} readinessScore={stats.readinessScore} />
          <AnalyticsCards stats={stats} />
          
          <div className="dash-grid-bottom">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dash-gap)" }}>
              <ErrorBoundary>
                <Suspense fallback={<div className="glass-card skeleton" style={{ height: "300px" }} />}>
                  <SkillRadarChart />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<div className="glass-card skeleton" style={{ height: "400px" }} />}>
                  <RecommendationCards />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<div className="glass-card skeleton" style={{ height: "300px" }} />}>
                  <AchievementSection />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--dash-gap)" }}>
              <ErrorBoundary>
                <Suspense fallback={<div className="glass-card skeleton" style={{ height: "300px" }} />}>
                  <WeeklyProgressChart />
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<div className="glass-card skeleton" style={{ height: "400px" }} />}>
                  <SessionsTimeline appointments={appointments} />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
        
        <ErrorBoundary>
          <Suspense fallback={null}>
            <FloatingAIAssistant />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  return (
    <DashboardProvider>
      <Helmet>
        <title>Dashboard | Lakshya Career OS</title>
      </Helmet>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default StudentDashboard;
