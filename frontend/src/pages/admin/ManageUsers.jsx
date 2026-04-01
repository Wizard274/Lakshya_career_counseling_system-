// pages/admin/ManageUsers.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import adminService from "../../services/adminService.js";
import { formatDateShort, getInitials } from "../../utils/helpers.js";
import { useDebounce } from "../../utils/useDebounce.js";

const ManageUsers = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [page, setPage]           = useState(1);
  const [pagination, setPagination] = useState({});

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (page !== 1) setPage(1);
    else fetchUsers();
  }, [debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { role: "student", page, limit: 10 };
      if (debouncedSearch && debouncedSearch.length >= 2) params.search = debouncedSearch;
      const data = await adminService.getUsers(params);
      setUsers(data.users); setPagination(data.pagination);
    } catch { } finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); };

  const handleToggle = async (id, active) => {
    if (!window.confirm(`${active ? "Deactivate" : "Activate"} this user?`)) return;
    try {
      const data = await adminService.toggleUserStatus(id);
      toast.success(`User ${data.isActive ? "activated" : "deactivated"} ✦`);
      fetchUsers();
    } catch { toast.error("Failed"); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Permanently delete ${name}?`)) return;
    try { await adminService.deleteUser(id); toast.success("Deleted ✦"); fetchUsers(); }
    catch { toast.error("Failed"); }
  };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">User Management</div>
          <h1>Manage Students ✦</h1>
          <p>{pagination.total || 0} registered students on the platform.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: "16px 20px" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12 }}>
            <div className="search-wrapper" style={{ flex: 1 }}>
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {/* Search button removed since it auto-filters */}
          </form>
        </div>
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Student</th><th>Email</th><th>Phone</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {users.length === 0 ? <tr><td colSpan={6} style={{ textAlign: "center", padding: 48, color: "var(--text-muted)" }}>No students found</td></tr> :
                users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="avatar-placeholder" style={{ width: 34, height: 34, fontSize: 12 }}>{getInitials(u.name)}</div>
                        <span style={{ fontWeight: 700, fontSize: 13.5 }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13 }}>{u.email}</td>
                    <td style={{ fontSize: 13 }}>{u.phone || "—"}</td>
                    <td style={{ fontSize: 13 }}>{formatDateShort(u.createdAt)}</td>
                    <td><span className={`badge ${u.isActive ? "badge-completed" : "badge-cancelled"}`}>{u.isActive ? "Active" : "Inactive"}</span></td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className={`btn btn-sm ${u.isActive ? "btn-glass" : "btn-success"}`} onClick={() => handleToggle(u._id, u.isActive)}>
                          {u.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id, u.name)}>Delete</button>
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

export default ManageUsers;
