// ============================================
// models/Appointment.js - Appointment Schema
// ============================================

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // ─── Participants ─────────────────────────────
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ─── Scheduling ───────────────────────────────
    date: {
      type: Date,
      required: [true, "Appointment date is required"],
      index: true,
    },
    timeSlot: {
      type: String, // e.g., "10:00 AM - 11:00 AM"
      required: [true, "Time slot is required"],
    },
    duration: {
      type: Number, // Duration in minutes
      default: 60,
    },

    // ─── Session Info ─────────────────────────────
    topic: {
      type: String,
      required: [true, "Session topic is required"],
      maxlength: [200, "Topic cannot exceed 200 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },

    // ─── Status ───────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "payment_done", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    paymentIntentId: {
      type: String,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    
    // ─── Timestamps ─────────────────────────────────
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },

    // ─── Misc ───────────────────────────────────
    cancelReason: {
      type: String,
      default: "",
    },
    sessionNotes: {
      type: String,
      default: "",
    },
    meetingLink: {
      type: String,
      default: "",
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound index to prevent double booking ─────────────────────────────────
appointmentSchema.index(
  { counselor: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $ne: "cancelled" }, status: { $ne: "rejected" } } }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
