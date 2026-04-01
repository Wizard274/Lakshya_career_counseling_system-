// ============================================
// controllers/searchController.js - Global Search API
// ============================================

const User = require("../models/User");

/**
 * @route   GET /api/search
 * @desc    Search for counselors or students by name/email/expertise
 * @access  Private
 */
const globalSearch = async (req, res, next) => {
  try {
    const { query, role, page = 1, limit = 10, expertise } = req.query;

    if (!query || query.length < 2) {
      return res.json({ success: true, results: [], total: 0 });
    }

    const searchRegex = new RegExp(query, "i");

    // Base query: match name, or email, or expertise
    const dbQuery = {
      $or: [
        { name: searchRegex },
        { email: searchRegex },
      ],
      isActive: true, // Only show active users
    };

    if (role === "counselor" || role === "student") {
      dbQuery.role = role;
    }

    // Role specific query
    if (role === "counselor") {
      dbQuery.isApproved = true; // Only approved counselors
      dbQuery.$or.push({ expertise: searchRegex });
      if (expertise) {
        dbQuery.expertise = new RegExp(expertise, "i"); // Allow overriding/refining with an expertise filter
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const results = await User.find(dbQuery)
      .select("name email role avatar expertise rating totalReviews isApproved isActive")
      .lean()
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(dbQuery);

    res.json({
      success: true,
      results,
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

module.exports = { globalSearch };
