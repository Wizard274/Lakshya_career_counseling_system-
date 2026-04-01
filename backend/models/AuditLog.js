// ============================================
// models/AuditLog.js - System Audit Log Schema
// ============================================

const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // sometimes actions are performed unauthenticated 
      index: true,
    },
    action: {
      type: String,
      required: true,
    },
    ip: {
      type: String,
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
