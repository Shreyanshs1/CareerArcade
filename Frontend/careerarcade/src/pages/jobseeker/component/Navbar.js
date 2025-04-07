import React from "react";
import { Link } from "react-router-dom";
import "../../../components/css/Navbar.css"; // Import CSS for styling
import Logo from "../../../assets/Logo.png"; 
import LogoutButton from "../../../components/Logout";

const Navbar = () => {
  return (
    <nav className="navbar z-index-10">
      <div className="logo">
        <img src={Logo} alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">CareerArcade</span>
      </div>
      <ul className="nav-links">
        <li><Link to="/your-profile">Profile</Link></li>
        <li><Link to="/jobseeker/dashboard">Dashboard</Link></li>
        <li><Link to="/jobseeker/jobs">Job Listings</Link></li>
      </ul>
      <div className="auth-buttons">
        <LogoutButton />
      </div>
    </nav>
  );
};

export default Navbar;
