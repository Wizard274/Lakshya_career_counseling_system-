// ============================================
// services/adminService.js - Admin API Calls
// ============================================

import api from "./api.js";

// Get dashboard stats
const getStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

// Get all users (students)
const getUsers = async (params = {}) => {
  const response = await api.get("/admin/users", { params });
  return response.data;
};

// Get all counselors
const getCounselors = async (params = {}) => {
  const response = await api.get("/admin/counselors", { params });
  return response.data;
};

// Approve or reject a counselor
const approveCounselor = async (id, isApproved) => {
  const response = await api.put(`/admin/approve-counselor/${id}`, { isApproved });
  return response.data;
};

// Toggle user active/inactive status
const toggleUserStatus = async (id) => {
  const response = await api.put(`/admin/users/${id}/toggle-status`);
  return response.data;
};

// Get all appointments
const getAllAppointments = async (params = {}) => {
  const response = await api.get("/admin/appointments", { params });
  return response.data;
};

// Delete a user
const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

const adminService = {
  getStats,
  getUsers,
  getCounselors,
  approveCounselor,
  toggleUserStatus,
  getAllAppointments,
  deleteUser,
};

export default adminService;
