// ============================================
// services/bookingService.js - Booking API Calls
// ============================================

import api from "./api.js";

// Create a new booking
const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Get all bookings (role-based on backend)
const getBookings = async (params = {}) => {
  const response = await api.get("/bookings", { params });
  return response.data;
};

// Get a single booking
const getBookingById = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Update booking status (approve/cancel/complete)
const updateBooking = async (id, updateData) => {
  const response = await api.put(`/bookings/${id}`, updateData);
  return response.data;
};

// Submit feedback after completed session
const submitFeedback = async (appointmentId, feedbackData) => {
  const response = await api.post(`/bookings/${appointmentId}/feedback`, feedbackData);
  return response.data;
};

// Get all counselors
const getCounselors = async (params = {}) => {
  const response = await api.get("/counselors", { params });
  return response.data;
};

// Get counselor by ID with reviews
const getCounselorById = async (id) => {
  const response = await api.get(`/counselors/${id}`);
  return response.data;
};

// Get available time slots for a counselor on a date
const getAvailableSlots = async (counselorId, date) => {
  const response = await api.get(`/counselors/${counselorId}/slots`, { params: { date } });
  return response.data;
};

// Counselor: Update profile
const updateCounselorProfile = async (profileData) => {
  const response = await api.put("/counselors/profile", profileData);
  return response.data;
};

// Counselor: Set availability
const setAvailability = async (availability) => {
  const response = await api.put("/counselors/availability", { availability });
  return response.data;
};

// Counselor: Get own appointments
const getCounselorAppointments = async (params = {}) => {
  const response = await api.get("/counselors/my/appointments", { params });
  return response.data;
};

// Counselor: Add session notes
const addSessionNotes = async (appointmentId, sessionNotes) => {
  const response = await api.put(`/counselors/appointments/${appointmentId}/notes`, { sessionNotes });
  return response.data;
};

// Counselor: Mark session complete
const markSessionComplete = async (appointmentId) => {
  const response = await api.put(`/counselors/appointments/${appointmentId}/complete`);
  return response.data;
};

// Student: Verify Booking OTP
const verifyBookingOTP = async (appointmentId, otp) => {
  const response = await api.post(`/bookings/${appointmentId}/verify-otp`, { otp });
  return response.data;
};

// Student: Resend Booking OTP
const resendBookingOTP = async (appointmentId) => {
  const response = await api.post(`/bookings/${appointmentId}/resend-otp`);
  return response.data;
};

const bookingService = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  submitFeedback,
  getCounselors,
  getCounselorById,
  getAvailableSlots,
  updateCounselorProfile,
  setAvailability,
  getCounselorAppointments,
  addSessionNotes,
  markSessionComplete,
  verifyBookingOTP,
  resendBookingOTP,
};

export default bookingService;
