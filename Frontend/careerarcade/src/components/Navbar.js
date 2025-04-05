import React from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";
import Logo from "../assets/Logo.png"; // Adjust the path to your logo image

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={Logo} alt="CareerArcade Logo" className="logo-img" />
        <span className="company-name">CareerArcade</span>
      </div>
      <ul className="nav-links">
        <li><a href="#hero">Home</a></li>
        <li><Link to="/jobs">Jobs</Link></li>
        <li><a href="#company">Companies</a></li>
        <li><a href="#about">About</a></li>
      </ul>
      <div className="auth-buttons">
        <Link to="/login" className="btn">Login</Link>
        <Link to="/signup" className="btn signup">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;
