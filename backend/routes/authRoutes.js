// ============================================
// routes/authRoutes.js - UPGRADED
// Added: validators, rate limiters, refresh token
// ============================================

const express = require("express");
const router  = express.Router();

const {
  register, verifyOTP, resendOTP, login,
  refreshToken, forgotPassword, verifyResetOTP,
  resetPassword, getMe, logout
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const { otpLimiter, loginLimiter, strictLimiter } = require("../middleware/rateLimiter");

const {
  validate,
  registerRules,
  loginRules,
  verifyOTPRules,
  forgotPasswordRules,
  resetPasswordRules,
} = require("../validators/authValidators");

// ── Public routes ─────────────────────────────────────────
// Rate limited + validated
router.post("/register",          otpLimiter,    registerRules,       validate, register);
router.post("/verify-otp",                       verifyOTPRules,      validate, verifyOTP);
router.post("/resend-otp",        otpLimiter,                                   resendOTP);
router.post("/login",             loginLimiter,  loginRules,          validate, login);
router.post("/refresh-token",                                                   refreshToken);   // ← NEW
router.post("/forgot-password",   strictLimiter, forgotPasswordRules, validate, forgotPassword);
router.post("/verify-reset-otp",               verifyOTPRules,      validate, verifyResetOTP);
router.post("/reset-password",                 resetPasswordRules,  validate, resetPassword);

// ── Protected routes ──────────────────────────────────────
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
