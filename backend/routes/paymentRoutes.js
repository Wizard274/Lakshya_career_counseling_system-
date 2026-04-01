// ============================================
// routes/paymentRoutes.js - Stripe Integration
// ============================================

const express = require("express");
const router  = express.Router();

const { createPaymentIntent, verifyPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

// Protected route to create payment intent
router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;
