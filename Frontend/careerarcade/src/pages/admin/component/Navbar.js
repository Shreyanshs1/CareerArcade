import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import Logout from '../../../components/Logout'; 
import Logo from '../../../assets/Logo.png'; 

const Navbar = () => {
  const name = localStorage.getItem('loggedInUser');


  return (
    <div className="vertical-navbar">
      {/* Header with logo and portal name */}
      <div className="navbar-header">
        <img src={Logo} alt="Job Portal Logo" className="logo" />
        <h1 className="portal-name">Hello "{name}"</h1>
      </div>
      
      {/* Navigation links */}
      <nav className="navbar-links">
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
          <li>
            <Link to="/admin/jobs">Jobs</Link>
          </li>
          <li>
            <Link to="/admin/companies">Companies</Link>
          </li>
          <li>
            <Link to="/admin/add-admin">Add Admin</Link>
          </li>
        </ul>
      </nav>
      
      {/* Footer with logout button */}
      <div className="navbar-footer">
        <Logout />
      </div>
    </div>
  );
};

export default Navbar;
