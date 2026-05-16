import React from "react";
import { NavLink } from "react-router-dom";
import { useDashboardContext } from "../../context/DashboardContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import authService from "../../services/authService.js";

// Icons (using simple emojis for now, can be replaced with lucide-react)
import { Home, Compass, Target, Sparkles, BookOpen, UserCheck, Calendar, Trophy, Settings } from "lucide-react";

const NAV_ITEMS = [
  { path: "/student/dashboard", icon: <Home size={18} />, label: "Dashboard" },
  { path: "/student/roadmap", icon: <Compass size={18} />, label: "Career Roadmap" },
  { path: "/student/skills", icon: <Target size={18} />, label: "Skill Analysis" },
  { path: "/student/ai-assistant", icon: <Sparkles size={18} />, label: "AI Assistant" },
  { path: "/student/learning", icon: <BookOpen size={18} />, label: "Learning Paths" },
  { path: "/student/counselors", icon: <UserCheck size={18} />, label: "Counselors" },
  { path: "/student/appointments", icon: <Calendar size={18} />, label: "Sessions" },
  { path: "/student/achievements", icon: <Trophy size={18} />, label: "Achievements" },
];

const StudentSidebar = () => {
  const { sidebarOpen, closeSidebar } = useDashboardContext();
  const { isDark } = useTheme();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`} 
        onClick={closeSidebar}
      />
      
      <aside className={`student-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <NavLink to="/" className="sidebar-brand" onClick={closeSidebar}>
            <div className="brand-icon">🎯</div>
            <span className="brand-text">Lakshya</span>
          </NavLink>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-group-label">Menu</div>
          {NAV_ITEMS.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            >
              <span className="link-icon">{item.icon}</span>
              <span className="link-label">{item.label}</span>
              {/* Optional glowing dot indicator for active state */}
              <div className="active-indicator" />
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink 
            to="/student/profile" 
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <span className="link-icon"><Settings size={18} /></span>
            <span className="link-label">Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default StudentSidebar;
