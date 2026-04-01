// ============================================
// controllers/adminController.js - Admin Operations
// ============================================

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Feedback = require("../models/Feedback");

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics for admin dashboard
 * @access  Private (admin)
 */
const getStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalCounselors,
      pendingCounselors,
      totalAppointments,
      pendingAppointments,
      completedAppointments,
      cancelledAppointments,
      recentAppointments,
    ] = await Promise.all([
      User.countDocuments({ role: "student", isActive: true }),
      User.countDocuments({ role: "counselor", isApproved: true }),
      User.countDocuments({ role: "counselor", isApproved: false }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: "pending" }),
      Appointment.countDocuments({ status: "completed" }),
      Appointment.countDocuments({ status: "cancelled" }),
      Appointment.find()
        .populate("student", "name email")
        .populate("counselor", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    // Monthly bookings for the past 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyData = await Appointment.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalCounselors,
        pendingCounselors,
        totalAppointments,
        pendingAppointments,
        completedAppointments,
        cancelledAppointments,
        approvedAppointments: totalAppointments - pendingAppointments - cancelledAppointments,
      },
      recentAppointments,
      monthlyData,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL USERS ────────────────────────────────────────────────────────────
/**
 * @route   GET /api/admin/users
 * @desc    Get all students with pagination and search
 * @access  Private (admin)
 */
const getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const query = { role: role || "student" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL COUNSELORS ───────────────────────────────────────────────────────
/**
 * @route   GET /api/admin/counselors
 * @desc    Get all counselors (including unapproved)
 * @access  Private (admin)
 */
const getCounselors = async (req, res, next) => {
  try {
    const { search, isApproved, page = 1, limit = 10 } = req.query;

    const query = { role: "counselor" };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (isApproved !== undefined) query.isApproved = isApproved === "true";

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const counselors = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      counselors,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── APPROVE / REJECT COUNSELOR ───────────────────────────────────────────────
/**
 * @route   PUT /api/admin/approve-counselor/:id
 * @desc    Approve or reject a counselor's profile
 * @access  Private (admin)
 */
const approveCounselor = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const counselor = await User.findOneAndUpdate(
      { _id: req.params.id, role: "counselor" },
      { isApproved },
      { new: true }
    ).select("-password");

    if (!counselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }

    res.json({
      success: true,
      message: `Counselor ${isApproved ? "approved" : "rejected"} successfully`,
      counselor,
    });
  } catch (error) {
    next(error);
  }
};

// ─── TOGGLE USER ACTIVE STATUS ────────────────────────────────────────────────
/**
 * @route   PUT /api/admin/users/:id/toggle-status
 * @desc    Activate or deactivate a user account
 * @access  Private (admin)
 */
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL APPOINTMENTS (ADMIN) ─────────────────────────────────────────────
/**
 * @route   GET /api/admin/appointments
 * @desc    Get all appointments with filters
 * @access  Private (admin)
 */
const getAllAppointments = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = {};
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(query)
      .populate("student", "name email")
      .populate("counselor", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// ─── DELETE USER (Admin) ──────────────────────────────────────────────────────
/**
 * @route   DELETE /api/admin/users/:id
 * @desc    Delete a user account
 * @access  Private (admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  getUsers,
  getCounselors,
  approveCounselor,
  toggleUserStatus,
  getAllAppointments,
  deleteUser,
};
