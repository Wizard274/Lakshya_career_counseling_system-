import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/landing.css";

const AuthModal = ({ isOpen, onClose, intent = "continue" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>✕</button>
        <div className="auth-modal-header">
          <div className="auth-modal-icon">🔒</div>
          <h3>Authentication Required</h3>
          <p>Please log in or create an account to {intent}.</p>
        </div>
        <div className="auth-modal-actions">
          <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent: "center" }}>
            Log In
          </Link>
          <Link to="/register" className="btn btn-outline w-full" style={{ justifyContent: "center", marginTop: 12 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
