// ============================================
// controllers/bookingController.js - Appointment Booking Logic
// ============================================

const Appointment = require("../models/Appointment");
const User = require("../models/User");
const Feedback = require("../models/Feedback");
const OTP = require("../models/OTP");
const generateOTP = require("../utils/generateOTP");
const { sendBookingEmail, sendPaymentSuccessEmail } = require("../utils/sendEmail");

// ─── CREATE BOOKING ───────────────────────────────────────────────────────────
/**
 * @route   POST /api/bookings
 * @desc    Student books an appointment with a counselor
 * @access  Private (student)
 */
const createBooking = async (req, res, next) => {
  try {
    const { counselorId, date, timeSlot, topic, description } = req.body;

    // Validate required fields
    if (!counselorId || !date || !timeSlot || !topic) {
      return res.status(400).json({
        success: false,
        message: "Counselor, date, time slot, and topic are required",
      });
    }

    // Check counselor exists and is approved
    const counselor = await User.findOne({
      _id: counselorId,
      role: "counselor",
      isApproved: true,
      isActive: true,
    });

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor not found or not available",
      });
    }

    // Check for double booking (same counselor, date, and time slot)
    const existingBooking = await Appointment.findOne({
      counselor: counselorId,
      date: new Date(date),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    // Check if student already has a booking at the same time
    const studentConflict = await Appointment.findOne({
      student: req.user._id,
      date: new Date(date),
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (studentConflict) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment at this time.",
      });
    }

    // Create appointment
    const appointment = await Appointment.create({
      student: req.user._id,
      counselor: counselorId,
      date: new Date(date),
      timeSlot,
      topic,
      description: description || "",
      status: "pending",
    });

    // Populate for response
    const populated = await Appointment.findById(appointment._id)
      .populate("student", "name email phone")
      .populate("counselor", "name email phone");

    // Send notifications (non-blocking)
    const student = populated.student;
    const dateStr = new Date(date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    try {
      await sendBookingEmail(student.email, {
        studentName: student.name,
        counselorName: counselor.name,
        date: dateStr,
        timeSlot,
        topic,
        status: "pending",
      });
    } catch (emailErr) {
      console.error("Booking email failed:", emailErr.message);
    }

    // WhatsApp (if phone available)
    if (student.phone) {
      sendBookingWhatsApp(student.phone, {
        counselorName: counselor.name,
        date: dateStr,
        timeSlot,
        status: "pending",
      }).catch(console.error);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully. Awaiting counselor approval.",
      appointment: populated,
    });
  } catch (error) {
    // Handle duplicate key error (double booking race condition)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "This time slot was just booked. Please choose another.",
      });
    }
    next(error);
  }
};

// ─── GET ALL BOOKINGS (role-based) ───────────────────────────────────────────
/**
 * @route   GET /api/bookings
 * @desc    Get bookings based on user role
 * @access  Private
 */
const getBookings = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const query = {};

    // Role-based filtering
    if (req.user.role === "student") {
      query.student = req.user._id;
    } else if (req.user.role === "counselor") {
      query.counselor = req.user._id;
    }
    // Admin sees all

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
      .populate("student", "name email phone avatar")
      .populate("counselor", "name email phone avatar expertise")
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
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

// ─── GET SINGLE BOOKING ───────────────────────────────────────────────────────
/**
 * @route   GET /api/bookings/:id
 * @desc    Get a single appointment by ID
 * @access  Private
 */
const getBookingById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("student", "name email phone avatar")
      .populate("counselor", "name email phone avatar expertise");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Authorization check
    const isOwner =
      appointment.student._id.toString() === req.user._id.toString() ||
      appointment.counselor._id.toString() === req.user._id.toString();

    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE BOOKING STATUS ────────────────────────────────────────────────────
/**
 * @route   PUT /api/bookings/:id
 * @desc    Update appointment status (approve/cancel/complete)
 * @access  Private
 */
const updateBooking = async (req, res, next) => {
  try {
    const { status, cancelReason, meetingLink } = req.body;

    const appointment = await Appointment.findById(req.params.id)
      .populate("student", "name email phone")
      .populate("counselor", "name email");

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Role-based permissions
    if (req.user.role === "counselor") {
      // Counselors can approve or cancel
      if (!["approved", "cancelled", "completed"].includes(status)) {
        return res.status(403).json({ success: false, message: "Invalid status for counselor" });
      }
      if (appointment.counselor._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    } else if (req.user.role === "student") {
      // Students can only cancel their own pending/approved appointments
      if (status !== "cancelled") {
        return res.status(403).json({ success: false, message: "Students can only cancel appointments" });
      }
      if (appointment.student._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    appointment.status = status;
    if (cancelReason) appointment.cancelReason = cancelReason;
    if (meetingLink) appointment.meetingLink = meetingLink;

    await appointment.save();

    // Send notification email
    try {
      const dateStr = new Date(appointment.date).toLocaleDateString("en-US", {
        weekday: "long", year: "numeric", month: "long", day: "numeric",
      });

      await sendBookingEmail(appointment.student.email, {
        studentName: appointment.student.name,
        counselorName: appointment.counselor.name,
        date: dateStr,
        timeSlot: appointment.timeSlot,
        topic: appointment.topic,
        status,
      });
    } catch (emailErr) {
      console.error("Status email failed:", emailErr.message);
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

// ─── SUBMIT FEEDBACK ──────────────────────────────────────────────────────────
/**
 * @route   POST /api/bookings/:id/feedback
 * @desc    Student submits feedback after completed session
 * @access  Private (student)
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { rating, comment, categories } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating is required (1-5)",
      });
    }

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "completed",
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Completed appointment not found",
      });
    }

    // Check if feedback already exists
    const existingFeedback = await Feedback.findOne({ appointment: req.params.id });
    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted for this session",
      });
    }

    const feedback = await Feedback.create({
      appointment: req.params.id,
      student: req.user._id,
      counselor: appointment.counselor,
      rating,
      comment: comment || "",
      categories: categories || {},
    });

    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      feedback,
    });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY BOOKING OTP ───────────────────────────────────────────────────────
const verifyBookingOTP = async (req, res, next) => {
  try {
    const { otp } = req.body;
    
    if (!otp) return res.status(400).json({ success: false, message: "OTP is required" });

    const appointment = await Appointment.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "payment_done"
    }).populate("student", "name email").populate("counselor", "name email");

    if (!appointment) return res.status(404).json({ success: false, message: "Valid appointment pending OTP verification not found." });

    const otpRecord = await OTP.findOne({ email: appointment.student.email, purpose: "confirm-booking" });

    if (!otpRecord) return res.status(400).json({ success: false, message: "OTP not found or expired. Please request a new one." });

    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    if (otpRecord.otp !== otp.toString()) {
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      await otpRecord.save();
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    // Success! Update appointment
    appointment.status = "confirmed";
    appointment.otpVerified = true;
    await appointment.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Send emails
    const dateStr = new Date(appointment.date).toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });

    try {
      await sendBookingEmail(appointment.student.email, {
        studentName: appointment.student.name, counselorName: appointment.counselor.name,
        date: dateStr, timeSlot: appointment.timeSlot, topic: appointment.topic, status: "confirmed",
      });
      await sendBookingEmail(appointment.counselor.email, {
        studentName: appointment.student.name, counselorName: appointment.counselor.name,
        date: dateStr, timeSlot: appointment.timeSlot, topic: appointment.topic, status: "confirmed",
      });
    } catch (e) {
      console.log("Error sending confirmed email");
    }

    res.json({ success: true, message: "Booking confirmed successfully!", appointment });
  } catch (err) {
    next(err);
  }
};

// ─── RESEND BOOKING OTP ───────────────────────────────────────────────────────
const resendBookingOTP = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      student: req.user._id,
      status: "payment_done"
    }).populate("student", "name email");

    if (!appointment) return res.status(404).json({ success: false, message: "Valid appointment pending OTP verification not found." });

    // Enforce cooldown
    const existing = await OTP.findOne({ email: appointment.student.email, purpose: "confirm-booking" });
    if (existing) {
      const waitTime = (Date.now() - new Date(existing.lastSentAt).getTime()) / 1000;
      if (waitTime < 60) {
        return res.status(400).json({ success: false, message: `Please wait ${Math.ceil(60 - waitTime)} seconds before requesting a new OTP.` });
      }
    }

    await OTP.deleteMany({ email: appointment.student.email, purpose: "confirm-booking" });

    const newOtp = generateOTP();
    await OTP.create({
      email: appointment.student.email,
      otp: newOtp,
      purpose: "confirm-booking",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      lastSentAt: new Date()
    });

    try {
       await sendPaymentSuccessEmail(appointment.student.email, {
         studentName: appointment.student.name,
         amount: appointment.amount || 0, // In case we need amount here, but payment intent handles it normally. Can pass 0 or fix later. Let's not worry too much as the actual Stripe webhook provides it.
         otp: newOtp,
       });
    } catch (e) { console.error(e) }

    res.json({ success: true, message: "A new OTP has been sent." });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBooking,
  submitFeedback,
  verifyBookingOTP,
  resendBookingOTP
};
