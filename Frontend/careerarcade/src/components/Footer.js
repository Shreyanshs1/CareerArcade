import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css"; // Import CSS for styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Name */}
        <div className="footer-logo">
          <h2>CareerArcade</h2>
          <p>Your gateway to a brighter career.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">🔵 Facebook</a>
            <a href="#" target="_blank" rel="noopener noreferrer">🔵 Twitter</a>
            <a href="#" target="_blank" rel="noopener noreferrer">🔵 LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CareerArcade. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
