// pages/student/Counselors.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../../components/PageLayout.jsx";
import Loader from "../../components/Loader.jsx";
import bookingService from "../../services/bookingService.js";
import { getInitials, getStars, formatCurrency } from "../../utils/helpers.js";
import { EXPERTISE_OPTIONS } from "../../utils/constants.js";
import { useDebounce } from "../../utils/useDebounce.js";
import "../../styles/dashboard.css";

const Counselors = () => {
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expertise, setExpertise] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (page !== 1) setPage(1);
    else fetchCounselors();
  }, [debouncedSearch]);

  useEffect(() => { fetchCounselors(); }, [page, expertise]);

  const fetchCounselors = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (debouncedSearch && debouncedSearch.length >= 2) params.search = debouncedSearch;
      if (expertise) params.expertise = expertise;
      const data = await bookingService.getCounselors(params);
      setCounselors(data.counselors);
      setPagination(data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSearch = (e) => { e.preventDefault(); };

  return (
    <PageLayout>
      <div className="page-hero">
        <div className="page-hero-content">
          <div className="page-hero-eyebrow">Discover</div>
          <h1>Find Your Perfect Counselor ✦</h1>
          <p>Browse our curated network of verified career experts ready to guide your journey.</p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-body" style={{ padding: "16px 20px" }}>
          <form onSubmit={handleSearch} style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div className="search-wrapper" style={{ flex: 1, minWidth: 220 }}>
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search counselors..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={expertise} onChange={(e) => { setExpertise(e.target.value); setPage(1); }}>
              <option value="">All Expertise</option>
              {EXPERTISE_OPTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
            {/* Native debounce replaces manual search btn */}
          </form>
        </div>
      </div>

      {loading ? <div className="loader-center"><div className="spinner" /></div> :
        counselors.length === 0 ? (
          <div className="card"><div className="empty-state"><div className="empty-icon">👥</div><h4>No counselors found</h4><p>Try a different search or filter</p></div></div>
        ) : (
          <>
            <div className="counselors-grid">
              {counselors.map((c) => (
                <div className="counselor-card" key={c._id}>
                  <div className="counselor-strip" />
                  <div className="counselor-card-body">
                    <div className="counselor-top">
                      <div className="counselor-avatar-wrap">
                        <div className="avatar-placeholder" style={{ width: 54, height: 54, fontSize: 19 }}>{getInitials(c.name)}</div>
                        <div className="avail-dot" />
                      </div>
                      <div>
                        <div className="counselor-name">{c.name}</div>
                        <div className="counselor-exp">{c.yearsOfExperience > 0 ? `${c.yearsOfExperience} yrs experience` : "Career Counselor"}</div>
                        {c.rating > 0 && (
                          <div className="counselor-stars">
                            <span className="stars-text">{getStars(c.rating)}</span>
                            <span className="rating-num">{c.rating}</span>
                            <span className="rating-cnt">({c.totalReviews})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {c.bio && <p className="counselor-bio">{c.bio}</p>}
                    {c.expertise?.length > 0 && (
                      <div className="counselor-tags">
                        {c.expertise.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                        {c.expertise.length > 3 && <span className="tag">+{c.expertise.length - 3}</span>}
                      </div>
                    )}
                  </div>
                  <div className="counselor-footer">
                    <div className="counselor-rate">
                      {c.hourlyRate > 0 ? <>{formatCurrency(c.hourlyRate)}<small>/hr</small></> :
                        <span style={{ fontSize: 14, color: "var(--green)", fontWeight: 700, WebkitTextFillColor: "var(--green)" }}>Free</span>}
                    </div>
                    <Link to={`/student/book/${c._id}`} className="btn btn-primary btn-sm">Book Session</Link>
                  </div>
                </div>
              ))}
            </div>
            {pagination.pages > 1 && (
              <div className="pagination">
                <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
                {[...Array(pagination.pages)].map((_, i) => (
                  <button key={i+1} className={page === i+1 ? "active" : ""} onClick={() => setPage(i+1)}>{i+1}</button>
                ))}
                <button disabled={page === pagination.pages} onClick={() => setPage(page + 1)}>Next →</button>
              </div>
            )}
          </>
        )
      }
    </PageLayout>
  );
};

export default Counselors;
