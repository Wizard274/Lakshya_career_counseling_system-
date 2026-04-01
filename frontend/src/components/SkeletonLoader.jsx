// ============================================
// components/SkeletonLoader.jsx - NEW
// Animated skeleton placeholders for loading states
// ============================================

import React from "react";
import "../SkeletonLoader.css";

// ── Single skeleton block ─────────────────────────────────
export const Skeleton = ({ width = "100%", height = 16, borderRadius = 8, style = {} }) => (
  <div
    className="skeleton-block"
    style={{ width, height, borderRadius, ...style }}
  />
);

// ── Stat card skeleton ─────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="skeleton-stat-card">
    <Skeleton width={48} height={48} borderRadius={12} />
    <Skeleton width={80} height={36} style={{ marginTop: 14 }} />
    <Skeleton width={100} height={12} style={{ marginTop: 8 }} />
  </div>
);

// ── Stats grid skeleton ────────────────────────────────────
export const StatsGridSkeleton = ({ count = 4 }) => (
  <div className="skeleton-stats-grid">
    {[...Array(count)].map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

// ── Table row skeleton ─────────────────────────────────────
export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {[...Array(cols)].map((_, i) => (
      <td key={i} style={{ padding: "14px 18px" }}>
        <Skeleton height={14} width={i === 0 ? "80%" : "60%"} />
      </td>
    ))}
  </tr>
);

// ── Table skeleton ─────────────────────────────────────────
export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="skeleton-table-wrapper">
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          {[...Array(cols)].map((_, i) => (
            <th key={i} style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-color, #e4e4e7)" }}>
              <Skeleton height={11} width="70%" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...Array(rows)].map((_, i) => (
          <TableRowSkeleton key={i} cols={cols} />
        ))}
      </tbody>
    </table>
  </div>
);

// ── Counselor card skeleton ────────────────────────────────
export const CounselorCardSkeleton = () => (
  <div className="skeleton-counselor-card">
    <div style={{ height: 5 }} className="skeleton-block" />
    <div style={{ padding: 22 }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 14 }}>
        <Skeleton width={54} height={54} borderRadius="50%" />
        <div style={{ flex: 1 }}>
          <Skeleton height={16} width="70%" />
          <Skeleton height={12} width="50%" style={{ marginTop: 6 }} />
          <Skeleton height={10} width="40%" style={{ marginTop: 6 }} />
        </div>
      </div>
      <Skeleton height={12} style={{ marginBottom: 6 }} />
      <Skeleton height={12} width="85%" style={{ marginBottom: 14 }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <Skeleton width={70} height={24} borderRadius={99} />
        <Skeleton width={80} height={24} borderRadius={99} />
        <Skeleton width={60} height={24} borderRadius={99} />
      </div>
    </div>
    <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border-color, #e4e4e7)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Skeleton width={70} height={20} />
      <Skeleton width={100} height={34} borderRadius={99} />
    </div>
  </div>
);

// ── Counselors grid skeleton ───────────────────────────────
export const CounselorsGridSkeleton = ({ count = 6 }) => (
  <div className="skeleton-counselors-grid">
    {[...Array(count)].map((_, i) => (
      <CounselorCardSkeleton key={i} />
    ))}
  </div>
);

// ── Appointment card skeleton ──────────────────────────────
export const AppointmentSkeleton = () => (
  <div className="skeleton-apt-card">
    <Skeleton width={60} height={68} borderRadius={12} />
    <div style={{ flex: 1 }}>
      <Skeleton height={16} width="60%" />
      <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
        <Skeleton height={12} width={120} />
        <Skeleton height={12} width={80} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
      <Skeleton width={80} height={22} borderRadius={99} />
      <Skeleton width={70} height={30} borderRadius={99} />
    </div>
  </div>
);

// ── Appointment list skeleton ──────────────────────────────
export const AppointmentListSkeleton = ({ count = 4 }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {[...Array(count)].map((_, i) => (
      <AppointmentSkeleton key={i} />
    ))}
  </div>
);

// ── Page hero skeleton ─────────────────────────────────────
export const HeroSkeleton = () => (
  <div className="skeleton-hero">
    <Skeleton height={12} width={120} style={{ marginBottom: 12 }} />
    <Skeleton height={32} width="60%" style={{ marginBottom: 10 }} />
    <Skeleton height={16} width="80%" />
    <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
      <Skeleton width={140} height={40} borderRadius={99} />
      <Skeleton width={120} height={40} borderRadius={99} />
    </div>
  </div>
);

// ── Default export ─────────────────────────────────────────
const SkeletonLoader = ({ type = "table", ...props }) => {
  const components = {
    table:      <TableSkeleton {...props} />,
    stats:      <StatsGridSkeleton {...props} />,
    counselors: <CounselorsGridSkeleton {...props} />,
    appointments: <AppointmentListSkeleton {...props} />,
    hero:       <HeroSkeleton />,
  };
  return components[type] || <TableSkeleton {...props} />;
};

export default SkeletonLoader;
