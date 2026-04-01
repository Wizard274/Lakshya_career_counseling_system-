// components/Navbar.jsx — Stormy Morning Theme
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import authService from "../services/authService.js";
import { getInitials } from "../utils/helpers.js";
import { useTheme } from "../context/ThemeContext.jsx";
import "../styles/navbar.css";

const NAV = {
  student: [
    { path: "/student/dashboard",    icon: "🏠", label: "Dashboard"       },
    { path: "/student/counselors",   icon: "🔍", label: "Find Counselors" },
    { path: "/student/appointments", icon: "📅", label: "My Sessions"     },
    { path: "/student/profile",      icon: "👤", label: "Profile"         },
  ],
  counselor: [
    { path: "/counselor/dashboard",    icon: "🏠", label: "Dashboard"    },
    { path: "/counselor/appointments", icon: "📋", label: "Sessions"     },
    { path: "/counselor/availability", icon: "🕐", label: "Availability" },
    { path: "/counselor/profile",      icon: "👤", label: "Profile"      },
  ],
  admin: [
    { path: "/admin/dashboard",    icon: "🏠", label: "Dashboard"    },
    { path: "/admin/users",        icon: "🎓", label: "Students"     },
    { path: "/admin/counselors",   icon: "👨‍🏫", label: "Counselors"  },
    { path: "/admin/appointments", icon: "📅", label: "Appointments" },
    { path: "/admin/reports",      icon: "📊", label: "Reports"      },
    { path: "/admin/profile",      icon: "👤", label: "Profile"      },
  ],
};

const ROLE_BADGE = { student: "Student", counselor: "Counselor", admin: "Admin" };

const Navbar = () => {
  const navigate = useNavigate();
  const user     = authService.getStoredUser();
  const items    = NAV[user?.role] || [];
  const { isDark, toggleTheme } = useTheme();
  const [open, setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const handleLogout = () => { authService.logout(); navigate("/login"); };

  return (
    <>
      <header className={`top-navbar${scrolled ? " scrolled" : ""}`}>
        <NavLink to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="navbar-logo-icon">🎯</div>
          <span className="navbar-brand">Lakshya</span>
        </NavLink>

        <nav className="navbar-nav">
          {items.map((item) => (
            <NavLink key={item.path} to={item.path}
              className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          <button className="navbar-icon-btn theme-toggle" onClick={toggleTheme}
            title={isDark ? "Light Mode" : "Dark Mode"}>
            {isDark ? "☀️" : "🌙"}
          </button>
          <button className="navbar-icon-btn" title="Notifications">
            🔔<span className="notif-dot" />
          </button>
          <div className="navbar-user-pill">
            <div className="avatar-placeholder" style={{ width: 28, height: 28, fontSize: 10, flexShrink: 0 }}>
              {getInitials(user?.name)}
            </div>
            <span className="navbar-user-name">{user?.name?.split(" ")[0]}</span>
            <span className="navbar-role-badge">{ROLE_BADGE[user?.role]}</span>
          </div>
          <button className="navbar-logout-btn" onClick={handleLogout}>
            <span>🚪</span><span>Sign Out</span>
          </button>
          <button className="mobile-menu-btn" onClick={() => setOpen(!open)}>
            {open ? "✕" : "☰"}
          </button>
        </div>
      </header>

      <div className={`mobile-nav${open ? " open" : ""}`}>
        {items.map((item) => (
          <NavLink key={item.path} to={item.path}
            className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
            onClick={() => setOpen(false)}>
            <span className="nav-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <div className="mobile-nav-divider" />
        <button className="nav-link" style={{ background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }} onClick={toggleTheme}>
          <span className="nav-link-icon">{isDark ? "☀️" : "🌙"}</span>
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="mobile-nav-logout" onClick={handleLogout}>🚪 Sign Out</button>
      </div>
    </>
  );
};

export default Navbar;
