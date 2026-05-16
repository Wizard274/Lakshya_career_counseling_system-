import React from "react";
import { Link } from "react-router-dom";
import "../../styles/landing.css";

const Footer = () => {
  return (
    <footer className="public-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="logo-icon">🎯</div>
            <span className="logo-text">Lakshya</span>
          </div>
          <p className="footer-desc">
            Your career, your direction. Navigate your professional journey with expert guidance and AI-driven insights.
          </p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">🐦</a>
            <a href="#" aria-label="LinkedIn">💼</a>
            <a href="#" aria-label="Instagram">📸</a>
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="#features">Features</a>
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </div>
          <div className="footer-column">
            <h4>Company</h4>
            <a href="#about">About Us</a>
            <a href="#careers">Careers</a>
            <a href="#contact">Contact</a>
            <a href="#blog">Blog</a>
          </div>
          <div className="footer-column">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Lakshya Career Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
