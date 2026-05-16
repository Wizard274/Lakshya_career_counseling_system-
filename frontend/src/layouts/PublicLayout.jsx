import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/public/Navbar.jsx";
import Footer from "../components/public/Footer.jsx";
import ScrollProgress from "../components/common/ScrollProgress.jsx";
import AnimatedPage from "../components/common/AnimatedPage.jsx";

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <ScrollProgress />
      <Navbar />
      <main className="public-main-content">
        <AnimatedPage>
          <Outlet />
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
