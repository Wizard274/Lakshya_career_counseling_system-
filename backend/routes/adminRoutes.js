// ============================================
// routes/adminRoutes.js - Admin Routes
// ============================================

const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  getCounselors,
  approveCounselor,
  toggleUserStatus,
  getAllAppointments,
  deleteUser,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All admin routes require admin role
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.get("/counselors", getCounselors);
router.put("/approve-counselor/:id", approveCounselor);
router.put("/users/:id/toggle-status", toggleUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/appointments", getAllAppointments);

module.exports = router;
