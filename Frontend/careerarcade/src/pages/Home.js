import React from 'react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import './Home.css'; // Import your CSS file for styling
import meta from '../assets/meta.png';
import google from '../assets/google.png';
import apple from '../assets/apple.png';
import netflix from '../assets/netflix.png';
import samsung from '../assets/samsung.png';
import adobe from '../assets/adobe.png';
import Footer from '../components/Footer';

function Home() {
  const navigate = useNavigate(); //React hook for navigate
  // Check if user is already logged in and redirect
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        const tokenExp = localStorage.getItem("tokenExp");
        const currentTime = Date.now();

        if (token && role && tokenExp) {
        if (currentTime < tokenExp) {
            // Redirect to respective dashboard based on role
            switch (role) {
            case "Admin":
                navigate("/admin/dashboard");
                break;
            case "Employer":
                navigate("/employer/dashboard");
                break;
            case "Jobseeker":
                navigate("/jobseeker/dashboard");
                break;
            default:
                navigate("/");
            }
        }
        }
    }, [navigate]);


  
    const companyLogos = [
      meta,
      google,
      apple,
      netflix,
      samsung,
      adobe
    ];
  return (
    <>
    <Navbar/>
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Dream Job with <span className="highlight">CareerArcade</span></h1>
          <p>Connecting job seekers with top employers in just a few clicks.</p>
          <div className="hero-buttons">
            <Link to="/signup" className="btn-primary">Get Started</Link>
            <Link to="/login" className="btn-secondary">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose CareerArcade?</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <h3>🔍 Find Jobs Easily</h3>
            <p>Search from thousands of job listings across various industries.</p>
          </div>
          <div className="feature-item">
            <h3>📑 Easy Applications</h3>
            <p>Apply to jobs with just one click, no hassle.</p>
          </div>
          <div className="feature-item">
            <h3>🤝 Connect with Top Employers</h3>
            <p>Get noticed by leading companies and recruiters.</p>
          </div>
        </div>
      </section>

    {/* company-logo section */}
      <section className="company-logos">
        <h2>Trusted by Top Companies</h2>
        <div className="logo-grid">
          {companyLogos.map((logo, index) => (
            <img key={index} src={logo} alt={`Company ${index + 1}`} className="company-logo" />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About CareerArcade</h2>
        <p>
          CareerArcade is a platform dedicated to bridging the gap between job seekers and 
          employers. Our mission is to create a seamless hiring process, enabling candidates 
          to find their dream jobs and companies to discover top talent.
        </p>
        <p>
          Whether you're looking for a career change or seeking the perfect candidate, 
          CareerArcade makes the process easier, faster, and more efficient.
        </p>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works?</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Sign Up</h3>
            <p>Create your account in just a few minutes.</p>
          </div>
          <div className="step">
            <h3>2. Build Your Profile</h3>
            <p>Showcase your skills and experience to employers.</p>
          </div>
          <div className="step">
            <h3>3. Apply & Get Hired</h3>
            <p>Find the right job and start your career.</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <h2>Ready to Take the Next Step?</h2>
        <p>Sign up today and start your job search with CareerArcade.</p>
        <Link to="/signup" className="btn-primary">Join Now</Link>
      </section>
      <Footer/>
    </div>
    </>
  )
}

export default Home