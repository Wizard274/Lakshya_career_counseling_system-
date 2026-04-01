// ============================================
// routes/searchRoutes.js - Global Search Routing
// ============================================

const express = require("express");
const router  = express.Router();

const { globalSearch } = require("../controllers/searchController");
const { protect } = require("../middleware/authMiddleware");

// Protected search route
router.get("/", protect, globalSearch);

module.exports = router;
