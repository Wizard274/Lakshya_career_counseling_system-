import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar.jsx";
import CustomCursor from "../components/common/CustomCursor.jsx";
import AnimatedPage from "../components/common/AnimatedPage.jsx";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <CustomCursor />
      <Navbar simplified={true} />
      <main className="auth-main-content">
        <AnimatedPage>
          <Outlet />
        </AnimatedPage>
      </main>
    </div>
  );
};

export default AuthLayout;
