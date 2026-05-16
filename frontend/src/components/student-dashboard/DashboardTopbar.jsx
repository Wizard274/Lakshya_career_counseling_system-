import React from "react";
import { useNavigate } from "react-router-dom";
import { useDashboardContext } from "../../context/DashboardContext.jsx";
import { useTheme } from "../../context/ThemeContext.jsx";
import authService from "../../services/authService.js";
import { getInitials } from "../../utils/helpers.js";
import { Menu, Bell, Moon, Sun, LogOut } from "lucide-react";

const DashboardTopbar = () => {
  const { toggleSidebar } = useDashboardContext();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <header className="dashboard-topbar">
      <div className="topbar-left">
        <button 
          className="icon-btn mobile-menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        {/* We can put breadcrumbs or page titles here if needed */}
        <h2 className="topbar-title desktop-only">Overview</h2>
      </div>

      <div className="topbar-right">
        <button 
          className="icon-btn theme-toggle-btn" 
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        
        <button className="icon-btn notifications-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notif-badge"></span>
        </button>

        <div className="user-profile-dropdown interactive">
          <div className="avatar-circle">
            {getInitials(user?.name)}
          </div>
          <div className="user-info desktop-only">
            <span className="user-name">{user?.name?.split(" ")[0]}</span>
            <span className="user-role">Student</span>
          </div>
        </div>

        <button 
          className="icon-btn logout-btn" 
          onClick={handleLogout}
          aria-label="Sign Out"
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default DashboardTopbar;
