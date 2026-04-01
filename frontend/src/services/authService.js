// ============================================
// services/authService.js - UPGRADED (Frontend)
// Added: refresh token handling, updated API response format
// ============================================

import api from "./api.js";

const authService = {

  // ── Register ────────────────────────────────────────────
  register: async (userData) => {
    const { data } = await api.post("/auth/register", userData);
    return data.data; // { email }
  },

  // ── Verify OTP ──────────────────────────────────────────
  verifyOTP: async (email, otp) => {
    const { data } = await api.post("/auth/verify-otp", { email, otp });
    // Save BOTH tokens
    if (data.data?.accessToken) {
      localStorage.setItem("userToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
    }
    return data.data;
  },

  // ── Resend OTP ──────────────────────────────────────────
  resendOTP: async (email, purpose = "registration") => {
    const { data } = await api.post("/auth/resend-otp", { email, purpose });
    return data;
  },

  // ── Login ────────────────────────────────────────────────
  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    // Save BOTH tokens
    if (data.data?.accessToken) {
      localStorage.setItem("userToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      localStorage.setItem("userInfo", JSON.stringify(data.data.user));
    }
    return data.data;
  },

  // ── Refresh access token ─────────────────────────────────
  refreshAccessToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token");

    const { data } = await api.post("/auth/refresh-token", { refreshToken });
    if (data.data?.accessToken) {
      localStorage.setItem("userToken",    data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
    }
    return data.data.accessToken;
  },

  // ── Forgot password ──────────────────────────────────────
  forgotPassword: async (email) => {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
  },

  // ── Verify reset OTP ─────────────────────────────────────
  verifyResetOTP: async (email, otp) => {
    const { data } = await api.post("/auth/verify-reset-otp", { email, otp });
    return data;
  },

  // ── Reset password ───────────────────────────────────────
  resetPassword: async (email, newPassword) => {
    const { data } = await api.post("/auth/reset-password", { email, newPassword });
    return data;
  },

  // ── Get current user ─────────────────────────────────────
  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data.data.user;
  },

  // ── Logout ───────────────────────────────────────────────
  logout: () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userInfo");
  },

  // ── Helpers ──────────────────────────────────────────────
  getStoredUser: () => {
    try {
      const user = localStorage.getItem("userInfo");
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isLoggedIn: () => !!localStorage.getItem("userToken"),
};

export default authService;
