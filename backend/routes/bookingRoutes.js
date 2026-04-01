// ============================================
// routes/bookingRoutes.js - Booking Routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  submitFeedback,
  verifyBookingOTP,
  resendBookingOTP
} = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

router.post("/", protect, authorize("student"), createBooking);
router.get("/", protect, getBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBooking);
router.post("/:id/verify-otp", protect, authorize("student"), verifyBookingOTP);
router.post("/:id/resend-otp", protect, authorize("student"), resendBookingOTP);
router.post("/:id/feedback", protect, authorize("student"), submitFeedback);

module.exports = router;
