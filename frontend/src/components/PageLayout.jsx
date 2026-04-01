// components/PageLayout.jsx — Lakshya Page Shell
import React from "react";
import Navbar from "./Navbar.jsx";

const PageLayout = ({ children }) => (
  <div className="page-layout">
    <Navbar />
    <main className="page-content anim-fadein">{children}</main>
  </div>
);

export default PageLayout;
