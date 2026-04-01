// ============================================
// services/authService.js - NEW
// Business logic extracted from authController
// Controller → Service → Model pattern
// ============================================

const User       = require("../models/User");
const OTP        = require("../models/OTP");
const Session    = require("../models/Session");
const generateOTP = require("../utils/generateOTP");
const { generateTokenPair, verifyRefreshToken } = require("../utils/generateToken");
const { sendOTPEmail } = require("../utils/sendEmail");

// ── Constants ─────────────────────────────────────────────
const OTP_EXPIRY_MINUTES  = parseInt(process.env.OTP_EXPIRES_MINUTES) || 5;
const MAX_OTP_ATTEMPTS    = 3;
const BLOCK_DURATION_HOURS = 24;
const RESEND_COOLDOWN_SEC  = 60;

// ── Generate and send OTP ─────────────────────────────────
const generateAndSendOTP = async (email, purpose) => {
  // Check resend cooldown (60 seconds)
  const existing = await OTP.findOne({ email, purpose });
  if (existing) {
    const secondsSinceLastSent = (Date.now() - new Date(existing.lastSentAt).getTime()) / 1000;
    if (secondsSinceLastSent < RESEND_COOLDOWN_SEC) {
      const wait = Math.ceil(RESEND_COOLDOWN_SEC - secondsSinceLastSent);
      throw new Error(`Please wait ${wait} seconds before requesting a new OTP.`);
    }
  }

  // Delete any existing OTP for this email + purpose
  await OTP.deleteMany({ email, purpose });

  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Save to DB
  await OTP.create({
    email,
    otp,
    purpose,
    expiresAt,
    attempts: 0,
    isBlocked: false,
    lastSentAt: new Date(),
  });

  // Send email
  await sendOTPEmail(email, otp, purpose);

  return { message: `OTP sent to ${email}. Valid for ${OTP_EXPIRY_MINUTES} minutes.` };
};

// ── Verify OTP (with attempt tracking + block) ────────────
const verifyOTPCode = async (email, otp, purpose) => {
  const otpRecord = await OTP.findOne({ email, purpose, isUsed: false });

  // No OTP found
  if (!otpRecord) {
    throw new Error("OTP not found or already used. Please request a new one.");
  }

  // Check if user is blocked
  if (otpRecord.isBlocked) {
    if (new Date() < otpRecord.blockedUntil) {
      const hoursLeft = Math.ceil((otpRecord.blockedUntil - Date.now()) / (1000 * 60 * 60));
      throw new Error(`Too many wrong attempts. Account blocked for ${hoursLeft} more hour(s).`);
    } else {
      // Block expired — reset
      otpRecord.isBlocked = false;
      otpRecord.attempts = 0;
      await otpRecord.save();
    }
  }

  // Check if OTP is expired
  if (new Date() > otpRecord.expiresAt) {
    await OTP.deleteOne({ _id: otpRecord._id });
    throw new Error("OTP has expired. Please request a new one.");
  }

  // Check OTP value
  if (otpRecord.otp !== otp.toString()) {
    // Increment wrong attempts
    otpRecord.attempts += 1;

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      // Block for 24 hours
      otpRecord.isBlocked = true;
      otpRecord.blockedUntil = new Date(Date.now() + BLOCK_DURATION_HOURS * 60 * 60 * 1000);
      await otpRecord.save();
      throw new Error(`Too many wrong attempts. You are blocked for ${BLOCK_DURATION_HOURS} hours.`);
    }

    await otpRecord.save();
    const remaining = MAX_OTP_ATTEMPTS - otpRecord.attempts;
    throw new Error(`Invalid OTP. ${remaining} attempt(s) remaining.`);
  }

  // OTP is valid — mark as used
  otpRecord.isUsed = true;
  await otpRecord.save();

  return true;
};

// ── Registration service ──────────────────────────────────
const registerUser = async ({ name, email, password, role, phone }) => {
  // Check if verified user exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser && existingUser.isVerified) {
    throw new Error("Email already registered. Please login.");
  }

  // If unverified user exists, delete and recreate
  if (existingUser && !existingUser.isVerified) {
    await User.deleteOne({ email: email.toLowerCase() });
  }

  // Create user
  await User.create({
    name: name.trim(),
    email: email.toLowerCase(),
    password,
    role: ["student", "counselor"].includes(role) ? role : "student",
    phone: phone || "",
    isVerified: false,
  });

  // Send OTP
  return generateAndSendOTP(email.toLowerCase(), "registration");
};

// ── Verify registration OTP and activate account ──────────
const verifyRegistration = async (email, otp, ipAddress, deviceInfo) => {
  await verifyOTPCode(email, otp, "registration");

  // Activate user
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { isVerified: true },
    { new: true }
  );

  if (!user) throw new Error("User not found. Please register again.");

  // Generate token pair
  const tokens = generateTokenPair(user._id, user.role);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ipAddress || "Unknown",
    deviceInfo: deviceInfo || "Unknown",
    expiresAt,
  });

  return {
    tokens,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  };
};

// ── Login service ─────────────────────────────────────────
const loginUser = async (email, password, ipAddress, deviceInfo) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) throw new Error("Invalid email or password");

  if (!user.isVerified) {
    const err = new Error("Please verify your email before logging in.");
    err.needsVerification = true;
    err.email = user.email;
    throw err;
  }

  if (!user.isActive) throw new Error("Your account has been deactivated. Contact support.");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid email or password");

  const tokens = generateTokenPair(user._id, user.role);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ipAddress || "Unknown",
    deviceInfo: deviceInfo || "Unknown",
    expiresAt,
  });

  return {
    tokens,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApproved: user.isApproved,
      avatar: user.avatar,
    },
  };
};

// ── Refresh token service ─────────────────────────────────
const refreshUserToken = async (refreshToken, ipAddress, deviceInfo) => {
  if (!refreshToken) throw new Error("Refresh token is required");

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new Error("Invalid or expired refresh token. Please log in again.");
  }

  if (decoded.type !== "refresh") throw new Error("Invalid token type");

  const session = await Session.findOne({ refreshToken });
  if (!session) throw new Error("Invalid or expired session. Please log in again.");

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new Error("User not found or deactivated");

  // Delete old session
  await Session.deleteOne({ _id: session._id });

  // Issue new token pair
  const tokens = generateTokenPair(user._id, user.role);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await Session.create({
    userId: user._id,
    refreshToken: tokens.refreshToken,
    ipAddress: ipAddress || "Unknown",
    deviceInfo: deviceInfo || "Unknown",
    expiresAt,
  });

  return tokens;
};

// ── Forgot password service ───────────────────────────────
const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.toLowerCase() });

  // Security: return generic message if email not found
  if (!user) {
    return { message: "If this email is registered, an OTP will be sent shortly." };
  }

  if (!user.isVerified) {
    throw new Error("This account is not verified. Please complete registration first.");
  }

  return generateAndSendOTP(email.toLowerCase(), "forgot-password");
};

// ── Verify reset OTP ──────────────────────────────────────
const verifyResetOTP = async (email, otp) => {
  await verifyOTPCode(email, otp, "forgot-password");
  return { message: "OTP verified. You may now reset your password." };
};

// ── Reset password service ────────────────────────────────
const resetPassword = async (email, newPassword) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) throw new Error("User not found");

  user.password = newPassword; // Pre-save hook hashes it
  await user.save();

  return { message: "Password reset successfully. You can now log in." };
};

// ── Logout service ──────────────────────────────────────────
const logoutUser = async (refreshToken) => {
  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }
};

module.exports = {
  registerUser,
  verifyRegistration,
  generateAndSendOTP,
  loginUser,
  refreshUserToken,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  logoutUser,
};
