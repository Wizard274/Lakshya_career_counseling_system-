// ============================================
// validators/bookingValidators.js - NEW
// Booking input validation rules
// ============================================

const { body } = require("express-validator");
const { validate } = require("./authValidators");

// ── Create booking validation rules ───────────────────────
const createBookingRules = [
  body("counselorId")
    .notEmpty().withMessage("Counselor ID is required")
    .isMongoId().withMessage("Invalid counselor ID format"),

  body("date")
    .notEmpty().withMessage("Date is required")
    .isISO8601().withMessage("Date must be a valid date (YYYY-MM-DD)")
    .custom((value) => {
      const bookingDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (bookingDate < today) {
        throw new Error("Booking date cannot be in the past");
      }
      return true;
    }),

  body("timeSlot")
    .trim()
    .notEmpty().withMessage("Time slot is required"),

  body("topic")
    .trim()
    .notEmpty().withMessage("Session topic is required")
    .isLength({ max: 200 }).withMessage("Topic cannot exceed 200 characters"),

  body("description")
    .optional()
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
];

// ── Update booking status rules ────────────────────────────
const updateBookingRules = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["approved", "cancelled", "completed"]).withMessage("Invalid status value"),

  body("cancelReason")
    .optional()
    .isLength({ max: 200 }).withMessage("Cancel reason cannot exceed 200 characters"),
];

// ── Feedback validation rules ──────────────────────────────
const feedbackRules = [
  body("rating")
    .notEmpty().withMessage("Rating is required")
    .isFloat({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),

  body("comment")
    .optional()
    .isLength({ max: 1000 }).withMessage("Comment cannot exceed 1000 characters"),
];

module.exports = {
  validate,
  createBookingRules,
  updateBookingRules,
  feedbackRules,
};
