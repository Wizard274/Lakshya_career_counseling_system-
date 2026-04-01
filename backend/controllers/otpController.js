// ============================================
// controllers/otpController.js - OTP Operations
// ============================================

// OTP logic is handled directly in authController.js (register, resendOTP, etc.)
// This file re-exports for modular organization

const { resendOTP } = require("./authController");

module.exports = { resendOTP };
