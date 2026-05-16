import React from "react";
import "../../styles/landing.css";

export const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-content">
      <div className="skeleton-text title" />
      <div className="skeleton-text desc" />
      <div className="skeleton-text desc short" />
    </div>
  </div>
);

export const SkeletonDashboard = () => (
  <div className="skeleton-dashboard">
    <div className="skeleton-header" />
    <div className="skeleton-grid">
      <div className="skeleton-box" />
      <div className="skeleton-box" />
      <div className="skeleton-box" />
      <div className="skeleton-box" />
    </div>
    <div className="skeleton-list">
      <div className="skeleton-item" />
      <div className="skeleton-item" />
      <div className="skeleton-item" />
    </div>
  </div>
);

export default SkeletonCard;
