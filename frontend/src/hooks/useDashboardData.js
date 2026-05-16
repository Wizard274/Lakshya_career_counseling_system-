import { useState, useEffect, useCallback } from "react";
import bookingService from "../services/bookingService.js";

export const useDashboardData = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    upcoming: 0,
    readinessScore: 85, // Placeholder for AI insights
    skillsCompleted: 12, // Placeholder for gamification
    weeklyGrowth: 15, // Placeholder for gamification
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch up to 10 latest bookings for the timeline
      const data = await bookingService.getBookings({ limit: 10 });
      setAppointments(data.appointments || []);
      
      const all = data.appointments || [];
      
      // Calculate realistic stats
      setStats((prev) => ({
        ...prev,
        total: data.pagination?.total || 0,
        pending: all.filter((a) => a.status === "pending").length,
        completed: all.filter((a) => a.status === "completed").length,
        upcoming: all.filter((a) => a.status === "approved").length,
      }));
    } catch (err) {
      console.error("Dashboard Data Fetch Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { appointments, stats, loading, error, refetch: fetchData };
};
