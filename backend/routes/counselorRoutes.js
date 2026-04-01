// ============================================
// routes/counselorRoutes.js - Counselor Routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  getCounselors,
  getCounselorById,
  updateCounselorProfile,
  setAvailability,
  getCounselorAppointments,
  addSessionNotes,
  markSessionComplete,
  getAvailableSlots,
} = require("../controllers/counselorController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Public routes
router.get("/", getCounselors);
router.get("/:id", getCounselorById);
router.get("/:id/slots", getAvailableSlots);

// Private counselor-only routes
router.put("/profile", protect, authorize("counselor"), updateCounselorProfile);
router.put("/availability", protect, authorize("counselor"), setAvailability);
router.get("/my/appointments", protect, authorize("counselor"), getCounselorAppointments);
router.put("/appointments/:id/notes", protect, authorize("counselor"), addSessionNotes);
router.put("/appointments/:id/complete", protect, authorize("counselor"), markSessionComplete);

module.exports = router;
