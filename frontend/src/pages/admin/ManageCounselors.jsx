// pages/admin/ManageCounselors.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import adminService from "../../services/adminService.js";
import { formatDateShort, getInitials } from "../../utils/helpers.js";
import { useDebounce } from "../../utils/useDebounce.js";

const ManageCounselors = () => {
  const [counselors, setCounselors]   = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [pagination, setPagination]   = useState({});

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (page !== 1) setPage(1);
    else fetchCounselors();
  }, [debouncedSearch]);

  useEffect(() => { fetchCounselors(); }, [page, filter]);

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (debouncedSearch && debouncedSearch.length >= 2) params.search = debouncedSearch;
      if (filter === "pending")  params.isApproved = "false";
      if (filter === "approved") params.isApproved = "true";
      const data = await adminService.getCounselors(params);
      setCounselors(data.counselors); setPagination(data.pagination);
    } catch { } finally { setLoading(false); }
  };

  const handleApproval = async (id, isApproved, name) => {
    if (!window.confirm(`${isApproved ? "Approve" : "Revoke"} ${name}?`)) return;
    try {
      await adminService.approveCounselor(id, isApproved);
      toast.success(`Counselor ${isApproved ? "approved" : "rejected"} ✦`);
      fetchCounselors();
    } catch { toast.error("Failed"); }
  };

  const handleToggle = async (id) => {
    try {
      const data = await adminService.toggleUserStatus(id);
      toast.success(`Account ${data.isActive ? "activated" : "deactivated"} ✦`);
      fetchCounselors();
    } catch { toast.error("Failed"); }
  };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Counselor Management</div>
          <h1>Manage Counselors ✦</h1>
          <p>Review applications, approve counselors, and manage the expert network.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: "flex", gap: 10, flex: 1, minWidth: 200 }}>
              <div className="search-wrapper" style={{ flex: 1 }}>
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="Search counselors..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              {/* Search button removed because it auto-updates using debouncing */}
            </form>
            <div style={{ display: "flex", gap: 8 }}>
              {["all", "pending", "approved"].map((f) => (
                <button key={f} className={`btn btn-sm${filter === f ? " btn-primary" : " btn-glass"}`} onClick={() => { setFilter(f); setPage(1); }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Counselor</th><th>Expertise</th><th>Experience</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {counselors.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>No counselors found</td></tr> :
                counselors.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 36, height: 36, fontSize: 13 }}>{getInitials(c.name)}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13.5 }}>{c.name}</div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {(c.expertise || []).slice(0, 2).map((tag) => <span key={tag} className="tag" style={{ fontSize: 11 }}>{tag}</span>)}
                        {(c.expertise || []).length > 2 && <span className="tag" style={{ fontSize: 11 }}>+{c.expertise.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{c.yearsOfExperience > 0 ? `${c.yearsOfExperience} yrs` : "—"}</td>
                    <td style={{ fontSize: 13 }}>{formatDateShort(c.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <span className={`badge ${c.isApproved ? "badge-completed" : "badge-pending"}`}>{c.isApproved ? "Approved" : "Pending"}</span>
                        <span className={`badge ${c.isActive ? "badge-approved" : "badge-cancelled"}`} style={{ fontSize: 10 }}>{c.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {!c.isApproved ? (
                          <button className="btn btn-success btn-sm" onClick={() => handleApproval(c._id, true, c.name)}>✓ Approve</button>
                        ) : (
                          <button className="btn btn-danger btn-sm" onClick={() => handleApproval(c._id, false, c.name)}>✕ Revoke</button>
                        )}
                        <button className="btn btn-glass btn-sm" onClick={() => handleToggle(c._id)}>
                          {c.isActive ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {pagination.pages > 1 && (
            <div className="pagination" style={{ padding: 16 }}>
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
              {[...Array(pagination.pages)].map((_, i) => <button key={i+1} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>)}
              <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
            </div>
          )}
        </div>
      )}
    </PageLayout>
  );
};

export default ManageCounselors;
