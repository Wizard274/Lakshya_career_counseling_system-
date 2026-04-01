// ============================================
// models/Feedback.js - Feedback/Review Schema
// ============================================

const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true, // One feedback per appointment
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
      default: "",
    },
    // Specific feedback categories
    categories: {
      helpfulness: { type: Number, min: 1, max: 5, default: 5 },
      communication: { type: Number, min: 1, max: 5, default: 5 },
      expertise: { type: Number, min: 1, max: 5, default: 5 },
    },
  },
  {
    timestamps: true,
  }
);

// ─── After saving feedback, update counselor's average rating ─────────────────
feedbackSchema.post("save", async function () {
  const User = require("./User");
  const feedbacks = await mongoose
    .model("Feedback")
    .find({ counselor: this.counselor });

  const avgRating =
    feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;

  await User.findByIdAndUpdate(this.counselor, {
    rating: Math.round(avgRating * 10) / 10,
    totalReviews: feedbacks.length,
  });
});

module.exports = mongoose.model("Feedback", feedbackSchema);
