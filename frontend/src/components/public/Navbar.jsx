import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService.js";
import { getRoleDashboard } from "../../utils/helpers.js";
import { useTheme } from "../../context/ThemeContext.jsx";
import "../../styles/landing.css";

const Navbar = ({ simplified = false }) => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = authService.getStoredUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const handleNavClick = (e, targetId) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      e.preventDefault();
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <header className={`public-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="public-navbar-container">
        <Link to="/" className="public-navbar-logo">
          <div className="logo-icon">🎯</div>
          <span className="logo-text">Lakshya</span>
        </Link>

        {!simplified && (
          <nav className="public-navbar-links desktop-only">
            <a href="#home" onClick={(e) => handleNavClick(e, "home")}>Home</a>
            <a href="#about" onClick={(e) => handleNavClick(e, "about")}>About</a>
            <a href="#features" onClick={(e) => handleNavClick(e, "features")}>Features</a>
            <a href="#services" onClick={(e) => handleNavClick(e, "services")}>Services</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>Contact</a>
          </nav>
        )}

        <div className="public-navbar-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {isDark ? "☀️" : "🌙"}
          </button>
          
          <div className="desktop-only auth-buttons">
            {isLoggedIn ? (
              <>
                <Link to={getRoleDashboard(user.role)} className="btn btn-outline btn-sm">Dashboard</Link>
                <button onClick={handleLogout} className="btn btn-primary btn-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>

          <button className="mobile-menu-btn" aria-label="Toggle mobile menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-nav-menu ${mobileOpen ? "open" : ""}`}>
        {!simplified && (
          <div className="mobile-nav-links">
            <a href="#home" onClick={(e) => handleNavClick(e, "home")}>Home</a>
            <a href="#about" onClick={(e) => handleNavClick(e, "about")}>About</a>
            <a href="#features" onClick={(e) => handleNavClick(e, "features")}>Features</a>
            <a href="#services" onClick={(e) => handleNavClick(e, "services")}>Services</a>
            <a href="#contact" onClick={(e) => handleNavClick(e, "contact")}>Contact</a>
          </div>
        )}
        <div className="mobile-nav-actions">
          {isLoggedIn ? (
            <>
              <Link to={getRoleDashboard(user.role)} className="btn btn-outline w-full" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn btn-primary w-full">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline w-full" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
