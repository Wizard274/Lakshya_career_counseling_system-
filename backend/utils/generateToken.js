// ============================================
// utils/generateToken.js - UPGRADED
// Added: Access Token + Refresh Token pair
// ============================================

const jwt = require("jsonwebtoken");

/**
 * Generate Access Token (short-lived: 15 minutes)
 * Used for API authentication on every request
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role, type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
};

/**
 * Generate Refresh Token (long-lived: 7 days)
 * Used to get a new Access Token without re-login
 */
const generateRefreshToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role, type: "refresh" },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh",
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
};

/**
 * Generate BOTH tokens at once (used on login/verify-otp)
 * Returns: { accessToken, refreshToken }
 */
const generateTokenPair = (userId, role) => {
  return {
    accessToken:  generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId, role),
  };
};

/**
 * Verify a refresh token and return its payload
 * Used in POST /api/auth/refresh-token
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + "_refresh"
  );
};

// Keep backward compatibility — old code that calls generateToken() still works
const generateToken = (userId, role) => generateAccessToken(userId, role);

module.exports = {
  generateToken,         // backward compat
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyRefreshToken,
};
