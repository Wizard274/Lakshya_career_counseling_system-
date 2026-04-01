// ============================================
// middleware/rateLimiter.js - NEW
// Prevents API abuse using express-rate-limit
// ============================================

const rateLimit = require("express-rate-limit");

/**
 * Helper to create a rate limiter with custom settings
 */
const createLimiter = ({ windowMinutes, maxRequests, message }) => {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000, // convert minutes to ms
    max: maxRequests,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,  // Return rate limit info in headers
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      res.status(429).json(options.message);
    },
  });
};

// ── OTP request limiter ───────────────────────────────────
// Max 5 OTP requests per 15 minutes per IP
const otpLimiter = createLimiter({
  windowMinutes: 15,
  maxRequests: 5,
  message: "Too many OTP requests. Please wait 15 minutes before trying again.",
});

// ── Login limiter ─────────────────────────────────────────
// Max 10 login attempts per 15 minutes per IP
const loginLimiter = createLimiter({
  windowMinutes: 15,
  maxRequests: 10,
  message: "Too many login attempts. Please wait 15 minutes.",
});

// ── General API limiter ───────────────────────────────────
// Max 100 requests per 10 minutes per IP
const apiLimiter = createLimiter({
  windowMinutes: 10,
  maxRequests: 100,
  message: "Too many requests. Please slow down.",
});

// ── Strict limiter for sensitive actions ──────────────────
// Max 3 requests per hour (password reset, etc.)
const strictLimiter = createLimiter({
  windowMinutes: 60,
  maxRequests: 3,
  message: "Too many attempts. Please wait 1 hour before trying again.",
});

module.exports = { otpLimiter, loginLimiter, apiLimiter, strictLimiter };
