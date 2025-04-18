import React from "react";
import { Link } from "react-router-dom";
import "./css/Footer.css"; 

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
            <li><a href="#hero">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><Link to="/jobseeker/jobs">Browse Jobs</Link></li>
            <li><a href="#company">Companies</a></li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" target="_blank" rel="noopener noreferrer">🔵 Github</a>
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
