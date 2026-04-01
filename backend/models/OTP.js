// ============================================
// models/OTP.js - UPGRADED
// Added: max attempts, block system, resend cooldown
// ============================================

const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["registration", "forgot-password", "confirm-booking"],
      default: "registration",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Auto-delete after expiry (TTL)
    },
    isUsed: {
      type: Boolean,
      default: false,
    },

    // ── NEW: Attempt tracking ─────────────────
    attempts: {
      type: Number,
      default: 0,       // How many wrong OTP entries
      max: 3,
    },

    // ── NEW: Block system ─────────────────────
    isBlocked: {
      type: Boolean,
      default: false,   // Blocked after 3 wrong attempts
    },
    blockedUntil: {
      type: Date,
      default: null,    // Block expires after 24 hours
    },

    // ── NEW: Resend cooldown ──────────────────
    lastSentAt: {
      type: Date,
      default: Date.now, // Track when OTP was last sent
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster lookups
otpSchema.index({ email: 1, purpose: 1 });

module.exports = mongoose.model("OTP", otpSchema);
