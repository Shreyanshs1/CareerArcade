import React, { useState, useEffect } from 'react';
import Navbar from './component/Navbar';
import './css/AdminDashboard.css';
import { FaUsers, FaBriefcase, FaClipboardList, FaBuilding } from 'react-icons/fa';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    users: 0,
    jobs: 0,
    applications: 0,
    companies: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const DASHBOARD_API_URL = 'https://shreyansh1807.bsite.net/api/Admin/dashboard';

  // Function to fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(DASHBOARD_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();
      setDashboardData({
        users: data.users || 0,
        jobs: data.jobs || 0,
        applications: data.applications || 0,
        companies: data.companies || 0
      });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <>
      <div className="admin-dashboard">
        <Navbar />
        <div className="dashboard-content">
          <header className="dashboard-header">
            <h1>Admin Dashboard</h1>
          </header>

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <div className="cards-container">
              <div className="dashboard-card ct-1">
                <FaUsers className="card-icon" />
                <h2>Users</h2>
                <p>{dashboardData.users}</p>
              </div>
              <div className="dashboard-card ct-2">
                <FaBriefcase className="card-icon" />
                <h2>Jobs</h2>
                <p>{dashboardData.jobs}</p>
              </div>
              <div className="dashboard-card ct-3">
                <FaClipboardList className="card-icon" />
                <h2>Applications</h2>
                <p>{dashboardData.applications}</p>
              </div>
              <div className="dashboard-card ct-4">
                <FaBuilding className="card-icon" />
                <h2>Companies</h2>
                <p>{dashboardData.companies}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
