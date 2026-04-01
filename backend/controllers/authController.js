// ============================================
// controllers/authController.js - UPGRADED
// Now thin — all logic moved to authService.js
// Controller → Service → Model pattern
// ============================================

const authService = require("../services/authService");
const User        = require("../models/User");

// ── Register: send OTP ────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const result = await authService.registerUser({ name, email, password, role, phone });

    res.status(201).json({
      success: true,
      message: result.message,
      data: { email: email.toLowerCase() },
    });
  } catch (error) {
    next(error);
  }
};

// ── Verify OTP (registration) ─────────────────────────────
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const ip = req.ip;
    const deviceInfo = req.headers["user-agent"];
    const result = await authService.verifyRegistration(email, otp, ip, deviceInfo);

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      success: true,
      message: "Email verified successfully! Welcome aboard.",
      data: {
        accessToken:  result.tokens.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Resend OTP ────────────────────────────────────────────
const resendOTP = async (req, res, next) => {
  try {
    const { email, purpose = "registration" } = req.body;

    // Check user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user && purpose === "registration") {
      return res.status(400).json({ success: false, message: "User not found. Please register first." });
    }

    const result = await authService.generateAndSendOTP(email.toLowerCase(), purpose);
    res.json({ success: true, message: result.message, data: {} });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const deviceInfo = req.headers["user-agent"];
    const result = await authService.loginUser(email, password, ip, deviceInfo);

    res.cookie("refreshToken", result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken:  result.tokens.accessToken,
        user: result.user,
      },
    });
  } catch (error) {
    // Handle needs-verification error specially
    if (error.needsVerification) {
      return res.status(401).json({
        success: false,
        message: error.message,
        data: { needsVerification: true, email: error.email },
      });
    }
    next(error);
  }
};

// ── Refresh Token ─────────────────────────────────────────
const refreshToken = async (req, res, next) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    if (!incomingToken) {
      return res.status(401).json({ success: false, message: "No refresh token found. Please log in again." });
    }
    
    const ip = req.ip;
    const deviceInfo = req.headers["user-agent"];
    const tokens = await authService.refreshUserToken(incomingToken, ip, deviceInfo);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Token refreshed",
      data: {
        accessToken:  tokens.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Forgot Password ───────────────────────────────────────
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);

    res.json({ success: true, message: result.message, data: {} });
  } catch (error) {
    next(error);
  }
};

// ── Verify Reset OTP ──────────────────────────────────────
const verifyResetOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyResetOTP(email, otp);

    res.json({ success: true, message: result.message, data: {} });
  } catch (error) {
    next(error);
  }
};

// ── Reset Password ────────────────────────────────────────
const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.resetPassword(email, newPassword);

    res.json({ success: true, message: result.message, data: {} });
  } catch (error) {
    next(error);
  }
};

// ── Get Current User ──────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, message: "User fetched", data: { user } });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    const incomingToken = req.cookies.refreshToken;
    await authService.logoutUser(incomingToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.json({ success: true, message: "Logged out successfully", data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verifyOTP,
  resendOTP,
  login,
  refreshToken,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getMe,
  logout
};
