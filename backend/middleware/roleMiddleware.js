// ============================================
// middleware/roleMiddleware.js - Role-Based Access Control
// ============================================

/**
 * Restrict route access to specific roles
 * Usage: authorize("admin") or authorize("admin", "counselor")
 * Must be used AFTER the protect middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This route requires: ${roles.join(" or ")} role. Your role: ${req.user.role}`,
      });
    }

    next();
  };
};

module.exports = { authorize };
