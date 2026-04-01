// ============================================
// components/Notification.jsx - Toast Notifications
// ============================================

import toast from "react-hot-toast";

// Convenience wrappers for consistent toast usage
const Notification = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  info: (msg) => toast(msg, { icon: "ℹ️" }),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
};

export default Notification;
