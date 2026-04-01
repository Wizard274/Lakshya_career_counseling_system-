// ============================================
// controllers/counselorController.js - Counselor Operations
// ============================================

const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Feedback = require("../models/Feedback");

// ─── GET ALL COUNSELORS (Public - for students to browse) ─────────────────────
/**
 * @route   GET /api/counselors
 * @desc    Get all approved counselors with optional search/filter
 * @access  Public
 */
const getCounselors = async (req, res, next) => {
  try {
    const { search, expertise, page = 1, limit = 10 } = req.query;

    const query = {
      role: "counselor",
      isApproved: true,
      isVerified: true,
      isActive: true,
    };

    // Search by name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by expertise
    if (expertise) {
      query.expertise = { $in: [new RegExp(expertise, "i")] };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const counselors = await User.find(query)
      .select("-password")
      .sort({ rating: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      counselors,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE COUNSELOR PROFILE ────────────────────────────────────────────
/**
 * @route   GET /api/counselors/:id
 * @desc    Get counselor public profile with reviews
 * @access  Public
 */
const getCounselorById = async (req, res, next) => {
  try {
    const counselor = await User.findOne({
      _id: req.params.id,
      role: "counselor",
    }).select("-password");

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found",
      });
    }

    // Get reviews
    const feedbacks = await Feedback.find({ counselor: req.params.id })
      .populate("student", "name avatar")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ success: true, counselor, feedbacks });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE COUNSELOR PROFILE ─────────────────────────────────────────────────
/**
 * @route   PUT /api/counselors/profile
 * @desc    Update counselor's own profile
 * @access  Private (counselor only)
 */
const updateCounselorProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      bio,
      expertise,
      qualifications,
      yearsOfExperience,
      hourlyRate,
      avatar,
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;
    if (expertise) updateData.expertise = expertise;
    if (qualifications !== undefined) updateData.qualifications = qualifications;
    if (yearsOfExperience !== undefined)
      updateData.yearsOfExperience = yearsOfExperience;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
    if (avatar !== undefined) updateData.avatar = avatar;

    const counselor = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      counselor,
    });
  } catch (error) {
    next(error);
  }
};

// ─── SET AVAILABILITY ─────────────────────────────────────────────────────────
/**
 * @route   PUT /api/counselors/availability
 * @desc    Set weekly availability schedule
 * @access  Private (counselor only)
 * Availability format: [{day: "Monday", slots: ["09:00", "10:00", "14:00"]}]
 */
const setAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: "Availability must be an array",
      });
    }

    const counselor = await User.findByIdAndUpdate(
      req.user._id,
      { availability },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Availability updated successfully",
      availability: counselor.availability,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET COUNSELOR'S OWN APPOINTMENTS ────────────────────────────────────────
/**
 * @route   GET /api/counselors/appointments
 * @desc    Get counselor's appointments
 * @access  Private (counselor only)
 */
const getCounselorAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { counselor: req.user._id };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const appointments = await Appointment.find(query)
      .populate("student", "name email phone avatar")
      .sort({ date: 1 })
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

// ─── ADD SESSION NOTES ────────────────────────────────────────────────────────
/**
 * @route   PUT /api/counselors/appointments/:id/notes
 * @desc    Add session notes to an appointment
 * @access  Private (counselor only)
 */
const addSessionNotes = async (req, res, next) => {
  try {
    const { sessionNotes } = req.body;

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      counselor: req.user._id,
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    appointment.sessionNotes = sessionNotes;
    await appointment.save();

    res.json({ success: true, message: "Session notes saved", appointment });
  } catch (error) {
    next(error);
  }
};

// ─── MARK SESSION COMPLETE ────────────────────────────────────────────────────
/**
 * @route   PUT /api/counselors/appointments/:id/complete
 * @desc    Mark appointment as completed
 * @access  Private (counselor only)
 */
const markSessionComplete = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      counselor: req.user._id,
      status: "approved",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found or cannot be completed",
      });
    }

    appointment.status = "completed";
    await appointment.save();

    res.json({
      success: true,
      message: "Session marked as completed",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET AVAILABLE TIME SLOTS ─────────────────────────────────────────────────
/**
 * @route   GET /api/counselors/:id/slots?date=2024-01-15
 * @desc    Get available time slots for a counselor on a specific date
 * @access  Public
 */
const getAvailableSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    const counselorId = req.params.id;

    if (!date) {
      return res.status(400).json({ success: false, message: "Date is required" });
    }

    const counselor = await User.findById(counselorId).select("availability");
    if (!counselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }

    // Get day of week from the date
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[new Date(date).getDay()];

    // Find availability for that day
    const dayAvailability = counselor.availability.find(
      (a) => a.day === dayOfWeek
    );

    if (!dayAvailability || !dayAvailability.slots.length) {
      return res.json({ success: true, slots: [] });
    }

    // Get booked slots for that date
    const bookedAppointments = await Appointment.find({
      counselor: counselorId,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1)),
      },
      status: { $ne: "cancelled" },
    }).select("timeSlot");

    const bookedSlots = bookedAppointments.map((a) => a.timeSlot);

    // Filter out booked slots
    const availableSlots = dayAvailability.slots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({ success: true, slots: availableSlots });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCounselors,
  getCounselorById,
  updateCounselorProfile,
  setAvailability,
  getCounselorAppointments,
  addSessionNotes,
  markSessionComplete,
  getAvailableSlots,
};
