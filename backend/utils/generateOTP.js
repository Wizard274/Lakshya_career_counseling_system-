// ============================================
// utils/generateOTP.js - OTP Generator
// ============================================

/**
 * Generates a cryptographically random 6-digit OTP
 * @returns {string} 6-digit OTP string
 */
const generateOTP = () => {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
};

module.exports = generateOTP;
