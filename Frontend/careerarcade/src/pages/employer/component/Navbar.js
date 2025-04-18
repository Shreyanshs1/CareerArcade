import React from "react";
import { Link } from "react-router-dom";
import "../../../components/css/Navbar.css";
import Logo from "../../../assets/Logo.png"; 
import LogoutButton from "../../../components/Logout";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">CareerArcade</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/your-profile">Profile</Link></li>
        <li><Link to="/employer/dashboard">Dashboard</Link></li>
        <li><Link to="/employer/post-job">Post a Job</Link></li>
      </ul>
      <div className="auth-buttons">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
