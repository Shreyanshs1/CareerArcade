import React from 'react'
import Navbar from './component/Navbar'
import './css/AdminDashboard.css' 
import { FaUsers, FaBriefcase, FaClipboardList } from 'react-icons/fa';

function AdminDashboard() {
  const usersCount = 100;
  const jobsCount = 50;
  const applicationsCount = 75;
  return (
    <>
    
    <div className="admin-dashboard">
    <Navbar/>
      <div className="dashboard-content">
        <header className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </header>
        <div className="cards-container">
          <div className="dashboard-card ct-1">
          <FaUsers className="card-icon" />
            <h2>Users</h2>
            <p>{usersCount}</p>
          </div>
          <div className="dashboard-card ct-2">
          <FaBriefcase className="card-icon" />
            <h2>Jobs</h2>
            <p>{jobsCount}</p>
          </div>
          <div className="dashboard-card ct-3">
          <FaClipboardList className="card-icon" />
            <h2>Applications</h2>
            <p>{applicationsCount}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default AdminDashboard