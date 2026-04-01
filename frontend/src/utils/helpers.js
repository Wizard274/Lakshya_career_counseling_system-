// ============================================
// utils/helpers.js - Utility Helper Functions
// ============================================

// Format date to readable string: "Monday, January 15, 2024"
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Short date format: "Jan 15, 2024"
export const formatDateShort = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Get day abbreviation: "Mon"
export const getDayAbbr = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
};

// Get day number: "15"
export const getDayNumber = (date) => {
  return new Date(date).getDate();
};

// Get month abbreviation: "Jan"
export const getMonthAbbr = (date) => {
  return new Date(date).toLocaleDateString("en-US", { month: "short" });
};

// Get initials from name: "John Doe" -> "JD"
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
};

// Generate star rating display
export const getStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "☆" : "") + "☆".repeat(empty);
};

// Get badge class based on status
export const getStatusBadgeClass = (status) => {
  const map = {
    pending: "badge-pending",
    approved: "badge-approved",
    completed: "badge-completed",
    cancelled: "badge-cancelled",
  };
  return `badge ${map[status] || "badge-primary"}`;
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Get role dashboard path
export const getRoleDashboard = (role) => {
  const paths = {
    student: "/student/dashboard",
    counselor: "/counselor/dashboard",
    admin: "/admin/dashboard",
  };
  return paths[role] || "/login";
};
