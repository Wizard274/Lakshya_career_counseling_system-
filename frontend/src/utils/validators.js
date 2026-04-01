// ============================================
// utils/validators.js - Form Validation Helpers
// ============================================

export const validateEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePhone = (phone) => {
  return /^\+?[\d\s\-()]{7,15}$/.test(phone);
};

export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};
