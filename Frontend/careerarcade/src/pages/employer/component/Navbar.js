import React from "react";
import { Link } from "react-router-dom";
import "../../../components/css/Navbar.css"; // Import CSS for styling
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
        <li><Link to="/jobseeker/profile">Profile</Link></li>
        <li><Link to="/jobseeker/dashboard">Dashboard</Link></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
      </ul>
      <div className="auth-buttons">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
