// src/App.jsx — Lakshya Career Platform
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Auth
import UserLogin      from "./pages/auth/UserLogin.jsx";
import UserRegister   from "./pages/auth/UserRegister.jsx";
import VerifyOtp      from "./pages/auth/VerifyOtp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword  from "./pages/auth/ResetPassword.jsx";

// Student
import StudentDashboard from "./pages/student/Dashboard.jsx";
import Counselors       from "./pages/student/Counselors.jsx";
import BookSession      from "./pages/student/BookSession.jsx";
import MyAppointments   from "./pages/student/MyAppointments.jsx";
import Payment          from "./pages/student/Payment.jsx";
import VerifyBookingOtp from "./pages/student/VerifyBookingOtp.jsx";
import FeedbackPage     from "./pages/student/Feedback.jsx";

// Counselor
import CounselorDashboard    from "./pages/counselor/Dashboard.jsx";
import CounselorProfile      from "./pages/counselor/Profile.jsx";
import Availability          from "./pages/counselor/Availability.jsx";
import CounselorAppointments from "./pages/counselor/Appointments.jsx";
import SessionNotes          from "./pages/counselor/SessionNotes.jsx";

// Admin
import AdminDashboard    from "./pages/admin/Dashboard.jsx";
import ManageUsers       from "./pages/admin/ManageUsers.jsx";
import ManageCounselors  from "./pages/admin/ManageCounselors.jsx";
import AdminAppointments from "./pages/admin/Appointments.jsx";
import Reports           from "./pages/admin/Reports.jsx";

// Shared
import NotFound        from "./pages/NotFound.jsx";
import ProtectedRoute  from "./components/ProtectedRoute.jsx";
import ProfileSettings from "./pages/shared/ProfileSettings.jsx";

function App() {
  return (
    <Router>
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

      <Routes>
        {/* Public */}
        <Route path="/"                element={<Navigate to="/login" replace />} />
        <Route path="/login"           element={<UserLogin />} />
        <Route path="/register"        element={<UserRegister />} />
        <Route path="/verify-otp"      element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />

        {/* Student */}
        <Route path="/student/dashboard"            element={<ProtectedRoute allowedRoles={["student"]}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/counselors"           element={<ProtectedRoute allowedRoles={["student"]}><Counselors /></ProtectedRoute>} />
        <Route path="/student/book/:counselorId"    element={<ProtectedRoute allowedRoles={["student"]}><BookSession /></ProtectedRoute>} />
        <Route path="/student/appointments"         element={<ProtectedRoute allowedRoles={["student"]}><MyAppointments /></ProtectedRoute>} />
        <Route path="/student/payment/:id"          element={<ProtectedRoute allowedRoles={["student"]}><Payment /></ProtectedRoute>} />
        <Route path="/student/verify-booking/:id"   element={<ProtectedRoute allowedRoles={["student"]}><VerifyBookingOtp /></ProtectedRoute>} />
        <Route path="/student/feedback/:appointmentId" element={<ProtectedRoute allowedRoles={["student"]}><FeedbackPage /></ProtectedRoute>} />
        <Route path="/student/profile"              element={<ProtectedRoute allowedRoles={["student"]}><ProfileSettings /></ProtectedRoute>} />

        {/* Counselor */}
        <Route path="/counselor/dashboard"             element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorDashboard /></ProtectedRoute>} />
        <Route path="/counselor/profile"               element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorProfile /></ProtectedRoute>} />
        <Route path="/counselor/availability"          element={<ProtectedRoute allowedRoles={["counselor"]}><Availability /></ProtectedRoute>} />
        <Route path="/counselor/appointments"          element={<ProtectedRoute allowedRoles={["counselor"]}><CounselorAppointments /></ProtectedRoute>} />
        <Route path="/counselor/appointments/:id/notes" element={<ProtectedRoute allowedRoles={["counselor"]}><SessionNotes /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/dashboard"    element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users"        element={<ProtectedRoute allowedRoles={["admin"]}><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/counselors"   element={<ProtectedRoute allowedRoles={["admin"]}><ManageCounselors /></ProtectedRoute>} />
        <Route path="/admin/appointments" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAppointments /></ProtectedRoute>} />
        <Route path="/admin/reports"      element={<ProtectedRoute allowedRoles={["admin"]}><Reports /></ProtectedRoute>} />
        <Route path="/admin/profile"      element={<ProtectedRoute allowedRoles={["admin"]}><ProfileSettings /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
