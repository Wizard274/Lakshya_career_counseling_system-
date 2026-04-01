// ============================================
// server.js - UPGRADED
// Added: Global rate limiter, removed Twilio
// ============================================

const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");
const helmet  = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const connectDB       = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");

// Custom limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many generic API requests, please try again later."
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many auth requests, please try again later."
});
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many OTP attempts, please try again later."
});

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ── Stripe Webhook (Must be before express.json) ──────────
const { stripeWebhook } = require("./controllers/paymentController");
app.post("/api/payments/stripe-webhook", express.raw({ type: "application/json" }), stripeWebhook);

// ── Core Middleware ───────────────────────────────────────
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Global rate limiter (all API routes)
app.use("/api", apiLimiter);
app.use("/api/auth", authLimiter);
app.use("/api/auth/otp", otpLimiter);

// ── Routes ────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/authRoutes"));
app.use("/api/users",     require("./routes/userRoutes"));
app.use("/api/counselors",require("./routes/counselorRoutes"));
app.use("/api/bookings",  require("./routes/bookingRoutes"));
app.use("/api/admin",     require("./routes/adminRoutes"));
app.use("/api/payments",  require("./routes/paymentRoutes"));
app.use("/api/search",    require("./routes/searchRoutes"));

const path = require("path");

// ── Serve Frontend ──────────────────────────────────────
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html"));
  });
} else {
  // ── Health check ─────────────────────────────────────────
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Lakshya Career API is running",
      data: {
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
      },
    });
  });
}

// ── Error Handlers ────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✦ Lakshya API running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  console.log(`🌐 API: http://localhost:${PORT}/api\n`);
});

module.exports = app;
