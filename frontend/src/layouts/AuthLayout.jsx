import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar.jsx";
import AnimatedPage from "../components/common/AnimatedPage.jsx";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
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
