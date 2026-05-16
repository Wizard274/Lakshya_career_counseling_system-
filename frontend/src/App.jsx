// src/App.jsx — Lakshya Career Platform
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";

// Layouts & Contexts & Providers
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import SkeletonDashboard from "./components/common/SkeletonLoader.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Auth
import UserLogin      from "./pages/auth/UserLogin.jsx";
import UserRegister   from "./pages/auth/UserRegister.jsx";
import VerifyOtp      from "./pages/auth/VerifyOtp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword  from "./pages/auth/ResetPassword.jsx";

// Public Page
const LandingPage = lazy(() => import("./pages/public/LandingPage.jsx"));

// Lazy load Student Pages
const StudentDashboard = lazy(() => import("./pages/student/Dashboard.jsx"));
const Counselors       = lazy(() => import("./pages/student/Counselors.jsx"));
const BookSession      = lazy(() => import("./pages/student/BookSession.jsx"));
const MyAppointments   = lazy(() => import("./pages/student/MyAppointments.jsx"));
const Payment          = lazy(() => import("./pages/student/Payment.jsx"));
const VerifyBookingOtp = lazy(() => import("./pages/student/VerifyBookingOtp.jsx"));
const FeedbackPage     = lazy(() => import("./pages/student/Feedback.jsx"));

// Lazy load Counselor Pages
const CounselorDashboard    = lazy(() => import("./pages/counselor/Dashboard.jsx"));
const CounselorProfile      = lazy(() => import("./pages/counselor/Profile.jsx"));
const Availability          = lazy(() => import("./pages/counselor/Availability.jsx"));
const CounselorAppointments = lazy(() => import("./pages/counselor/Appointments.jsx"));
const SessionNotes          = lazy(() => import("./pages/counselor/SessionNotes.jsx"));

// Lazy load Admin Pages
const AdminDashboard    = lazy(() => import("./pages/admin/Dashboard.jsx"));
const ManageUsers       = lazy(() => import("./pages/admin/ManageUsers.jsx"));
const ManageCounselors  = lazy(() => import("./pages/admin/ManageCounselors.jsx"));
const AdminAppointments = lazy(() => import("./pages/admin/Appointments.jsx"));
const Reports           = lazy(() => import("./pages/admin/Reports.jsx"));

// Shared
import NotFound        from "./pages/NotFound.jsx";
const ProfileSettings = lazy(() => import("./pages/shared/ProfileSettings.jsx"));

// Reusable Fallback
const PageFallback = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "var(--bg-gradient)" }}>
    <div style={{ width: 40, height: 40, border: "4px solid rgba(99, 102, 241, 0.2)", borderTopColor: "var(--primary-color)", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: "'Manrope', sans-serif",
                  fontSize: "13.5px",
                  borderRadius: "14px",
                  padding: "13px 18px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
                },
                success: { style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" } },
                error:   { style: { background: "#fff1f2", color: "#9f1239", border: "1px solid #fecdd3" } },
              }}
            />

            <Suspense fallback={<PageFallback />}>
              <Routes>
                
                {/* --- Public Routes --- */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                </Route>

                {/* --- Auth Routes --- */}
                <Route element={<AuthLayout />}>
                  <Route path="/login"           element={<UserLogin />} />
                  <Route path="/register"        element={<UserRegister />} />
                  <Route path="/verify-otp"      element={<VerifyOtp />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password"  element={<ResetPassword />} />
                </Route>

                {/* --- Student Routes (Dashboard uses PageLayout internally for now) --- */}
                <Route path="/student">
                  <Route path="dashboard"            element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
                  <Route path="counselors"           element={<ProtectedRoute allowedRoles={["student"]}><Counselors /></ProtectedRoute>} />
                  <Route path="book/:counselorId"    element={<ProtectedRoute allowedRoles={["student"]}><BookSession /></ProtectedRoute>} />
                  <Route path="appointments"         element={<ProtectedRoute allowedRoles={["student"]}><MyAppointments /></ProtectedRoute>} />
                  <Route path="payment/:id"          element={<ProtectedRoute allowedRoles={["student"]}><Payment /></ProtectedRoute>} />
                  <Route path="verify-booking/:id"   element={<ProtectedRoute allowedRoles={["student"]}><VerifyBookingOtp /></ProtectedRoute>} />
                  <Route path="feedback/:appointmentId" element={<ProtectedRoute allowedRoles={["student"]}><FeedbackPage /></ProtectedRoute>} />
                  <Route path="profile"              element={<ProtectedRoute allowedRoles={["student"]}><ProfileSettings /></ProtectedRoute>} />
                </Route>

                {/* --- Counselor Routes --- */}
                <Route path="/counselor">
                  <Route path="dashboard"             element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorDashboard /></ProtectedRoute>} />
                  <Route path="profile"               element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorProfile /></ProtectedRoute>} />
                  <Route path="availability"          element={<ProtectedRoute allowedRoles={["counselor"]}><Availability /></ProtectedRoute>} />
                  <Route path="appointments"          element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorAppointments /></ProtectedRoute>} />
                  <Route path="appointments/:id/notes" element={<ProtectedRoute allowedRoles={["counselor"]}><SessionNotes /></ProtectedRoute>} />
                </Route>

                {/* --- Admin Routes --- */}
                <Route path="/admin">
                  <Route path="dashboard"    element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                  <Route path="users"        element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
                  <Route path="counselors"   element={<ProtectedRoute allowedRoles={["admin"]}><ManageCounselors /></ProtectedRoute>} />
                  <Route path="appointments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAppointments /></ProtectedRoute>} />
                  <Route path="reports"      element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />
                  <Route path="profile"      element={<ProtectedRoute allowedRoles={["admin"]}><ProfileSettings /></ProtectedRoute>} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;
